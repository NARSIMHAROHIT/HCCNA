import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  validateSearch: (search) => z.object({ redirect: z.string().optional() }).parse(search),
  head: () => ({ meta: [{ title: "Signing you in…" }, { name: "robots", content: "noindex" }] }),
  component: Callback,
});

function Callback() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const target =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      navigate({ to: data.session ? target : "/auth", replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate, redirect]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Completing sign-in…</p>
    </div>
  );
}
