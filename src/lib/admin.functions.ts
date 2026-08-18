import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/**
 * Temple admin console API. Every call runs as the signed-in user, so RLS
 * (manages_temple / has_role) is the real authorisation boundary.
 */

const EDITABLE_TABLES = [
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
  "event_photos",
] as const;

/** Tables that are scoped through a parent row rather than a temple_id column. */
const NO_TEMPLE_ID: string[] = ["event_items"];

const tableSchema = z.enum(EDITABLE_TABLES);
const valuesSchema = z.record(z.string(), z.unknown());

export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { activeTempleSlug } = await import("./supabase-public.server");
    const supabase = context.supabase;

    const { data: temple, error } = await supabase
      .from("temples")
      .select("*")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!temple) throw new Error("Temple not configured");

    const { data: canManage } = await supabase.rpc("manages_temple", {
      _user_id: context.userId,
      _temple_id: temple.id,
    });

    if (!canManage) return { isAdmin: false as const };

    const [
      schedules,
      categories,
      services,
      events,
      announcements,
      board,
      donors,
      priests,
      deities,
      payments,
      bookings,
      eventItems,
      eventPhotos,
    ] = await Promise.all([
      supabase.from("temple_schedules").select("*").eq("temple_id", temple.id).order("day_of_week"),
      supabase
        .from("service_categories")
        .select("*")
        .eq("temple_id", temple.id)
        .order("display_order"),
      supabase.from("services").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase.from("events").select("*").eq("temple_id", temple.id).order("starts_at"),
      supabase
        .from("announcements")
        .select("*")
        .eq("temple_id", temple.id)
        .order("created_at", { ascending: false }),
      supabase.from("board_members").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase.from("donors").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase.from("priests").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase.from("deities").select("*").eq("temple_id", temple.id).order("display_order"),
      supabase
        .from("payments")
        .select("*")
        .eq("temple_id", temple.id)
        .order("created_at", { ascending: false })
        .limit(300),
      supabase
        .from("bookings")
        .select("id, reference, starts_at, status, payment_status, amount_cents, contact_name")
        .eq("temple_id", temple.id)
        .order("starts_at", { ascending: false })
        .limit(100),
      supabase.from("event_items").select("*").order("display_order"),
      supabase.from("event_photos").select("*").eq("temple_id", temple.id).order("display_order"),
    ]);

    return {
      isAdmin: true as const,
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
      eventPhotos: eventPhotos.data ?? [],
    };
  });

export const saveRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        table: tableSchema,
        id: z.string().uuid().optional(),
        values: valuesSchema,
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const values = data.values as Record<string, never>;

    if (data.id) {
      const { error } = await supabase.from(data.table).update(values).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true };
    }

    const { activeTempleSlug } = await import("./supabase-public.server");
    const { data: temple } = await supabase
      .from("temples")
      .select("id")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const payload = NO_TEMPLE_ID.includes(data.table)
      ? values
      : { ...values, temple_id: temple.id };

    const { error } = await supabase.from(data.table).insert(payload as never);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ table: tableSchema, id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Audit trail of who changed events, priests, donors and deities. */
export const getAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { activeTempleSlug } = await import("./supabase-public.server");
    const supabase = context.supabase;

    const { data: temple } = await supabase
      .from("temples")
      .select("id")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: canManage } = await supabase.rpc("manages_temple", {
      _user_id: context.userId,
      _temple_id: temple.id,
    });
    if (!canManage) return { isAdmin: false as const };

    const { data: entries, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("temple_id", temple.id)
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);

    const actorIds = Array.from(
      new Set((entries ?? []).map((e) => e.actor_id).filter((v): v is string => Boolean(v))),
    );
    const { data: actors } = actorIds.length
      ? await supabase.from("profiles").select("id, full_name, email").in("id", actorIds)
      : { data: [] };

    return { isAdmin: true as const, entries: entries ?? [], actors: actors ?? [] };
  });

/** Newsletter subscribers, volunteers and temple administrators. */
export const getAdminPeople = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { activeTempleSlug } = await import("./supabase-public.server");
    const supabase = context.supabase;

    const { data: temple } = await supabase
      .from("temples")
      .select("id")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: canManage } = await supabase.rpc("manages_temple", {
      _user_id: context.userId,
      _temple_id: temple.id,
    });
    if (!canManage) return { isAdmin: false as const };

    const [subscribers, volunteers, roles, events] = await Promise.all([
      supabase
        .from("newsletter_subscribers")
        .select("*")
        .eq("temple_id", temple.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("event_volunteers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300),
      supabase.from("user_roles").select("*").eq("temple_id", temple.id),
      supabase.from("events").select("id, title").eq("temple_id", temple.id),
    ]);

    const userIds = Array.from(
      new Set([
        ...(roles.data ?? []).map((r) => r.user_id),
        ...(volunteers.data ?? []).map((v) => v.user_id),
      ]),
    );
    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds)
      : { data: [] };

    return {
      isAdmin: true as const,
      templeId: temple.id,
      subscribers: subscribers.data ?? [],
      volunteers: volunteers.data ?? [],
      roles: roles.data ?? [],
      events: events.data ?? [],
      profiles: profiles ?? [],
      currentUserId: context.userId,
    };
  });

/** Grant temple administrator access to an existing account, by email. */
export const grantAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { activeTempleSlug } = await import("./supabase-public.server");
    const supabase = context.supabase;

    const { data: temple } = await supabase
      .from("temples")
      .select("id")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: canManage } = await supabase.rpc("manages_temple", {
      _user_id: context.userId,
      _temple_id: temple.id,
    });
    if (!canManage) throw new Error("Forbidden");

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .ilike("email", data.email)
      .maybeSingle();
    if (!profile) {
      throw new Error("No account found with that email. Ask them to sign up first.");
    }

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: profile.id, role: "temple_admin", temple_id: temple.id });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });

/** Remove temple administrator access from another account. */
export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ roleId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("user_roles").delete().eq("id", data.roleId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Bootstrap: the first signed-in devotee can claim administrator access while
 * the temple has no administrator at all. Once one exists this always fails.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { activeTempleSlug } = await import("./supabase-public.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: temple } = await supabaseAdmin
      .from("temples")
      .select("id")
      .eq("slug", activeTempleSlug())
      .maybeSingle();
    if (!temple) throw new Error("Temple not configured");

    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("temple_id", temple.id)
      .in("role", ["temple_admin", "super_admin"])
      .limit(1);

    if (existing && existing.length > 0) {
      throw new Error("This temple already has an administrator. Ask them to add you.");
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "temple_admin", temple_id: temple.id });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
