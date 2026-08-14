import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { subscribeNewsletter } from "@/lib/community.functions";

export function NewsletterSignup() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [volunteer, setVolunteer] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setSignedIn(Boolean(data.user));
      if (data.user?.email) setEmail(data.user.email);
    });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await subscribeNewsletter({
        data: {
          email,
          ...(fullName ? { fullName } : {}),
          ...(phone ? { phone } : {}),
          wantsVolunteering: volunteer,
        },
      });
      setDone(true);
      toast.success("You're subscribed to temple event updates.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not subscribe");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="surface-panel p-6">
        <h3 className="font-display text-xl">Thank you</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You will receive news about upcoming poojas and festivals.
          {volunteer ? " Our team will contact you about volunteering." : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="surface-panel p-6">
      <h3 className="font-display text-xl">Event newsletter</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Subscribe for festival announcements — and tell us if you would like to volunteer.
      </p>

      {signedIn === false ? (
        <p className="mt-4 text-sm">
          Please{" "}
          <Link to="/auth" search={{ redirect: "/" }} className="text-primary underline">
            sign in or create an account
          </Link>{" "}
          to subscribe.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="nl-name">Your name</Label>
            <Input id="nl-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nl-email">Email</Label>
            <Input
              id="nl-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nl-phone">Phone (optional)</Label>
            <Input id="nl-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <Checkbox
              checked={volunteer}
              onCheckedChange={(v) => setVolunteer(Boolean(v))}
              id="nl-volunteer"
            />
            I would like to volunteer at temple events
          </label>
          <Button type="submit" disabled={busy || signedIn === null} className="w-full">
            {busy ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}
