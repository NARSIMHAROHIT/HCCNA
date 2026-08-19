import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

/** Client-side session state. Never use this as a route guard — see _authenticated. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Creating the Supabase client throws when VITE_SUPABASE_* is missing from
    // the build, and getSession() can reject if auth storage is unavailable.
    // Either way we must stop loading, otherwise the header renders an empty
    // placeholder forever and the devotee has no way to reach the sign-in page.
    let unsubscribe = () => {};
    try {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!active) return;
          setSession(data.session);
          setLoading(false);
        })
        .catch((error: unknown) => {
          console.error("[auth] Could not read the session", error);
          if (active) setLoading(false);
        });

      const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
        setSession(next);
        setLoading(false);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    } catch (error) {
      console.error("[auth] Supabase auth is unavailable", error);
      setLoading(false);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}
