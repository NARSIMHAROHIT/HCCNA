import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  computeMonth,
  computePanchang,
  formatPeriod,
  formatTime,
  todayInTimezone,
} from "./panchang";

/**
 * Public content API. Every read is scoped to the temple configured for this
 * deployment (TEMPLE_SLUG), so the same codebase serves any temple.
 */

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
  const supabase = createPublicServerClient();

  const { data: temple, error } = await supabase
    .from("temples")
    .select("*")
    .eq("slug", activeTempleSlug())
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!temple) throw new Error("No temple is configured for this deployment.");

  const [deities, schedules, announcements, events, services, priests, categories, annual, photos] =
    await Promise.all([
      supabase.from("deities").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase.from("temple_schedules").select("*").eq("temple_id", temple.id),
      supabase
        .from("announcements")
        .select("*")
        .eq("temple_id", temple.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("events")
        .select("*")
        .eq("temple_id", temple.id)
        .gte("starts_at", new Date(Date.now() - 3600000).toISOString())
        .order("starts_at")
        .limit(20),
      supabase.from("services").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase.from("priests").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase
        .from("service_categories")
        .select("*")
        .eq("temple_id", temple.id)
        .order("display_order"),
      supabase
        .from("events")
        .select("*")
        .eq("temple_id", temple.id)
        .eq("is_annual", true)
        .order("starts_at"),
      supabase
        .from("event_photos")
        .select("*")
        .eq("temple_id", temple.id)
        .order("year", { ascending: false })
        .order("display_order")
        .limit(60),
    ]);

  return {
    temple,
    deities: deities.data ?? [],
    schedules: schedules.data ?? [],
    announcements: announcements.data ?? [],
    events: events.data ?? [],
    services: services.data ?? [],
    priests: priests.data ?? [],
    categories: categories.data ?? [],
    annualEvents: annual.data ?? [],
    eventPhotos: photos.data ?? [],
  };
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const supabase = createPublicServerClient();
    const { data: temple } = await supabase
      .from("temples")
      .select("id, name, timezone, currency, phone, email, latitude, longitude")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: service } = await supabase
      .from("services")
      .select("*, service_categories(name, slug)")
      .eq("temple_id", temple.id)
      .eq("slug", data.slug)
      .maybeSingle();
    if (!service) return null;

    const [{ data: links }, { data: deities }] = await Promise.all([
      supabase
        .from("priest_services")
        .select("priest_id, priests(id, full_name, title, photo_url, languages, specializations)")
        .eq("service_id", service.id),
      supabase.from("deities").select("*").eq("temple_id", temple.id).order("display_order"),
    ]);

    const haystack =
      `${service.name} ${service.short_description ?? ""} ${service.description ?? ""}`.toLowerCase();
    const relatedDeities = (deities ?? []).filter(
      (d) => d.image_url && haystack.includes(d.name.toLowerCase()),
    );

    return {
      temple,
      service,
      priests: (links ?? []).map((l) => l.priests).filter(Boolean),
      deities: relatedDeities,
    };
  });

export const getEventBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const supabase = createPublicServerClient();
    const { data: temple } = await supabase
      .from("temples")
      .select("id, name, timezone, currency, city, state")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");
    const { data: event } = await supabase
      .from("events")
      .select("*, priests(full_name, title)")
      .eq("temple_id", temple.id)
      .eq("slug", data.slug)
      .maybeSingle();
    if (!event) return null;

    const [items, photos] = await Promise.all([
      supabase.from("event_items").select("*").eq("event_id", event.id).order("display_order"),
      supabase.from("event_photos").select("*").eq("event_id", event.id).order("display_order"),
    ]);

    return { temple, event, items: items.data ?? [], photos: photos.data ?? [] };
  });

export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
  const supabase = createPublicServerClient();
  const { data: temple } = await supabase
    .from("temples")
    .select("id, name")
    .eq("slug", activeTempleSlug())
    .maybeSingle();
  if (!temple) throw new Error("Temple not configured");
  const { data } = await supabase
    .from("books")
    .select("*")
    .eq("temple_id", temple.id)
    .order("display_order");
  return { temple, books: data ?? [] };
});

export const getPriestDirectory = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
  const supabase = createPublicServerClient();
  const { data: temple } = await supabase
    .from("temples")
    .select("id, name, timezone")
    .eq("slug", activeTempleSlug())
    .maybeSingle();
  if (!temple) throw new Error("Temple not configured");
  const [priests, windows, links, services] = await Promise.all([
    supabase.from("priests").select("*").eq("temple_id", temple.id).order("display_order"),
    supabase.from("priest_availability").select("*"),
    supabase.from("priest_services").select("*"),
    supabase.from("services").select("id, name, slug").eq("temple_id", temple.id),
  ]);
  return {
    temple,
    priests: priests.data ?? [],
    windows: windows.data ?? [],
    links: links.data ?? [],
    services: services.data ?? [],
  };
});

/** Panchang for the temple's configured coordinates. Serialised for display. */
export const getPanchang = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .object({
        year: z.number().int().optional(),
        month: z.number().int().min(1).max(12).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
    const supabase = createPublicServerClient();
    const { data: temple } = await supabase
      .from("temples")
      .select("id, name, city, state, latitude, longitude, timezone")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const tz = temple.timezone;
    const today = todayInTimezone(tz);
    const year = data.year ?? today.y;
    const month = data.month ?? today.m;

    const shape = (p: ReturnType<typeof computePanchang>) => ({
      date: `${p.date.y}-${String(p.date.m).padStart(2, "0")}-${String(p.date.d).padStart(2, "0")}`,
      day: p.date.d,
      weekday: p.weekday,
      weekdayName: p.weekdayName,
      sunrise: formatTime(p.sunrise, tz),
      sunset: formatTime(p.sunset, tz),
      tithiName: p.tithiName,
      paksha: p.paksha,
      nakshatraName: p.nakshatraName,
      yogaName: p.yogaName,
      karanaName: p.karanaName,
      masaName: p.masaName,
      moonPhasePercent: p.moonPhasePercent,
      rahuKalam: formatPeriod(p.rahuKalam, tz),
      yamaganda: formatPeriod(p.yamaganda, tz),
      gulika: formatPeriod(p.gulika, tz),
      observances: p.observances,
    });

    return {
      location: {
        label: [temple.city, temple.state].filter(Boolean).join(", "),
        latitude: temple.latitude,
        longitude: temple.longitude,
        timezone: tz,
      },
      year,
      month,
      today: shape(computePanchang(today, temple.latitude, temple.longitude)),
      days: computeMonth(year, month, temple.latitude, temple.longitude).map(shape),
    };
  });
