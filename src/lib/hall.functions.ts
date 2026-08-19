import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import { quoteHall } from "./hall-pricing";
import { zonedTimeToUtc } from "./timezone";

/**
 * Hall rental.
 *
 * Availability is read through the `hall_busy_ranges` definer function so the
 * public calendar shows which times are taken without exposing who booked them.
 * The database also carries an exclusion constraint, so two devotees racing for
 * the same slot cannot both win.
 */

export const getHalls = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
  const supabase = createPublicServerClient();

  const { data: temple } = await supabase
    .from("temples")
    .select("id, name, currency, timezone, phone, email")
    .eq("slug", activeTempleSlug())
    .maybeSingle();
  if (!temple) throw new Error("Temple not configured");

  const { data: halls } = await supabase
    .from("halls")
    .select("*")
    .eq("temple_id", temple.id)
    .eq("is_active", true)
    .order("display_order");

  return { temple, halls: halls ?? [] };
});

export const getHallBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const supabase = createPublicServerClient();

    const { data: temple } = await supabase
      .from("temples")
      .select("id, name, currency, timezone, phone, email")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: hall } = await supabase
      .from("halls")
      .select("*")
      .eq("temple_id", temple.id)
      .eq("slug", data.slug)
      .maybeSingle();

    return { temple, hall: hall ?? null };
  });

/** Busy ranges for one hall over a window. Public — times only, no names. */
export const getHallAvailability = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        slug: z.string().min(1),
        from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        days: z.number().int().min(1).max(120).default(31),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const supabase = createPublicServerClient();

    const { data: temple } = await supabase
      .from("temples")
      .select("id, timezone")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: hall } = await supabase
      .from("halls")
      .select("id, buffer_minutes")
      .eq("temple_id", temple.id)
      .eq("slug", data.slug)
      .maybeSingle();
    if (!hall) return { busy: [], timezone: temple.timezone };

    const [y, m, d] = data.from.split("-").map(Number);
    const from = zonedTimeToUtc(temple.timezone, y ?? 1970, m ?? 1, d ?? 1, 0, 0);
    const to = new Date(from.getTime() + data.days * 86400000);

    const { data: busy } = await supabase.rpc("hall_busy_ranges", {
      _hall_id: hall.id,
      _from: from.toISOString(),
      _to: to.toISOString(),
    });

    return { busy: busy ?? [], timezone: temple.timezone };
  });

const EVENT_TYPES = [
  "Wedding",
  "Wedding reception",
  "Engagement / Nischitartham",
  "Birthday / Annaprasana",
  "Upanayanam / Thread ceremony",
  "Housewarming / Griha Pravesh",
  "Cultural programme",
  "Religious discourse / Satsang",
  "Community meeting",
  "Other",
] as const;

export const HALL_EVENT_TYPES: readonly string[] = EVENT_TYPES;

const hallBookingInput = z.object({
  slug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  hours: z.number().int().min(1).max(24),
  eventType: z.enum(EVENT_TYPES),
  eventTitle: z.string().trim().max(160).optional(),
  guestCount: z.number().int().min(1).max(5000),
  contactName: z.string().trim().min(2).max(120),
  contactPhone: z.string().trim().min(7).max(40),
  contactEmail: z.string().trim().email(),
  organisation: z.string().trim().max(160).optional(),
  needsKitchen: z.boolean().default(false),
  needsAv: z.boolean().default(false),
  needsTables: z.boolean().default(false),
  setupNotes: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(2000).optional(),
  origin: z.string().url(),
});

export const createHallBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => hallBookingInput.parse(input))
  .handler(async ({ data, context }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const pub = createPublicServerClient();

    const { data: temple } = await pub
      .from("temples")
      .select("id, name, currency, timezone")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: hall } = await pub
      .from("halls")
      .select("*")
      .eq("temple_id", temple.id)
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (!hall) throw new Error("That hall is not available for booking right now.");

    // ---- time window -------------------------------------------------------
    const [y, m, d] = data.date.split("-").map(Number);
    const [hh, mm] = data.startTime.split(":").map(Number);
    const startsAt = zonedTimeToUtc(temple.timezone, y ?? 0, m ?? 0, d ?? 0, hh ?? 0, mm ?? 0);
    if (Number.isNaN(startsAt.getTime())) throw new Error("Please choose a valid date and time.");
    const endsAt = new Date(startsAt.getTime() + data.hours * 3600000);

    if (data.hours < hall.min_hours) {
      throw new Error(`This hall is booked for a minimum of ${hall.min_hours} hours.`);
    }
    if (data.hours > hall.max_hours) {
      throw new Error(`This hall can be booked for at most ${hall.max_hours} hours in one day.`);
    }
    if (data.guestCount > hall.capacity) {
      throw new Error(`This hall seats up to ${hall.capacity} guests.`);
    }

    const noticeMs = hall.min_notice_days * 86400000;
    if (startsAt.getTime() < Date.now() + noticeMs) {
      throw new Error(`Hall bookings need at least ${hall.min_notice_days} days' notice.`);
    }
    if (startsAt.getTime() > Date.now() + hall.max_advance_days * 86400000) {
      throw new Error(
        `Hall bookings can be made up to ${hall.max_advance_days} days in advance. Please contact the temple office for later dates.`,
      );
    }

    // Opening hours, in the temple's own timezone.
    const openMinutes = timeToMinutes(hall.opens_at);
    const closeMinutes = timeToMinutes(hall.closes_at);
    const startMinutes = (hh ?? 0) * 60 + (mm ?? 0);
    const endMinutes = startMinutes + data.hours * 60;
    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      throw new Error(
        `The hall is available between ${hall.opens_at.slice(0, 5)} and ${hall.closes_at.slice(0, 5)}.`,
      );
    }

    // ---- availability (buffered) ------------------------------------------
    const buffer = hall.buffer_minutes * 60000;
    const { data: busy } = await pub.rpc("hall_busy_ranges", {
      _hall_id: hall.id,
      _from: new Date(startsAt.getTime() - buffer - 86400000).toISOString(),
      _to: new Date(endsAt.getTime() + buffer + 86400000).toISOString(),
    });

    const clash = (busy ?? []).some((b) => {
      const bs = new Date(b.starts_at).getTime() - buffer;
      const be = new Date(b.ends_at).getTime() + buffer;
      return bs < endsAt.getTime() && be > startsAt.getTime();
    });
    if (clash) {
      throw new Error("The hall is already reserved for that time. Please choose another slot.");
    }

    // ---- price -------------------------------------------------------------
    const quote = quoteHall(hall, data.hours);

    const { data: booking, error } = await context.supabase
      .from("hall_bookings")
      .insert({
        temple_id: temple.id,
        hall_id: hall.id,
        user_id: context.userId,
        event_type: data.eventType,
        event_title: data.eventTitle ?? null,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        guest_count: data.guestCount,
        rate_basis: quote.basis,
        contact_name: data.contactName,
        contact_phone: data.contactPhone,
        contact_email: data.contactEmail,
        organisation: data.organisation ?? null,
        needs_kitchen: data.needsKitchen,
        needs_av: data.needsAv,
        needs_tables: data.needsTables,
        setup_notes: data.setupNotes ?? null,
        notes: data.notes ?? null,
        rental_cents: quote.rentalCents,
        cleaning_fee_cents: quote.cleaningFeeCents,
        deposit_cents: quote.depositCents,
        total_cents: quote.totalCents,
        status: "requested",
      })
      .select("id, reference, starts_at, ends_at, total_cents, deposit_cents")
      .single();

    if (error) {
      // 23P01 = exclusion_violation, i.e. the database caught a double booking.
      if (error.code === "23P01") {
        throw new Error("The hall was just reserved for that time. Please choose another slot.");
      }
      throw new Error(error.message);
    }

    await context.supabase.from("notifications").insert({
      user_id: context.userId,
      temple_id: temple.id,
      title: `Hall request ${booking.reference} received`,
      body: `${hall.name} — we will confirm your booking once the deposit is received.`,
      kind: "hall_requested",
      link_url: "/dashboard",
    });

    // ---- deposit checkout --------------------------------------------------
    let checkoutUrl: string | null = null;
    if (quote.dueNowCents > 0) {
      try {
        const { startCheckout } = await import("./checkout.server");
        const result = await startCheckout({
          templeId: temple.id,
          templeName: temple.name,
          currency: temple.currency,
          kind: "hall_rental",
          itemName: `${hall.name} — ${booking.reference} (${quote.depositCents > 0 ? "security deposit" : "hall rental"})`,
          amountCents: quote.dueNowCents,
          devoteeName: data.contactName,
          devoteeEmail: data.contactEmail,
          devoteePhone: data.contactPhone,
          notes: `Hall booking ${booking.reference} — ${data.eventType} on ${data.date}`,
          userId: context.userId,
          origin: data.origin,
          cancelPath: "/halls",
        });
        checkoutUrl = result.url;
        await context.supabase
          .from("hall_bookings")
          .update({ payment_id: result.paymentId, payment_status: "pending" })
          .eq("id", booking.id);
      } catch (err) {
        // A payment outage must not lose the booking request — the office can invoice.
        console.error("[Hall] deposit checkout failed", err);
      }
    }

    return {
      reference: booking.reference,
      id: booking.id,
      quote,
      checkoutUrl,
    };
  });

export const getMyHallBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("hall_bookings")
      .select("*, halls(name, slug)")
      .eq("user_id", context.userId)
      .order("starts_at", { ascending: false });
    return data ?? [];
  });

export const cancelMyHallBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: booking } = await context.supabase
      .from("hall_bookings")
      .select("id, user_id, starts_at, status")
      .eq("id", data.id)
      .maybeSingle();
    if (!booking || booking.user_id !== context.userId) throw new Error("Booking not found.");
    if (booking.status === "cancelled") return { ok: true };
    if (new Date(booking.starts_at).getTime() < Date.now() + 7 * 86400000) {
      throw new Error(
        "Hall bookings can only be cancelled online more than 7 days in advance. Please call the temple office.",
      );
    }
    const { error } = await context.supabase
      .from("hall_bookings")
      .update({ status: "cancelled" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}
