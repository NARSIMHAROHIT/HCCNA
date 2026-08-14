import { i as getServerFnById, n as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-ClbIPfyi.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware--BG5KyxZ.mjs";
import { a as recordType, i as objectType, n as enumType, o as stringType, r as numberType, s as unknownType } from "../_libs/zod.mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-BQGefATD.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/queries-CH7ElXGN.js
/**
* Public content API. Every read is scoped to the temple configured for this
* deployment (TEMPLE_SLUG), so the same codebase serves any temple.
*/
var getSiteData = createServerFn({ method: "GET" }).handler(createSsrRpc("72d8957e8d6790aa0bcd06f5285d49a32dd6fca2ccb1d1f33fa73c33a9390c90"));
var getServiceBySlug = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1) }).parse(input)).handler(createSsrRpc("f5bb228111b3dc986131eba8cf88cebb61b23aaa5a7d002240452e9743de7d4a"));
var getEventBySlug = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1) }).parse(input)).handler(createSsrRpc("5cb16491917ea8b575f71b091116354822abf5deb496dc36b4d6c8f381532695"));
var getBooks = createServerFn({ method: "GET" }).handler(createSsrRpc("8d90df718b6b950670a8fae00bb6889afb9043ac31a934f466dfa4b6c4218f3c"));
var getPriestDirectory = createServerFn({ method: "GET" }).handler(createSsrRpc("689f0deed877e52244f2a47094664945725467a3a3495a8f6eda091e3e100c25"));
/** Panchang for the temple's configured coordinates. Serialised for display. */
var getPanchang = createServerFn({ method: "GET" }).inputValidator((input) => objectType({
	year: numberType().int().optional(),
	month: numberType().int().min(1).max(12).optional()
}).parse(input ?? {})).handler(createSsrRpc("ba60d7b579517ba9bda7d09d68fa419818a13ab41cce633bd3d7424fce172fba"));
/** Tables that are scoped through a parent row rather than a temple_id column. */
var tableSchema = enumType([
	"temples",
	"temple_schedules",
	"service_categories",
	"services",
	"events",
	"announcements",
	"board_members",
	"donors",
	"priests",
	"deities",
	"books",
	"event_items",
	"event_photos"
]);
var valuesSchema = recordType(stringType(), unknownType());
var getAdminData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0f1837f395f4bb48539777c2bbb6472ccf9a55c7f793455b67f68354476c518e"));
var saveRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	table: tableSchema,
	id: stringType().uuid().optional(),
	values: valuesSchema
}).parse(input)).handler(createSsrRpc("4b6e7e6681041490dc067e5a74efeeaa2c3dacb936f370cf20cace5f206f6a8d"));
var deleteRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	table: tableSchema,
	id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("56e0c992f75cb6547c2002a531f942e92547cc300b3d83a4e7b7e9b61fb46703"));
/** Audit trail of who changed events, priests, donors and deities. */
var getAuditLog = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("2f695832197dfa0cbc14c4031bc614cf181ed185713317040ffc624ee7876dd0"));
/** Newsletter subscribers, volunteers and temple administrators. */
var getAdminPeople = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4f4fe79369cdbaab809e1634b08eb4f24cf905460298401ad068975fa0940060"));
/** Grant temple administrator access to an existing account, by email. */
var grantAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ email: stringType().trim().email().max(255) }).parse(input)).handler(createSsrRpc("7f3bd8faf821df2e129c56673194fcd6849e1cf8938225a6d74d2bc45f75eea8"));
/** Remove temple administrator access from another account. */
var revokeAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ roleId: stringType().uuid() }).parse(input)).handler(createSsrRpc("06e0572fac90316a37f1b88d6cb83786d8a44f92579a42e2a91a7f7f3f158af7"));
/**
* Bootstrap: the first signed-in devotee can claim administrator access while
* the temple has no administrator at all. Once one exists this always fails.
*/
var claimFirstAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c"));
var siteQuery = queryOptions({
	queryKey: ["site"],
	queryFn: () => getSiteData(),
	staleTime: 6e4
});
var priestsQuery = queryOptions({
	queryKey: ["priests"],
	queryFn: () => getPriestDirectory(),
	staleTime: 6e4
});
var booksQuery = queryOptions({
	queryKey: ["books"],
	queryFn: () => getBooks(),
	staleTime: 6e4
});
var serviceQuery = (slug) => queryOptions({
	queryKey: ["service", slug],
	queryFn: () => getServiceBySlug({ data: { slug } }),
	staleTime: 6e4
});
var eventQuery = (slug) => queryOptions({
	queryKey: ["event", slug],
	queryFn: () => getEventBySlug({ data: { slug } }),
	staleTime: 6e4
});
var panchangQuery = (year, month) => queryOptions({
	queryKey: [
		"panchang",
		year ?? "now",
		month ?? "now"
	],
	queryFn: () => getPanchang({ data: {
		...year !== void 0 ? { year } : {},
		...month !== void 0 ? { month } : {}
	} }),
	staleTime: 3e5
});
var adminQuery = queryOptions({
	queryKey: ["admin"],
	queryFn: () => getAdminData(),
	staleTime: 1e4
});
var auditQuery = queryOptions({
	queryKey: ["admin", "audit"],
	queryFn: () => getAuditLog(),
	staleTime: 1e4
});
var adminPeopleQuery = queryOptions({
	queryKey: ["admin", "people"],
	queryFn: () => getAdminPeople(),
	staleTime: 1e4
});
//#endregion
export { claimFirstAdmin as a, grantAdmin as c, revokeAdmin as d, saveRecord as f, createSsrRpc as h, booksQuery as i, panchangQuery as l, siteQuery as m, adminQuery as n, deleteRecord as o, serviceQuery as p, auditQuery as r, eventQuery as s, adminPeopleQuery as t, priestsQuery as u };
