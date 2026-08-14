import { r as __toESM } from "../_runtime.mjs";
import { n as createServerFn } from "./server-ClbIPfyi.mjs";
import { m as require_react } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { k as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as requireSupabaseAuth } from "./auth-middleware--BG5KyxZ.mjs";
import { h as createSsrRpc } from "./queries-CH7ElXGN.mjs";
import { i as objectType, n as enumType, o as stringType, r as numberType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/booking.functions-DF3vcD-j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
/** Availability lookup — public, so the slot picker works before sign-in. */
var getServiceAvailability = createServerFn({ method: "GET" }).inputValidator((input) => objectType({
	serviceSlug: stringType().min(1),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(input)).handler(createSsrRpc("02a72433e0a55d8d57e9bc21101895dbde29de4697d0be53cf5a1d07b0467de1"));
var bookingInput = objectType({
	serviceSlug: stringType().min(1),
	startsAt: stringType().min(10),
	priestId: stringType().uuid(),
	locationType: enumType(["temple", "home"]),
	address: stringType().max(400).optional(),
	contactName: stringType().min(2).max(120),
	contactPhone: stringType().min(7).max(40),
	contactEmail: stringType().email(),
	gotra: stringType().max(120).optional(),
	nakshatra: stringType().max(120).optional(),
	notes: stringType().max(2e3).optional()
});
var createBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => bookingInput.parse(input)).handler(createSsrRpc("d5d1516df3b15f9b01e23ed40cda22b58728aafe46e1ea4dd526f9df75ede78c"));
var getMyDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0b1fda76698d818c183c739e627db859295b336dbf95ea3fe75f3349ecf2d146"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	full_name: stringType().min(2).max(120),
	phone: stringType().max(40).optional(),
	address: stringType().max(300).optional(),
	city: stringType().max(80).optional(),
	state: stringType().max(80).optional(),
	postal_code: stringType().max(20).optional(),
	preferred_language: stringType().max(20).optional()
}).parse(input)).handler(createSsrRpc("3d6080b78469ffc041c89ca44cd410f4207ca8b416dcfc63d887ddecba08f3cb"));
var cancelMyBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(createSsrRpc("6a7ec55dccf58578ec1151345d4cfa48d264c5c49a0e3a18d8c48a3efd623d5d"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	eventId: stringType().uuid(),
	attendees: numberType().int().min(1).max(20)
}).parse(input)).handler(createSsrRpc("f297149a15375fe3d3589bc6760fa1814ab6b3ed0728e6bcc05aabe2fbfdd47f"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("898f3aed07f078ebce84ad3a4b9af700ee6a1002e7ee68101a9b9f2e337f8a48"));
//#endregion
export { updateMyProfile as a, getServiceAvailability as i, createBooking as n, useServerFn as o, getMyDashboard as r, cancelMyBooking as t };
