import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

/**
 * Publishable-key Supabase client for server-side reads of PUBLIC content.
 * Respects RLS as the anonymous role — never use it for private data.
 * Must be constructed inside a server function/route handler (env is per-request).
 */
export function createPublicServerClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/** The temple this deployment serves. Configured per-deployment, never hard-coded content. */
export function activeTempleSlug(): string {
  return process.env["TEMPLE_SLUG"] ?? "hccna";
}
