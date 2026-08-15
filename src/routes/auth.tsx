import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  redirect: z.string().optional(),
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Sign In or Create an Account — HCCNA" },
      {
        name: "description",
        content: "Sign in to book poojas, manage your bookings and register for temple events.",
      },
      { property: "og:title", content: "Sign In — HCCNA" },
      { property: "og:description", content: "Sign in to book poojas and manage your temple bookings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function safeRedirect(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const next = safeRedirect(search.redirect);

  useEffect(() => {
    setMode(search.mode ?? "signin");
  }, [search.mode]);

  function changeMode(nextMode: "signin" | "signup") {
    setMode(nextMode);
    navigate({
      to: "/auth",
      search: { redirect: search.redirect, mode: nextMode },
      replace: true,
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "signup" && password !== confirm) {
      toast.error("The two passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}${next}`,
          },
        });
        if (error) {
          if (/already|registered|exists/i.test(error.message)) {
            changeMode("signin");
            setConfirm("");
            toast.error("An account with this email already exists. Please sign in instead.");
            return;
          }
          throw error;
        }
        // Supabase returns a user with no identities when the email is taken.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          changeMode("signin");
          setConfirm("");
          toast.error("An account with this email already exists. Please sign in instead.");
          return;
        }
        toast.success("Account created. You can start booking now.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (/invalid login credentials/i.test(error.message)) {
            toast.error("Wrong email or password. Please try again.");
            return;
          }
          if (/confirm/i.test(error.message)) {
            toast.error("Please confirm your email address first — check your inbox.");
            return;
          }
          throw error;
        }
      }
      navigate({ to: next, replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }


  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(next)}`,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: next, replace: true });
  }

  return (
    <>
      <PageHeader
        eyebrow="Devotee portal"
        title={mode === "signin" ? "Sign in" : "Create your account"}
        description="Book poojas, track your bookings and receive reminders from the temple."
      />
      <Section>
        <div className="mx-auto max-w-md">
          <div className="surface-panel p-6">
            <div className="mb-5 grid grid-cols-2 rounded-lg bg-muted p-1" aria-label="Account access">
              <Button
                type="button"
                variant={mode === "signin" ? "secondary" : "ghost"}
                onClick={() => changeMode("signin")}
                aria-pressed={mode === "signin"}
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant={mode === "signup" ? "secondary" : "ghost"}
                onClick={() => changeMode("signup")}
                aria-pressed={mode === "signup"}
              >
                Sign up
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={onGoogle}>
              Continue with Google
            </Button>
            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>
            <form className="space-y-4" onSubmit={onSubmit}>
              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    minLength={2}
                  />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                {mode === "signup" ? (
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                ) : null}
              </div>
              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={busy}>
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <button
              type="button"
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={() => changeMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}
