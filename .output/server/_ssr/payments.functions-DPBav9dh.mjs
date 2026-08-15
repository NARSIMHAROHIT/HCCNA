import { V as createSsrRpc, _ as createServerFn } from "./queries-BRGPrPxK.mjs";
import { i as objectType, n as enumType, o as stringType, r as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-DPBav9dh.js
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
var createPaymentCheckout = createServerFn({ method: "POST" }).inputValidator((input) => checkoutInput.parse(input)).handler(createSsrRpc("914cf93375092dbc15d00113a910b5961bab889590ca7b711696b9991df91a71"));
/** Receipt lookup by Stripe session id. Reconciles with Stripe if the webhook hasn't landed. */
var getReceipt = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ sessionId: stringType().min(1) }).parse(input)).handler(createSsrRpc("ae5e4e0b556a82599c8d6ce5e2c7f800ce5b87b941d3d661f975ad05f4cf4201"));
//#endregion
export { getReceipt as n, createPaymentCheckout as t };
