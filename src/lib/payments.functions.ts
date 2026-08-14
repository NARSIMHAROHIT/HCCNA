import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Stripe checkout for poojas, sponsorships and donations.
 * All writes use the service-role client (payments are insert-denied to clients).
 */

const checkoutInput = z.object({
  kind: z.enum(["pooja", "donation", "sponsorship"]),
  serviceSlug: z.string().min(1).optional(),
  itemName: z.string().min(1).max(200),
  amountCents: z.number().int().min(100).max(5_000_000),
  devoteeName: z.string().min(1).max(120),
  devoteeEmail: z.string().email(),
  devoteePhone: z.string().max(40).optional(),
  gotra: z.string().max(120).optional(),
  nakshatra: z.string().max(120).optional(),
  preferredDate: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
  origin: z.string().url(),
});

export const createPaymentCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkoutInput.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env["STRIPE_SECRET_KEY"];
    if (!secret) {
      throw new Error("Online payments are not configured yet. Please contact the temple office.");
    }

    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const publicDb = createPublicServerClient();

    const { data: temple } = await publicDb
      .from("temples")
      .select("id, name, currency")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    let serviceId: string | null = null;
    let itemName = data.itemName;
    let amountCents = data.amountCents;

    if (data.serviceSlug) {
      const { data: service } = await publicDb
        .from("services")
        .select("id, name, price_cents, is_active")
        .eq("temple_id", temple.id)
        .eq("slug", data.serviceSlug)
        .maybeSingle();
      if (!service || !service.is_active) throw new Error("This seva is not available right now.");
      serviceId = service.id;
      itemName = service.name;
      // Trust the catalogue price, never the browser, unless the seva is pay-what-you-wish.
      if (service.price_cents > 0) amountCents = service.price_cents;
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: payment, error } = await supabaseAdmin
      .from("payments")
      .insert({
        temple_id: temple.id,
        kind: data.kind,
        service_id: serviceId,
        item_name: itemName,
        amount_cents: amountCents,
        currency: temple.currency,
        devotee_name: data.devoteeName,
        devotee_email: data.devoteeEmail,
        devotee_phone: data.devoteePhone ?? null,
        gotra: data.gotra ?? null,
        nakshatra: data.nakshatra ?? null,
        preferred_date: data.preferredDate || null,
        notes: data.notes ?? null,
        status: "pending",
        provider: "stripe",
      })
      .select("id, receipt_number")
      .single();
    if (error || !payment) throw new Error(error?.message ?? "Could not start this payment.");

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.devoteeEmail,
      client_reference_id: payment.id,
      metadata: { payment_id: payment.id, receipt_number: payment.receipt_number },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: temple.currency.toLowerCase(),
            unit_amount: amountCents,
            product_data: {
              name: itemName,
              description: `${temple.name} — ${data.kind}`,
            },
          },
        },
      ],
      success_url: `${data.origin}/receipt?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/services`,
    });

    await supabaseAdmin
      .from("payments")
      .update({ stripe_session_id: session.id })
      .eq("id", payment.id);

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return { url: session.url };
  });

/** Receipt lookup by Stripe session id. Reconciles with Stripe if the webhook hasn't landed. */
export const getReceipt = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ sessionId: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select(
        "id, receipt_number, item_name, kind, amount_cents, currency, devotee_name, devotee_email, status, paid_at, created_at, notes, preferred_date, temple_id",
      )
      .eq("stripe_session_id", data.sessionId)
      .maybeSingle();
    if (!payment) return null;

    let row = payment;
    const secret = process.env["STRIPE_SECRET_KEY"];
    if (row.status !== "paid" && secret) {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() });
      const session = await stripe.checkout.sessions.retrieve(data.sessionId);
      if (session.payment_status === "paid") {
        const { data: updated } = await supabaseAdmin
          .from("payments")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            stripe_payment_intent:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
          })
          .eq("id", row.id)
          .select(
            "id, receipt_number, item_name, kind, amount_cents, currency, devotee_name, devotee_email, status, paid_at, created_at, notes, preferred_date, temple_id",
          )
          .single();
        if (updated) row = updated;
      }
    }

    const { data: temple } = await supabaseAdmin
      .from("temples")
      .select("name, address_line1, city, state, postal_code, phone, email, website")
      .eq("id", row.temple_id)
      .maybeSingle();

    return { payment: row, temple };
  });
