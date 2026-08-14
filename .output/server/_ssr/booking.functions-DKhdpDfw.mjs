import { n as createServerFn } from "./server-ClbIPfyi.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware--BG5KyxZ.mjs";
import { i as objectType, n as enumType, o as stringType, r as numberType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-BbYHarZ6.mjs";
import { i as zonedTimeToUtc, r as weekdayOfIsoDate } from "./timezone-BD2Gbves.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/booking.functions-DKhdpDfw.js
function minutesOf(time) {
	const [h, m] = time.split(":").map(Number);
	return (h ?? 0) * 60 + (m ?? 0);
}
function computeSlots(input) {
	const { date, timezone, durationMinutes, bufferMinutes, minNoticeHours, priests, windows, blackouts, bookings, now = /* @__PURE__ */ new Date(), stepMinutes = 30 } = input;
	const [y, m, d] = date.split("-").map(Number);
	if (!y || !m || !d) return [];
	const weekday = weekdayOfIsoDate(date);
	const earliest = now.getTime() + minNoticeHours * 36e5;
	const slots = [];
	for (const priest of priests) {
		if (blackouts.some((b) => b.priest_id === priest.id && date >= b.start_date && date <= b.end_date)) continue;
		const priestBookings = bookings.filter((b) => b.priest_id === priest.id);
		if (priestBookings.filter((b) => {
			return new Intl.DateTimeFormat("en-CA", {
				timeZone: timezone,
				year: "numeric",
				month: "2-digit",
				day: "2-digit"
			}).format(new Date(b.starts_at)) === date;
		}).length >= priest.max_bookings_per_day) continue;
		for (const window of windows.filter((w) => w.priest_id === priest.id && w.day_of_week === weekday)) {
			const windowStart = minutesOf(window.start_time);
			const windowEnd = minutesOf(window.end_time);
			const needed = durationMinutes + bufferMinutes;
			for (let start = windowStart; start + needed <= windowEnd; start += stepMinutes) {
				const startsAt = zonedTimeToUtc(timezone, y, m, d, Math.floor(start / 60), start % 60);
				if (startsAt.getTime() < earliest) continue;
				const endsAt = new Date(startsAt.getTime() + durationMinutes * 6e4);
				const blockedStart = startsAt.getTime() - bufferMinutes * 6e4;
				const blockedEnd = endsAt.getTime() + bufferMinutes * 6e4;
				if (priestBookings.some((b) => {
					const bs = new Date(b.starts_at).getTime();
					const be = new Date(b.ends_at).getTime();
					return bs < blockedEnd && be > blockedStart;
				})) continue;
				slots.push({
					startsAt: startsAt.toISOString(),
					endsAt: endsAt.toISOString(),
					label: new Intl.DateTimeFormat("en-US", {
						timeZone: timezone,
						hour: "numeric",
						minute: "2-digit"
					}).format(startsAt),
					priestId: priest.id,
					priestName: priest.full_name
				});
			}
		}
	}
	const byTime = /* @__PURE__ */ new Map();
	for (const slot of slots.sort((a, b) => a.priestName.localeCompare(b.priestName))) if (!byTime.has(slot.startsAt)) byTime.set(slot.startsAt, slot);
	return [...byTime.values()].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
/** Availability lookup — public, so the slot picker works before sign-in. */
var getServiceAvailability_createServerFn_handler = createServerRpc({
	id: "02a72433e0a55d8d57e9bc21101895dbde29de4697d0be53cf5a1d07b0467de1",
	name: "getServiceAvailability",
	filename: "src/lib/booking.functions.ts"
}, (opts) => getServiceAvailability.__executeServer(opts));
var getServiceAvailability = createServerFn({ method: "GET" }).inputValidator((input) => objectType({
	serviceSlug: stringType().min(1),
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/)
}).parse(input)).handler(getServiceAvailability_createServerFn_handler, async ({ data }) => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = createPublicServerClient();
	const { data: temple } = await supabase.from("temples").select("id, timezone, currency").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: service } = await supabase.from("services").select("*").eq("temple_id", temple.id).eq("slug", data.serviceSlug).maybeSingle();
	if (!service) return {
		slots: [],
		service: null,
		timezone: temple.timezone
	};
	const { data: links } = await supabase.from("priest_services").select("priest_id").eq("service_id", service.id);
	const priestIds = (links ?? []).map((l) => l.priest_id);
	if (priestIds.length === 0) return {
		slots: [],
		service,
		timezone: temple.timezone
	};
	const dayStart = /* @__PURE__ */ new Date(`${data.date}T00:00:00Z`);
	const [priests, windows, blackouts, bookings] = await Promise.all([
		supabase.from("priests").select("id, full_name, max_bookings_per_day").in("id", priestIds).eq("is_active", true),
		supabase.from("priest_availability").select("*").in("priest_id", priestIds),
		supabase.from("priest_blackouts").select("*").in("priest_id", priestIds),
		supabase.from("bookings").select("priest_id, starts_at, ends_at").in("priest_id", priestIds).gte("starts_at", (/* @__PURE__ */ new Date(dayStart.getTime() - 864e5)).toISOString()).lte("starts_at", new Date(dayStart.getTime() + 1728e5).toISOString())
	]);
	return {
		slots: computeSlots({
			date: data.date,
			timezone: temple.timezone,
			durationMinutes: service.duration_minutes,
			bufferMinutes: service.buffer_minutes,
			minNoticeHours: service.min_notice_hours,
			priests: priests.data ?? [],
			windows: windows.data ?? [],
			blackouts: blackouts.data ?? [],
			bookings: bookings.data ?? []
		}),
		service,
		timezone: temple.timezone
	};
});
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
var createBooking_createServerFn_handler = createServerRpc({
	id: "d5d1516df3b15f9b01e23ed40cda22b58728aafe46e1ea4dd526f9df75ede78c",
	name: "createBooking",
	filename: "src/lib/booking.functions.ts"
}, (opts) => createBooking.__executeServer(opts));
var createBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => bookingInput.parse(input)).handler(createBooking_createServerFn_handler, async ({ data, context }) => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const pub = createPublicServerClient();
	const { data: temple } = await pub.from("temples").select("id, timezone, name").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: service } = await pub.from("services").select("*").eq("temple_id", temple.id).eq("slug", data.serviceSlug).maybeSingle();
	if (!service) throw new Error("That service is no longer available.");
	const startsAt = new Date(data.startsAt);
	if (Number.isNaN(startsAt.getTime())) throw new Error("Invalid time selected.");
	if (startsAt.getTime() < Date.now() + service.min_notice_hours * 36e5) throw new Error("That time no longer meets the minimum notice for this service.");
	const endsAt = new Date(startsAt.getTime() + service.duration_minutes * 6e4);
	const localDate = new Intl.DateTimeFormat("en-CA", {
		timeZone: temple.timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(startsAt);
	const [priests, windows, blackouts, existing] = await Promise.all([
		pub.from("priests").select("id, full_name, max_bookings_per_day").eq("id", data.priestId).eq("is_active", true),
		pub.from("priest_availability").select("*").eq("priest_id", data.priestId),
		pub.from("priest_blackouts").select("*").eq("priest_id", data.priestId),
		pub.from("bookings").select("priest_id, starts_at, ends_at").eq("priest_id", data.priestId).neq("status", "cancelled").gte("starts_at", (/* @__PURE__ */ new Date(startsAt.getTime() - 1728e5)).toISOString()).lte("starts_at", new Date(startsAt.getTime() + 1728e5).toISOString())
	]);
	if (!computeSlots({
		date: localDate,
		timezone: temple.timezone,
		durationMinutes: service.duration_minutes,
		bufferMinutes: service.buffer_minutes,
		minNoticeHours: service.min_notice_hours,
		priests: priests.data ?? [],
		windows: windows.data ?? [],
		blackouts: blackouts.data ?? [],
		bookings: existing.data ?? []
	}).some((s) => s.startsAt === startsAt.toISOString() && s.priestId === data.priestId)) throw new Error("That time was just taken. Please choose another slot.");
	if (data.locationType === "home" && !data.address?.trim()) throw new Error("A service address is required for home ceremonies.");
	const { data: booking, error } = await context.supabase.from("bookings").insert({
		temple_id: temple.id,
		service_id: service.id,
		priest_id: data.priestId,
		user_id: context.userId,
		starts_at: startsAt.toISOString(),
		ends_at: endsAt.toISOString(),
		location_type: data.locationType,
		address: data.address ?? null,
		contact_name: data.contactName,
		contact_phone: data.contactPhone,
		contact_email: data.contactEmail,
		gotra: data.gotra ?? null,
		nakshatra: data.nakshatra ?? null,
		notes: data.notes ?? null,
		amount_cents: service.price_cents,
		status: "assigned"
	}).select("id, reference, starts_at").single();
	if (error) throw new Error(error.message);
	await context.supabase.from("notifications").insert({
		user_id: context.userId,
		temple_id: temple.id,
		title: `Booking ${booking.reference} confirmed`,
		body: `${service.name} is scheduled. We will send a reminder before your service.`,
		kind: "booking_confirmed",
		link_url: "/dashboard/bookings"
	});
	return {
		reference: booking.reference,
		id: booking.id
	};
});
var getMyDashboard_createServerFn_handler = createServerRpc({
	id: "0b1fda76698d818c183c739e627db859295b336dbf95ea3fe75f3349ecf2d146",
	name: "getMyDashboard",
	filename: "src/lib/booking.functions.ts"
}, (opts) => getMyDashboard.__executeServer(opts));
var getMyDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getMyDashboard_createServerFn_handler, async ({ context }) => {
	const [profile, bookings, registrations, notifications, roles] = await Promise.all([
		context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
		context.supabase.from("bookings").select("*, services(name, slug, duration_minutes), priests(full_name, title)").eq("user_id", context.userId).order("starts_at", { ascending: false }),
		context.supabase.from("event_registrations").select("*, events(title, slug, starts_at, location)").eq("user_id", context.userId),
		context.supabase.from("notifications").select("*").eq("user_id", context.userId).order("created_at", { ascending: false }).limit(30),
		context.supabase.from("user_roles").select("role, temple_id").eq("user_id", context.userId)
	]);
	return {
		profile: profile.data,
		bookings: bookings.data ?? [],
		registrations: registrations.data ?? [],
		notifications: notifications.data ?? [],
		roles: (roles.data ?? []).map((r) => r.role)
	};
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "3d6080b78469ffc041c89ca44cd410f4207ca8b416dcfc63d887ddecba08f3cb",
	name: "updateMyProfile",
	filename: "src/lib/booking.functions.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	full_name: stringType().min(2).max(120),
	phone: stringType().max(40).optional(),
	address: stringType().max(300).optional(),
	city: stringType().max(80).optional(),
	state: stringType().max(80).optional(),
	postal_code: stringType().max(20).optional(),
	preferred_language: stringType().max(20).optional()
}).parse(input)).handler(updateMyProfile_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("profiles").update({
		full_name: data.full_name,
		phone: data.phone ?? null,
		address: data.address ?? null,
		city: data.city ?? null,
		state: data.state ?? null,
		postal_code: data.postal_code ?? null,
		preferred_language: data.preferred_language ?? "en"
	}).eq("id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var cancelMyBooking_createServerFn_handler = createServerRpc({
	id: "6a7ec55dccf58578ec1151345d4cfa48d264c5c49a0e3a18d8c48a3efd623d5d",
	name: "cancelMyBooking",
	filename: "src/lib/booking.functions.ts"
}, (opts) => cancelMyBooking.__executeServer(opts));
var cancelMyBooking = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ id: stringType().uuid() }).parse(input)).handler(cancelMyBooking_createServerFn_handler, async ({ data, context }) => {
	const { data: booking } = await context.supabase.from("bookings").select("id, starts_at, user_id, status").eq("id", data.id).maybeSingle();
	if (!booking || booking.user_id !== context.userId) throw new Error("Booking not found.");
	if (new Date(booking.starts_at).getTime() < Date.now() + 864e5) throw new Error("Bookings can only be cancelled more than 24 hours in advance. Please call the temple office.");
	const { error } = await context.supabase.from("bookings").update({ status: "cancelled" }).eq("id", data.id);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var registerForEvent_createServerFn_handler = createServerRpc({
	id: "f297149a15375fe3d3589bc6760fa1814ab6b3ed0728e6bcc05aabe2fbfdd47f",
	name: "registerForEvent",
	filename: "src/lib/booking.functions.ts"
}, (opts) => registerForEvent.__executeServer(opts));
var registerForEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	eventId: stringType().uuid(),
	attendees: numberType().int().min(1).max(20)
}).parse(input)).handler(registerForEvent_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("event_registrations").upsert({
		event_id: data.eventId,
		user_id: context.userId,
		attendees: data.attendees,
		status: "registered"
	}, { onConflict: "event_id,user_id" });
	if (error) throw new Error(error.message);
	return { ok: true };
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "898f3aed07f078ebce84ad3a4b9af700ee6a1002e7ee68101a9b9f2e337f8a48",
	name: "markNotificationsRead",
	filename: "src/lib/booking.functions.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(markNotificationsRead_createServerFn_handler, async ({ context }) => {
	await context.supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("user_id", context.userId).is("read_at", null);
	return { ok: true };
});
//#endregion
export { cancelMyBooking_createServerFn_handler, createBooking_createServerFn_handler, getMyDashboard_createServerFn_handler, getServiceAvailability_createServerFn_handler, markNotificationsRead_createServerFn_handler, registerForEvent_createServerFn_handler, updateMyProfile_createServerFn_handler };
