/**
 * Provider-agnostic checkout.
 *
 * One place records the payment row and hands the devotee a hosted checkout URL,
 * so poojas, donations, sponsorships and hall rentals all behave identically and
 * switching processors is a single decision (see activePaymentProvider).
 */

import { activePaymentProvider, createSquarePaymentLink, squareConfig } from "./square.server";

export interface StartCheckoutInput {
  templeId: string;
  templeName: string;
  currency: string;
  kind: string;
  serviceId?: string | null;
  itemName: string;
  amountCents: number;
  devoteeName: string;
  devoteeEmail: string;
  devoteePhone?: string | undefined;
  gotra?: string | undefined;
  nakshatra?: string | undefined;
  preferredDate?: string | undefined;
  notes?: string | undefined;
  userId?: string | undefined;
  origin: string;
  /** Where Square/Stripe sends the devotee if they abandon checkout. */
  cancelPath?: string | undefined;
}

export interface StartCheckoutResult {
  url: string;
  paymentId: string;
  receiptNumber: string;
  provider: "square" | "stripe";
}

export async function startCheckout(input: StartCheckoutInput): Promise<StartCheckoutResult> {
  const provider = activePaymentProvider();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: payment, error } = await supabaseAdmin
    .from("payments")
    .insert({
      temple_id: input.templeId,
      user_id: input.userId ?? null,
      kind: input.kind,
      service_id: input.serviceId ?? null,
      item_name: input.itemName,
      amount_cents: input.amountCents,
      currency: input.currency,
      devotee_name: input.devoteeName,
      devotee_email: input.devoteeEmail,
      devotee_phone: input.devoteePhone ?? null,
      gotra: input.gotra ?? null,
      nakshatra: input.nakshatra ?? null,
      preferred_date: input.preferredDate || null,
      notes: input.notes ?? null,
      status: "pending",
      provider,
    })
    .select("id, receipt_number")
    .single();

  if (error || !payment) throw new Error(error?.message ?? "Could not start this payment.");

  const cancelUrl = `${input.origin}${input.cancelPath ?? "/services"}`;

  if (provider === "square") {
    const config = squareConfig();
    if (!config)
      throw new Error("Online payments are not configured yet. Please contact the temple office.");

    const link = await createSquarePaymentLink({
      idempotencyKey: payment.id,
      name: input.itemName,
      amountCents: input.amountCents,
      currency: input.currency,
      // `ref` is our own payment id (an unguessable uuid) so the receipt resolves
      // even if Square changes which parameters it appends. Square adds
      // orderId / transactionId / referenceId alongside it.
      redirectUrl: `${input.origin}/receipt?ref=${payment.id}`,
      note: `${payment.receipt_number} — ${input.templeName}`,
      buyerEmail: input.devoteeEmail,
      buyerPhone: input.devoteePhone,
    });

    await supabaseAdmin
      .from("payments")
      .update({
        square_payment_link_id: link.id,
        square_order_id: link.order_id ?? null,
      })
      .eq("id", payment.id);

    return {
      url: link.url,
      paymentId: payment.id,
      receiptNumber: payment.receipt_number,
      provider,
    };
  }

  // ---- Stripe fallback -----------------------------------------------------
  const secret = process.env["STRIPE_SECRET_KEY"];
  if (!secret) {
    throw new Error("Online payments are not configured yet. Please contact the temple office.");
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.devoteeEmail,
    client_reference_id: payment.id,
    metadata: { payment_id: payment.id, receipt_number: payment.receipt_number },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: input.amountCents,
          product_data: {
            name: input.itemName,
            description: `${input.templeName} — ${input.kind}`,
          },
        },
      },
    ],
    success_url: `${input.origin}/receipt?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  await supabaseAdmin
    .from("payments")
    .update({ stripe_session_id: session.id })
    .eq("id", payment.id);

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return {
    url: session.url,
    paymentId: payment.id,
    receiptNumber: payment.receipt_number,
    provider,
  };
}
