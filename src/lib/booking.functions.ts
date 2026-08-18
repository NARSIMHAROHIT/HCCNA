import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import { computeSlots } from "./slots";

/** Availability lookup — public, so the slot picker works before sign-in. */
export const getServiceAvailability = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        serviceSlug: z.string().min(1),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const supabase = createPublicServerClient();

    const { data: temple } = await supabase
      .from("temples")
      .select("id, timezone, currency")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: service } = await supabase
      .from("services")
      .select("*")
      .eq("temple_id", temple.id)
      .eq("slug", data.serviceSlug)
      .maybeSingle();
    if (!service) return { slots: [], service: null, timezone: temple.timezone };

    const { data: links } = await supabase
      .from("priest_services")
      .select("priest_id")
      .eq("service_id", service.id);
    const priestIds = (links ?? []).map((l) => l.priest_id);
    if (priestIds.length === 0) {
      return { slots: [], service, timezone: temple.timezone };
    }

    const dayStart = new Date(`${data.date}T00:00:00Z`);
    const [priests, windows, blackouts, bookings] = await Promise.all([
      supabase
        .from("priests")
        .select("id, full_name, max_bookings_per_day")
        .in("id", priestIds)
        .eq("is_active", true),
      supabase.from("priest_availability").select("*").in("priest_id", priestIds),
      supabase.from("priest_blackouts").select("*").in("priest_id", priestIds),
      supabase
        .from("bookings")
        .select("priest_id, starts_at, ends_at")
        .in("priest_id", priestIds)
        .gte("starts_at", new Date(dayStart.getTime() - 86400000).toISOString())
        .lte("starts_at", new Date(dayStart.getTime() + 2 * 86400000).toISOString()),
    ]);

    const slots = computeSlots({
      date: data.date,
      timezone: temple.timezone,
      durationMinutes: service.duration_minutes,
      bufferMinutes: service.buffer_minutes,
      minNoticeHours: service.min_notice_hours,
      priests: priests.data ?? [],
      windows: windows.data ?? [],
      blackouts: blackouts.data ?? [],
      bookings: bookings.data ?? [],
    });

    return { slots, service, timezone: temple.timezone };
  });

const bookingInput = z.object({
  serviceSlug: z.string().min(1),
  startsAt: z.string().min(10),
  priestId: z.string().uuid(),
  locationType: z.enum(["temple", "home"]),
  address: z.string().max(400).optional(),
  contactName: z.string().min(2).max(120),
  contactPhone: z.string().min(7).max(40),
  contactEmail: z.string().email(),
  gotra: z.string().max(120).optional(),
  nakshatra: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => bookingInput.parse(input))
  .handler(async ({ data, context }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const pub = createPublicServerClient();

    const { data: temple } = await pub
      .from("temples")
      .select("id, timezone, name")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: service } = await pub
      .from("services")
      .select("*")
      .eq("temple_id", temple.id)
      .eq("slug", data.serviceSlug)
      .maybeSingle();
    if (!service) throw new Error("That service is no longer available.");

    const startsAt = new Date(data.startsAt);
    if (Number.isNaN(startsAt.getTime())) throw new Error("Invalid time selected.");
    if (startsAt.getTime() < Date.now() + service.min_notice_hours * 3600000) {
      throw new Error("That time no longer meets the minimum notice for this service.");
    }
    const endsAt = new Date(startsAt.getTime() + service.duration_minutes * 60000);

    // Re-validate the slot server-side so two devotees cannot take the same time.
    const localDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: temple.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startsAt);

    const [priests, windows, blackouts, existing] = await Promise.all([
      pub
        .from("priests")
        .select("id, full_name, max_bookings_per_day")
        .eq("id", data.priestId)
        .eq("is_active", true),
      pub.from("priest_availability").select("*").eq("priest_id", data.priestId),
      pub.from("priest_blackouts").select("*").eq("priest_id", data.priestId),
      pub
        .from("bookings")
        .select("priest_id, starts_at, ends_at")
        .eq("priest_id", data.priestId)
        .neq("status", "cancelled")
        .gte("starts_at", new Date(startsAt.getTime() - 2 * 86400000).toISOString())
        .lte("starts_at", new Date(startsAt.getTime() + 2 * 86400000).toISOString()),
    ]);

    const stillFree = computeSlots({
      date: localDate,
      timezone: temple.timezone,
      durationMinutes: service.duration_minutes,
      bufferMinutes: service.buffer_minutes,
      minNoticeHours: service.min_notice_hours,
      priests: priests.data ?? [],
      windows: windows.data ?? [],
      blackouts: blackouts.data ?? [],
      bookings: existing.data ?? [],
    }).some((s) => s.startsAt === startsAt.toISOString() && s.priestId === data.priestId);

    if (!stillFree) {
      throw new Error("That time was just taken. Please choose another slot.");
    }

    if (data.locationType === "home" && !data.address?.trim()) {
      throw new Error("A service address is required for home ceremonies.");
    }

    const { data: booking, error } = await context.supabase
      .from("bookings")
      .insert({
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
        status: "assigned",
      })
      .select("id, reference, starts_at")
      .single();
    if (error) throw new Error(error.message);

    await context.supabase.from("notifications").insert({
      user_id: context.userId,
      temple_id: temple.id,
      title: `Booking ${booking.reference} confirmed`,
      body: `${service.name} is scheduled. We will send a reminder before your service.`,
      kind: "booking_confirmed",
      link_url: "/dashboard/bookings",
    });

    return { reference: booking.reference, id: booking.id };
  });

export const getMyDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [profile, bookings, registrations, notifications, roles] = await Promise.all([
      context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      context.supabase
        .from("bookings")
        .select("*, services(name, slug, duration_minutes), priests(full_name, title)")
        .eq("user_id", context.userId)
        .order("starts_at", { ascending: false }),
      context.supabase
        .from("event_registrations")
        .select("*, events(title, slug, starts_at, location)")
        .eq("user_id", context.userId),
      context.supabase
        .from("notifications")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(30),
      context.supabase.from("user_roles").select("role, temple_id").eq("user_id", context.userId),
    ]);

    return {
      profile: profile.data,
      bookings: bookings.data ?? [],
      registrations: registrations.data ?? [],
      notifications: notifications.data ?? [],
      roles: (roles.data ?? []).map((r) => r.role),
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        full_name: z.string().min(2).max(120),
        phone: z.string().max(40).optional(),
        address: z.string().max(300).optional(),
        city: z.string().max(80).optional(),
        state: z.string().max(80).optional(),
        postal_code: z.string().max(20).optional(),
        preferred_language: z.string().max(20).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        postal_code: data.postal_code ?? null,
        preferred_language: data.preferred_language ?? "en",
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const cancelMyBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: booking } = await context.supabase
      .from("bookings")
      .select("id, starts_at, user_id, status")
      .eq("id", data.id)
      .maybeSingle();
    if (!booking || booking.user_id !== context.userId) throw new Error("Booking not found.");
    if (new Date(booking.starts_at).getTime() < Date.now() + 24 * 3600000) {
      throw new Error(
        "Bookings can only be cancelled more than 24 hours in advance. Please call the temple office.",
      );
    }
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const registerForEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ eventId: z.string().uuid(), attendees: z.number().int().min(1).max(20) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("event_registrations").upsert(
      {
        event_id: data.eventId,
        user_id: context.userId,
        attendees: data.attendees,
        status: "registered",
      },
      { onConflict: "event_id,user_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", context.userId)
      .is("read_at", null);
    return { ok: true };
  });
