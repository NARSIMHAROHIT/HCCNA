import { n as createServerFn } from "./server-ClbIPfyi.mjs";
import { i as objectType, n as enumType, o as stringType, r as numberType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-BbYHarZ6.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-DxFP99x-.js
/**
* Stripe checkout for poojas, sponsorships and donations.
* All writes use the service-role client (payments are insert-denied to clients).
*/
var checkoutInput = objectType({
	kind: enumType([
		"pooja",
		"donation",
		"sponsorship"
	]),
	serviceSlug: stringType().min(1).optional(),
	itemName: stringType().min(1).max(200),
	amountCents: numberType().int().min(100).max(5e6),
	devoteeName: stringType().min(1).max(120),
	devoteeEmail: stringType().email(),
	devoteePhone: stringType().max(40).optional(),
	gotra: stringType().max(120).optional(),
	nakshatra: stringType().max(120).optional(),
	preferredDate: stringType().max(20).optional(),
	notes: stringType().max(1e3).optional(),
	origin: stringType().url()
});
var createPaymentCheckout_createServerFn_handler = createServerRpc({
	id: "914cf93375092dbc15d00113a910b5961bab889590ca7b711696b9991df91a71",
	name: "createPaymentCheckout",
	filename: "src/lib/payments.functions.ts"
}, (opts) => createPaymentCheckout.__executeServer(opts));
var createPaymentCheckout = createServerFn({ method: "POST" }).inputValidator((input) => checkoutInput.parse(input)).handler(createPaymentCheckout_createServerFn_handler, async ({ data }) => {
	const secret = processModule.env["STRIPE_SECRET_KEY"];
	if (!secret) throw new Error("Online payments are not configured yet. Please contact the temple office.");
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const publicDb = createPublicServerClient();
	const { data: temple } = await publicDb.from("temples").select("id, name, currency").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	let serviceId = null;
	let itemName = data.itemName;
	let amountCents = data.amountCents;
	if (data.serviceSlug) {
		const { data: service } = await publicDb.from("services").select("id, name, price_cents, is_active").eq("temple_id", temple.id).eq("slug", data.serviceSlug).maybeSingle();
		if (!service || !service.is_active) throw new Error("This seva is not available right now.");
		serviceId = service.id;
		itemName = service.name;
		if (service.price_cents > 0) amountCents = service.price_cents;
	}
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: payment, error } = await supabaseAdmin.from("payments").insert({
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
		provider: "stripe"
	}).select("id, receipt_number").single();
	if (error || !payment) throw new Error(error?.message ?? "Could not start this payment.");
	const Stripe = (await import("../_libs/stripe.mjs").then((n) => n.t)).default;
	const session = await new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() }).checkout.sessions.create({
		mode: "payment",
		customer_email: data.devoteeEmail,
		client_reference_id: payment.id,
		metadata: {
			payment_id: payment.id,
			receipt_number: payment.receipt_number
		},
		line_items: [{
			quantity: 1,
			price_data: {
				currency: temple.currency.toLowerCase(),
				unit_amount: amountCents,
				product_data: {
					name: itemName,
					description: `${temple.name} — ${data.kind}`
				}
			}
		}],
		success_url: `${data.origin}/receipt?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${data.origin}/services`
	});
	await supabaseAdmin.from("payments").update({ stripe_session_id: session.id }).eq("id", payment.id);
	if (!session.url) throw new Error("Stripe did not return a checkout URL.");
	return { url: session.url };
});
var getReceipt_createServerFn_handler = createServerRpc({
	id: "ae5e4e0b556a82599c8d6ce5e2c7f800ce5b87b941d3d661f975ad05f4cf4201",
	name: "getReceipt",
	filename: "src/lib/payments.functions.ts"
}, (opts) => getReceipt.__executeServer(opts));
var getReceipt = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ sessionId: stringType().min(1) }).parse(input)).handler(getReceipt_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: payment } = await supabaseAdmin.from("payments").select("id, receipt_number, item_name, kind, amount_cents, currency, devotee_name, devotee_email, status, paid_at, created_at, notes, preferred_date, temple_id").eq("stripe_session_id", data.sessionId).maybeSingle();
	if (!payment) return null;
	let row = payment;
	const secret = processModule.env["STRIPE_SECRET_KEY"];
	if (row.status !== "paid" && secret) {
		const Stripe = (await import("../_libs/stripe.mjs").then((n) => n.t)).default;
		const session = await new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() }).checkout.sessions.retrieve(data.sessionId);
		if (session.payment_status === "paid") {
			const { data: updated } = await supabaseAdmin.from("payments").update({
				status: "paid",
				paid_at: (/* @__PURE__ */ new Date()).toISOString(),
				stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null
			}).eq("id", row.id).select("id, receipt_number, item_name, kind, amount_cents, currency, devotee_name, devotee_email, status, paid_at, created_at, notes, preferred_date, temple_id").single();
			if (updated) row = updated;
		}
	}
	const { data: temple } = await supabaseAdmin.from("temples").select("name, address_line1, city, state, postal_code, phone, email, website").eq("id", row.temple_id).maybeSingle();
	return {
		payment: row,
		temple
	};
});
//#endregion
export { createPaymentCheckout_createServerFn_handler, getReceipt_createServerFn_handler };
