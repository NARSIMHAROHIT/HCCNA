import { n as createServerFn } from "./server-ClbIPfyi.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware--BG5KyxZ.mjs";
import { i as objectType, o as stringType, t as booleanType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-BbYHarZ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community.functions-Cw4QnN3d.js
/** Public reads for the donor wall and the temple board. */
var getCommunity_createServerFn_handler = createServerRpc({
	id: "b1c01c4a57f5f029ed11393c4b25ab168056f23e25fb6cf9632f7b21c07c3815",
	name: "getCommunity",
	filename: "src/lib/community.functions.ts"
}, (opts) => getCommunity.__executeServer(opts));
var getCommunity = createServerFn({ method: "GET" }).handler(getCommunity_createServerFn_handler, async () => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = createPublicServerClient();
	const { data: temple } = await supabase.from("temples").select("id, name, currency").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const [board, donors] = await Promise.all([supabase.from("board_members").select("*").eq("temple_id", temple.id).eq("is_active", true).order("display_order"), supabase.from("donors").select("*").eq("temple_id", temple.id).eq("is_published", true).order("display_order")]);
	return {
		temple,
		board: board.data ?? [],
		donors: donors.data ?? []
	};
});
var subscribeNewsletter_createServerFn_handler = createServerRpc({
	id: "7297db10bcd83ebb318694d114eec49dd65f3d9dc059a4e8fa1121176fd52957",
	name: "subscribeNewsletter",
	filename: "src/lib/community.functions.ts"
}, (opts) => subscribeNewsletter.__executeServer(opts));
var subscribeNewsletter = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	email: stringType().trim().email().max(255),
	fullName: stringType().trim().max(120).optional(),
	phone: stringType().trim().max(40).optional(),
	wantsVolunteering: booleanType().default(false)
}).parse(input)).handler(subscribeNewsletter_createServerFn_handler, async ({ data, context }) => {
	const { activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = context.supabase;
	const { data: temple } = await supabase.from("temples").select("id").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: existing } = await supabase.from("newsletter_subscribers").select("id").eq("temple_id", temple.id).eq("email", data.email).maybeSingle();
	const values = {
		temple_id: temple.id,
		user_id: context.userId,
		email: data.email,
		full_name: data.fullName ?? null,
		phone: data.phone ?? null,
		wants_volunteering: data.wantsVolunteering,
		is_active: true
	};
	const { error } = existing ? await supabase.from("newsletter_subscribers").update(values).eq("id", existing.id) : await supabase.from("newsletter_subscribers").insert(values);
	if (error) throw new Error(error.message);
	return {
		ok: true,
		updated: Boolean(existing)
	};
});
var volunteerForEvent_createServerFn_handler = createServerRpc({
	id: "0f778a4178f4c0fac708e6fa38b508e003e648a5baf69d87ad74eeb573bd782a",
	name: "volunteerForEvent",
	filename: "src/lib/community.functions.ts"
}, (opts) => volunteerForEvent.__executeServer(opts));
var volunteerForEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	eventId: stringType().uuid(),
	fullName: stringType().trim().max(120).optional(),
	phone: stringType().trim().max(40).optional(),
	rolePreference: stringType().trim().max(120).optional(),
	availability: stringType().trim().max(200).optional(),
	notes: stringType().trim().max(600).optional()
}).parse(input)).handler(volunteerForEvent_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	const values = {
		event_id: data.eventId,
		user_id: context.userId,
		full_name: data.fullName ?? null,
		phone: data.phone ?? null,
		role_preference: data.rolePreference ?? null,
		availability: data.availability ?? null,
		notes: data.notes ?? null
	};
	const { data: existing } = await supabase.from("event_volunteers").select("id").eq("event_id", data.eventId).eq("user_id", context.userId).maybeSingle();
	const { error } = existing ? await supabase.from("event_volunteers").update(values).eq("id", existing.id) : await supabase.from("event_volunteers").insert(values);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { getCommunity_createServerFn_handler, subscribeNewsletter_createServerFn_handler, volunteerForEvent_createServerFn_handler };
