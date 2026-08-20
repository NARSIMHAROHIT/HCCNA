import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

/**
 * Change the signed-in devotee's password.
 *
 * Supabase updates the password for the current session, so no current-password
 * field is required — but we ask for it anyway and re-authenticate with it,
 * because otherwise anyone at an unattended, signed-in browser could take over
 * the account.
 */
export function ChangePassword({ email }: { email: string | undefined }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (next !== confirm) {
      toast.error("The two new passwords do not match.");
      return;
    }
    if (next.length < 8) {
      toast.error("Your new password must be at least 8 characters.");
      return;
    }
    if (next === current) {
      toast.error("Your new password must be different from your current one.");
      return;
    }
    if (!email) {
      toast.error("We could not read your account email. Please sign out and back in.");
      return;
    }

    setBusy(true);
    try {
      // Prove the person at the keyboard knows the existing password.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (signInError) {
        toast.error("Your current password is not correct.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) throw error;

      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Your password has been changed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="surface-panel space-y-4 p-6" onSubmit={onSubmit}>
      <div>
        <h2 className="font-display text-xl">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {email ? `Signed in as ${email}.` : "Choose a new password for your account."}
        </p>
      </div>

      {/* Helps password managers associate the new password with the right account. */}
      <input type="hidden" name="username" autoComplete="username" value={email ?? ""} readOnly />

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">At least 8 characters.</p>

      <Button type="submit" disabled={busy}>
        {busy ? "Updating…" : "Change password"}
      </Button>
    </form>
  );
}
