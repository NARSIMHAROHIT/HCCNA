import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Public reads for the donor wall and the temple board. */

export const getCommunity = createServerFn({ method: "GET" }).handler(async () => {
  const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server");
  const supabase = createPublicServerClient();

  const { data: temple } = await supabase
    .from("temples")
    .select("id, name, currency")
    .eq("slug", activeTempleSlug())
    .maybeSingle();
  if (!temple) throw new Error("Temple not configured");

  const [board, donors] = await Promise.all([
    supabase
      .from("board_members")
      .select("*")
      .eq("temple_id", temple.id)
      .eq("is_active", true)
      .order("display_order"),
    supabase
      .from("donors")
      .select("*")
      .eq("temple_id", temple.id)
      .eq("is_published", true)
      .order("display_order"),
  ]);

  return { temple, board: board.data ?? [], donors: donors.data ?? [] };
});

/** Devotee subscribes to the events newsletter (and optionally volunteering). */
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        fullName: z.string().trim().max(120).optional(),
        phone: z.string().trim().max(40).optional(),
        wantsVolunteering: z.boolean().default(false),
      })
      .parse(input),
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

    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("temple_id", temple.id)
      .eq("email", data.email)
      .maybeSingle();

    const values = {
      temple_id: temple.id,
      user_id: context.userId,
      email: data.email,
      full_name: data.fullName ?? null,
      phone: data.phone ?? null,
      wants_volunteering: data.wantsVolunteering,
      is_active: true,
    };

    const { error } = existing
      ? await supabase.from("newsletter_subscribers").update(values).eq("id", existing.id)
      : await supabase.from("newsletter_subscribers").insert(values);
    if (error) throw new Error(error.message);
    return { ok: true, updated: Boolean(existing) };
  });

/** Devotee signs up to volunteer for a specific event. */
export const volunteerForEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        eventId: z.string().uuid(),
        fullName: z.string().trim().max(120).optional(),
        phone: z.string().trim().max(40).optional(),
        rolePreference: z.string().trim().max(120).optional(),
        availability: z.string().trim().max(200).optional(),
        notes: z.string().trim().max(600).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const values = {
      event_id: data.eventId,
      user_id: context.userId,
      full_name: data.fullName ?? null,
      phone: data.phone ?? null,
      role_preference: data.rolePreference ?? null,
      availability: data.availability ?? null,
      notes: data.notes ?? null,
    };

    const { data: existing } = await supabase
      .from("event_volunteers")
      .select("id")
      .eq("event_id", data.eventId)
      .eq("user_id", context.userId)
      .maybeSingle();

    const { error } = existing
      ? await supabase.from("event_volunteers").update(values).eq("id", existing.id)
      : await supabase.from("event_volunteers").insert(values);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
