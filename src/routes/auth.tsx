import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({ redirect: z.string().optional() });

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
      {
        property: "og:description",
        content: "Sign in to book poojas and manage your temple bookings.",
      },
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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const next = safeRedirect(search.redirect);

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
            setMode("signin");
            setConfirm("");
            toast.error("An account with this email already exists. Please sign in instead.");
            return;
          }
          throw error;
        }
        // Supabase returns a user with no identities when the email is taken.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setMode("signin");
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

  /**
   * Google sign-in.
   *
   * Tries Lovable Cloud auth first, then falls back to Supabase's own Google
   * provider. Either path can be unavailable depending on how the project is
   * configured, and previously a rejected promise here left the button looking
   * dead — every failure is now reported instead of swallowed.
   */
  async function onGoogle() {
    if (googleBusy) return;
    setGoogleBusy(true);
    const callback = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(next)}`;

    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: callback,
      });
      if (!result.error) {
        if (result.redirected) return;
        navigate({ to: next, replace: true });
        return;
      }
      console.warn("[auth] Lovable Google sign-in unavailable", result.error);
    } catch (error) {
      console.warn("[auth] Lovable Google sign-in threw", error);
    }

    // Fallback: Supabase Google provider (enable it under Authentication → Providers).
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback },
      });
      if (error) throw error;
      // Supabase navigates the browser to Google; nothing more to do here.
    } catch (error) {
      console.error("[auth] Google sign-in failed", error);
      toast.error(
        "Google sign-in is not available yet. Please use your email and password, or ask the temple office to enable Google sign-in.",
      );
      setGoogleBusy(false);
    }
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
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onGoogle}
              disabled={googleBusy}
            >
              {googleBusy ? "Opening Google…" : "Continue with Google"}
            </Button>
            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or{" "}
              <span className="h-px flex-1 bg-border" />
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
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin"
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}
