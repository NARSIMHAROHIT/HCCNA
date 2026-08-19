import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const TABS = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/temple", label: "Temple details" },
  { to: "/admin/timings", label: "Timings" },
  { to: "/admin/poojas", label: "Poojas & prices" },
  { to: "/admin/events", label: "Events & notices" },
  { to: "/admin/halls", label: "Hall rental" },
  { to: "/admin/community", label: "Board & donors" },
  { to: "/admin/people", label: "People & admins" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/audit", label: "Audit log" },
] as const;

function ClaimAdmin() {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <div className="surface-panel max-w-xl p-6">
      <h2 className="font-display text-xl">Setting up the temple for the first time?</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        If no administrator has been appointed yet, you can claim administrator access for this
        account. Afterwards you can add other administrators from the People tab.
      </p>
      <Button
        className="mt-4"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await claimFirstAdmin();
            await qc.invalidateQueries({ queryKey: ["admin"] });
            toast.success("You are now a temple administrator.");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not claim access");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Checking…" : "Claim administrator access"}
      </Button>
    </div>
  );
}

function AdminLayout() {
  const { data, isLoading, error } = useQuery(adminQuery);

  if (isLoading) {
    return (
      <Section>
        <p className="text-muted-foreground">Loading the admin console…</p>
      </Section>
    );
  }

  if (error || !data?.isAdmin) {
    return (
      <>
        <PageHeader
          eyebrow="Admin"
          title="Administrator access only"
          description="Your account does not have temple administrator permissions. Please contact the temple office."
        />
        <Section>
          <ClaimAdmin />
          <Link to="/" className="mt-6 inline-block text-primary underline">
            Return to the temple home page
          </Link>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin console"
        title={data.temple.name}
        description="Update pages, timings, seva prices, events and review online payments."
      />
      <Section className="pt-8">
        <nav aria-label="Admin sections" className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: "exact" in t }}
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent/60"
              activeProps={{ className: "bg-primary text-primary-foreground border-primary" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <Outlet />
      </Section>
    </>
  );
}
