import { Link, createFileRoute } from "@tanstack/react-router";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError, readAuthParams } from "@/lib/auth-params";

/**
 * Where the "confirm your email" link lands.
 *
 * Previously that link pointed at /dashboard, which sits behind the auth guard —
 * so a devotee clicking it before the session had been established was bounced
 * straight into an error. This page is public, greets them properly, and offers
 * a new link when the old one has expired.
 */
export const Route = createFileRoute("/welcome")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Welcome — HCCNA" }, { name: "robots", content: "noindex" }],
  }),
  component: WelcomePage,
});

type State = "checking" | "confirmed" | "no-session" | "failed";

function WelcomePage() {
  const [state, setState] = useState<State>("checking");
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let active = true;

    const params = readAuthParams();
    const failure = friendlyAuthError(params);
    if (failure) {
      setMessage(failure);
      setState("failed");
      return;
    }

    // supabase-js consumes the tokens in the URL on load; give it a moment,
    // then ask whether we ended up signed in.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        if (data.session) {
          const meta = data.session.user.user_metadata as { full_name?: string } | null;
          setName(meta?.full_name ?? null);
          setState("confirmed");
        } else {
          setState("no-session");
        }
      })
      .catch(() => {
        if (active) setState("no-session");
      });

    return () => {
      active = false;
    };
  }, []);

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/welcome` },
      });
      if (error) throw error;
      toast.success("A new confirmation email is on its way.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "We could not send a new confirmation email.",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Devotee portal"
        title={state === "failed" ? "That link did not work" : "Thank you — welcome to HCCNA"}
        description={
          state === "failed"
            ? "Confirmation links expire after a while, and each one can only be used once."
            : "Your email address is confirmed. We are glad to have you with us."
        }
      />

      <Section>
        <div className="mx-auto max-w-xl">
          {state === "checking" ? (
            <p className="text-center text-muted-foreground">Confirming your email…</p>
          ) : state === "failed" ? (
            <div className="surface-panel space-y-5 p-8">
              <CircleAlert className="size-10 text-destructive" aria-hidden />
              <p className="text-muted-foreground">{message}</p>

              <form className="space-y-3" onSubmit={resend}>
                <Label htmlFor="resendEmail">Your email address</Label>
                <Input
                  id="resendEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Button type="submit" disabled={resending} className="w-full">
                  {resending ? "Sending…" : "Send me a new confirmation link"}
                </Button>
              </form>

              <Button asChild variant="outline" className="w-full">
                <Link to="/auth">Back to sign in</Link>
              </Button>
            </div>
          ) : (
            <div className="surface-panel space-y-5 p-8 text-center">
              <CircleCheck className="mx-auto size-12 text-primary" aria-hidden />
              <div>
                <p className="font-display text-2xl">
                  {name ? `Namaste, ${name}` : "Your account is ready"}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {state === "confirmed"
                    ? "You can now book poojas, reserve the hall and register for temple events."
                    : "Your email is confirmed. Please sign in to start booking."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {state === "confirmed" ? (
                  <>
                    <Button asChild size="lg" className="flex-1">
                      <Link to="/services">Book a pooja</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="flex-1">
                      <Link to="/dashboard">My account</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild size="lg" className="flex-1">
                    <Link to="/auth">Sign in</Link>
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                You can also browse{" "}
                <Link to="/events" className="text-primary underline">
                  upcoming events
                </Link>{" "}
                or{" "}
                <Link to="/timings" className="text-primary underline">
                  temple timings
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
