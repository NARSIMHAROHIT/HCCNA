import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Hosted checkout for poojas, sponsorships and donations.
 *
 * Square is the active processor (see square.server.ts → activePaymentProvider);
 * Stripe remains wired up as a fallback and is used automatically when Square
 * credentials are absent, or when PAYMENT_PROVIDER=stripe is set.
 *
 * All writes use the service-role client (payments are insert-denied to clients).
 */

const PAYMENT_COLUMNS =
  "id, receipt_number, item_name, kind, amount_cents, currency, devotee_name, devotee_email, status, paid_at, created_at, notes, preferred_date, temple_id, provider";

export interface ReceiptPayment {
  id: string;
  receipt_number: string;
  item_name: string;
  kind: string;
  amount_cents: number;
  currency: string;
  devotee_name: string | null;
  devotee_email: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
  notes: string | null;
  preferred_date: string | null;
  temple_id: string;
  provider: string;
}

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

    const { startCheckout } = await import("./checkout.server");
    const result = await startCheckout({
      templeId: temple.id,
      templeName: temple.name,
      currency: temple.currency,
      kind: data.kind,
      serviceId,
      itemName,
      amountCents,
      devoteeName: data.devoteeName,
      devoteeEmail: data.devoteeEmail,
      devoteePhone: data.devoteePhone,
      gotra: data.gotra,
      nakshatra: data.nakshatra,
      preferredDate: data.preferredDate,
      notes: data.notes,
      origin: data.origin,
      cancelPath: data.kind === "donation" ? "/donate" : "/services",
    });

    return { url: result.url, provider: result.provider };
  });

/**
 * Receipt lookup.
 *
 * Stripe returns its checkout session id; Square appends `orderId` to the
 * redirect. Either one identifies the payment, and both are unguessable, so the
 * receipt stays private without needing a sign-in.
 */
const receiptInput = z
  .object({
    sessionId: z.string().min(1).optional(),
    orderId: z.string().min(1).optional(),
    /** Our own payment id, handed back on the Square redirect. */
    ref: z.string().uuid().optional(),
  })
  .refine((v) => Boolean(v.sessionId || v.orderId || v.ref), {
    message: "A payment reference is required.",
  });

export const getReceipt = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => receiptInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const query = supabaseAdmin.from("payments").select(PAYMENT_COLUMNS);
    const { data: found } = data.ref
      ? await query.eq("id", data.ref).maybeSingle()
      : data.orderId
        ? await query.eq("square_order_id", data.orderId).maybeSingle()
        : await query.eq("stripe_session_id", data.sessionId!).maybeSingle();

    if (!found) return null;
    let row = found as unknown as ReceiptPayment;

    if (row.status !== "paid") {
      // A `ref` lookup does not carry the provider's own id — read it back.
      const orderId = data.orderId ?? (await squareOrderIdFor(row.id));
      row = await reconcile(row, {
        ...(data.sessionId ? { sessionId: data.sessionId } : {}),
        ...(orderId ? { orderId } : {}),
      });
    }

    const { data: temple } = await supabaseAdmin
      .from("temples")
      .select("name, address_line1, city, state, postal_code, phone, email, website")
      .eq("id", row.temple_id)
      .maybeSingle();

    return { payment: row, temple };
  });

async function squareOrderIdFor(paymentId: string): Promise<string | undefined> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("payments")
    .select("square_order_id")
    .eq("id", paymentId)
    .maybeSingle();
  return data?.square_order_id ?? undefined;
}

/** The webhook is authoritative, but a devotee can land here before it arrives. */
async function reconcile(
  row: ReceiptPayment,
  ref: { sessionId?: string | undefined; orderId?: string | undefined },
): Promise<ReceiptPayment> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  if (ref.orderId) {
    const { retrieveSquareOrder, squareOrderIsPaid, squareConfigured } =
      await import("./square.server");
    if (!squareConfigured()) return row;

    const order = await retrieveSquareOrder(ref.orderId);
    if (!squareOrderIsPaid(order)) return row;

    const { data: updated } = await supabaseAdmin
      .from("payments")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        square_payment_id: order?.tenders?.[0]?.payment_id ?? null,
      })
      .eq("id", row.id)
      .select(PAYMENT_COLUMNS)
      .single();
    return (updated as unknown as ReceiptPayment | null) ?? row;
  }

  const secret = process.env["STRIPE_SECRET_KEY"];
  if (!secret || !ref.sessionId) return row;

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() });
  const session = await stripe.checkout.sessions.retrieve(ref.sessionId);
  if (session.payment_status !== "paid") return row;

  const { data: updated } = await supabaseAdmin
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    })
    .eq("id", row.id)
    .select(PAYMENT_COLUMNS)
    .single();
  return (updated as unknown as ReceiptPayment | null) ?? row;
}
