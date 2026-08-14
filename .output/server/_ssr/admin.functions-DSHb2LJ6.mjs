import { n as createServerFn } from "./server-ClbIPfyi.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware--BG5KyxZ.mjs";
import { a as recordType, i as objectType, n as enumType, o as stringType, s as unknownType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-BbYHarZ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DSHb2LJ6.js
/**
* Temple admin console API. Every call runs as the signed-in user, so RLS
* (manages_temple / has_role) is the real authorisation boundary.
*/
var EDITABLE_TABLES = [
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
];
/** Tables that are scoped through a parent row rather than a temple_id column. */
var NO_TEMPLE_ID = ["event_items"];
var tableSchema = enumType(EDITABLE_TABLES);
var valuesSchema = recordType(stringType(), unknownType());
var getAdminData_createServerFn_handler = createServerRpc({
	id: "0f1837f395f4bb48539777c2bbb6472ccf9a55c7f793455b67f68354476c518e",
	name: "getAdminData",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminData.__executeServer(opts));
var getAdminData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAdminData_createServerFn_handler, async ({ context }) => {
	const { activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = context.supabase;
	const { data: temple, error } = await supabase.from("temples").select("*").eq("slug", activeTempleSlug()).maybeSingle();
	if (error) throw new Error(error.message);
	if (!temple) throw new Error("Temple not configured");
	const { data: canManage } = await supabase.rpc("manages_temple", {
		_user_id: context.userId,
		_temple_id: temple.id
	});
	if (!canManage) return { isAdmin: false };
	const [schedules, categories, services, events, announcements, board, donors, priests, deities, payments, bookings, eventItems, eventPhotos] = await Promise.all([
		supabase.from("temple_schedules").select("*").eq("temple_id", temple.id).order("day_of_week"),
		supabase.from("service_categories").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("services").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("events").select("*").eq("temple_id", temple.id).order("starts_at"),
		supabase.from("announcements").select("*").eq("temple_id", temple.id).order("created_at", { ascending: false }),
		supabase.from("board_members").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("donors").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("priests").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("deities").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("payments").select("*").eq("temple_id", temple.id).order("created_at", { ascending: false }).limit(300),
		supabase.from("bookings").select("id, reference, starts_at, status, payment_status, amount_cents, contact_name").eq("temple_id", temple.id).order("starts_at", { ascending: false }).limit(100),
		supabase.from("event_items").select("*").order("display_order"),
		supabase.from("event_photos").select("*").eq("temple_id", temple.id).order("display_order")
	]);
	return {
		isAdmin: true,
		temple,
		schedules: schedules.data ?? [],
		categories: categories.data ?? [],
		services: services.data ?? [],
		events: events.data ?? [],
		announcements: announcements.data ?? [],
		board: board.data ?? [],
		donors: donors.data ?? [],
		priests: priests.data ?? [],
		deities: deities.data ?? [],
		payments: payments.data ?? [],
		bookings: bookings.data ?? [],
		eventItems: eventItems.data ?? [],
		eventPhotos: eventPhotos.data ?? []
	};
});
var saveRecord_createServerFn_handler = createServerRpc({
	id: "4b6e7e6681041490dc067e5a74efeeaa2c3dacb936f370cf20cace5f206f6a8d",
	name: "saveRecord",
	filename: "src/lib/admin.functions.ts"
}, (opts) => saveRecord.__executeServer(opts));
var saveRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	table: tableSchema,
	id: stringType().uuid().optional(),
	values: valuesSchema
}).parse(input)).handler(saveRecord_createServerFn_handler, async ({ data, context }) => {
	const supabase = context.supabase;
	const values = data.values;
	if (data.id) {
		const { error } = await supabase.from(data.table).update(values).eq("id", data.id);
		if (error) throw new Error(error.message);
		return { ok: true };
	}
	const { activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const { data: temple } = await supabase.from("temples").select("id").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const payload = NO_TEMPLE_ID.includes(data.table) ? values : {
		...values,
		temple_id: temple.id
	};
	const { error } = await supabase.from(data.table).insert(payload);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteRecord_createServerFn_handler = createServerRpc({
	id: "56e0c992f75cb6547c2002a531f942e92547cc300b3d83a4e7b7e9b61fb46703",
	name: "deleteRecord",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteRecord.__executeServer(opts));
var deleteRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	table: tableSchema,
	id: stringType().uuid()
}).parse(input)).handler(deleteRecord_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getAuditLog_createServerFn_handler = createServerRpc({
	id: "2f695832197dfa0cbc14c4031bc614cf181ed185713317040ffc624ee7876dd0",
	name: "getAuditLog",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getAuditLog.__executeServer(opts));
var getAuditLog = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAuditLog_createServerFn_handler, async ({ context }) => {
	const { activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = context.supabase;
	const { data: temple } = await supabase.from("temples").select("id").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: canManage } = await supabase.rpc("manages_temple", {
		_user_id: context.userId,
		_temple_id: temple.id
	});
	if (!canManage) return { isAdmin: false };
	const { data: entries, error } = await supabase.from("audit_logs").select("*").eq("temple_id", temple.id).order("created_at", { ascending: false }).limit(300);
	if (error) throw new Error(error.message);
	const actorIds = Array.from(new Set((entries ?? []).map((e) => e.actor_id).filter((v) => Boolean(v))));
	const { data: actors } = actorIds.length ? await supabase.from("profiles").select("id, full_name, email").in("id", actorIds) : { data: [] };
	return {
		isAdmin: true,
		entries: entries ?? [],
		actors: actors ?? []
	};
});
var getAdminPeople_createServerFn_handler = createServerRpc({
	id: "4f4fe79369cdbaab809e1634b08eb4f24cf905460298401ad068975fa0940060",
	name: "getAdminPeople",
	filename: "src/lib/admin.functions.ts"
}, (opts) => getAdminPeople.__executeServer(opts));
var getAdminPeople = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getAdminPeople_createServerFn_handler, async ({ context }) => {
	const { activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = context.supabase;
	const { data: temple } = await supabase.from("temples").select("id").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: canManage } = await supabase.rpc("manages_temple", {
		_user_id: context.userId,
		_temple_id: temple.id
	});
	if (!canManage) return { isAdmin: false };
	const [subscribers, volunteers, roles, events] = await Promise.all([
		supabase.from("newsletter_subscribers").select("*").eq("temple_id", temple.id).order("created_at", { ascending: false }),
		supabase.from("event_volunteers").select("*").order("created_at", { ascending: false }).limit(300),
		supabase.from("user_roles").select("*").eq("temple_id", temple.id),
		supabase.from("events").select("id, title").eq("temple_id", temple.id)
	]);
	const userIds = Array.from(/* @__PURE__ */ new Set([...(roles.data ?? []).map((r) => r.user_id), ...(volunteers.data ?? []).map((v) => v.user_id)]));
	const { data: profiles } = userIds.length ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds) : { data: [] };
	return {
		isAdmin: true,
		templeId: temple.id,
		subscribers: subscribers.data ?? [],
		volunteers: volunteers.data ?? [],
		roles: roles.data ?? [],
		events: events.data ?? [],
		profiles: profiles ?? [],
		currentUserId: context.userId
	};
});
var grantAdmin_createServerFn_handler = createServerRpc({
	id: "7f3bd8faf821df2e129c56673194fcd6849e1cf8938225a6d74d2bc45f75eea8",
	name: "grantAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => grantAdmin.__executeServer(opts));
var grantAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ email: stringType().trim().email().max(255) }).parse(input)).handler(grantAdmin_createServerFn_handler, async ({ data, context }) => {
	const { activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = context.supabase;
	const { data: temple } = await supabase.from("temples").select("id").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: canManage } = await supabase.rpc("manages_temple", {
		_user_id: context.userId,
		_temple_id: temple.id
	});
	if (!canManage) throw new Error("Forbidden");
	const { data: profile } = await supabase.from("profiles").select("id").ilike("email", data.email).maybeSingle();
	if (!profile) throw new Error("No account found with that email. Ask them to sign up first.");
	const { error } = await supabase.from("user_roles").insert({
		user_id: profile.id,
		role: "temple_admin",
		temple_id: temple.id
	});
	if (error && !error.message.includes("duplicate")) throw new Error(error.message);
	return { ok: true };
});
var revokeAdmin_createServerFn_handler = createServerRpc({
	id: "06e0572fac90316a37f1b88d6cb83786d8a44f92579a42e2a91a7f7f3f158af7",
	name: "revokeAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => revokeAdmin.__executeServer(opts));
var revokeAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ roleId: stringType().uuid() }).parse(input)).handler(revokeAdmin_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("user_roles").delete().eq("id", data.roleId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var claimFirstAdmin_createServerFn_handler = createServerRpc({
	id: "d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c",
	name: "claimFirstAdmin",
	filename: "src/lib/admin.functions.ts"
}, (opts) => claimFirstAdmin.__executeServer(opts));
var claimFirstAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(claimFirstAdmin_createServerFn_handler, async ({ context }) => {
	const { activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: temple } = await supabaseAdmin.from("temples").select("id").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: existing } = await supabaseAdmin.from("user_roles").select("id").eq("temple_id", temple.id).in("role", ["temple_admin", "super_admin"]).limit(1);
	if (existing && existing.length > 0) throw new Error("This temple already has an administrator. Ask them to add you.");
	const { error } = await supabaseAdmin.from("user_roles").insert({
		user_id: context.userId,
		role: "temple_admin",
		temple_id: temple.id
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { claimFirstAdmin_createServerFn_handler, deleteRecord_createServerFn_handler, getAdminData_createServerFn_handler, getAdminPeople_createServerFn_handler, getAuditLog_createServerFn_handler, grantAdmin_createServerFn_handler, revokeAdmin_createServerFn_handler, saveRecord_createServerFn_handler };
