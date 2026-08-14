import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { grantAdmin, revokeAdmin } from "@/lib/admin.functions";
import { adminPeopleQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/people")({
  component: AdminPeople,
});

function AdminPeople() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(adminPeopleQuery);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!data?.isAdmin) return null;

  const nameFor = (userId: string) => {
    const p = data.profiles.find((x) => x.id === userId);
    return p?.full_name || p?.email || userId.slice(0, 8);
  };
  const emailFor = (userId: string) => data.profiles.find((x) => x.id === userId)?.email ?? "";
  const eventTitle = (id: string) => data.events.find((e) => e.id === id)?.title ?? "Event";

  const admins = data.roles.filter((r) => r.role === "temple_admin" || r.role === "super_admin");

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await grantAdmin({ data: { email } });
      await qc.invalidateQueries({ queryKey: ["admin"] });
      setEmail("");
      toast.success("Administrator added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add administrator");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6">
        <h2 className="font-display text-xl">Temple administrators</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Anyone you add here can manage the temple website. They must already have an account.
        </p>

        <form onSubmit={addAdmin} className="mt-5 flex flex-wrap items-end gap-3">
          <div className="min-w-[16rem] flex-1 space-y-2">
            <Label htmlFor="admin-email">Account email</Label>
            <Input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="devotee@example.com"
            />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Adding…" : "Make administrator"}
          </Button>
        </form>

        <ul className="mt-6 divide-y divide-border/70">
          {admins.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold">{nameFor(r.user_id)}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {emailFor(r.user_id)} · {r.role.replace("_", " ")}
                </p>
              </div>
              {r.user_id === data.currentUserId ? (
                <span className="text-xs text-muted-foreground">You</span>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if (!window.confirm("Remove admin access for this person?")) return;
                    try {
                      await revokeAdmin({ data: { roleId: r.id } });
                      await qc.invalidateQueries({ queryKey: ["admin"] });
                      toast.success("Access removed");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Could not remove");
                    }
                  }}
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-panel p-6">
        <h2 className="font-display text-xl">Newsletter subscribers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.subscribers.length} devotee(s) subscribed ·{" "}
          {data.subscribers.filter((s) => s.wants_volunteering).length} open to volunteering.
        </p>
        <ul className="mt-5 divide-y divide-border/70">
          {data.subscribers.length === 0 ? (
            <li className="py-4 text-sm text-muted-foreground">No subscribers yet.</li>
          ) : null}
          {data.subscribers.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold">{s.full_name || s.email}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.email}
                  {s.phone ? ` · ${s.phone}` : ""}
                </p>
              </div>
              {s.wants_volunteering ? (
                <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                  Volunteer
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-panel p-6">
        <h2 className="font-display text-xl">Event volunteers</h2>
        <ul className="mt-5 divide-y divide-border/70">
          {data.volunteers.length === 0 ? (
            <li className="py-4 text-sm text-muted-foreground">No volunteer sign-ups yet.</li>
          ) : null}
          {data.volunteers.map((v) => (
            <li key={v.id} className="py-3 text-sm">
              <p className="font-semibold">
                {v.full_name || nameFor(v.user_id)} — {eventTitle(v.event_id)}
              </p>
              <p className="text-xs text-muted-foreground">
                {[v.role_preference, v.availability, v.phone].filter(Boolean).join(" · ") ||
                  "No preferences given"}
              </p>
              {v.notes ? <p className="mt-1 text-xs text-muted-foreground">{v.notes}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
