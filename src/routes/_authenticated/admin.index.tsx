import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function AdminOverview() {
  const { data } = useQuery(adminQuery);
  if (!data?.isAdmin) return null;

  const paid = data.payments.filter((p) => p.status === "paid");
  const thisMonth = paid.filter(
    (p) => new Date(p.paid_at ?? p.created_at).getMonth() === new Date().getMonth(),
  );
  const total = paid.reduce((sum, p) => sum + p.amount_cents, 0);
  const monthTotal = thisMonth.reduce((sum, p) => sum + p.amount_cents, 0);

  const stats = [
    { label: "Received (all time)", value: money(total) },
    { label: "Received this month", value: money(monthTotal) },
    { label: "Paid transactions", value: String(paid.length) },
    { label: "Active poojas listed", value: String(data.services.filter((s) => s.is_active).length) },
    { label: "Upcoming events", value: String(data.events.length) },
    { label: "Board members", value: String(data.board.length) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="surface-panel p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="surface-panel p-6">
        <h2 className="font-display text-xl">Latest offerings</h2>
        <ul className="mt-4 divide-y divide-border/70">
          {data.payments.slice(0, 8).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold">{p.item_name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.devotee_name} · {p.receipt_number} · {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={p.status === "paid" ? "text-primary" : "text-muted-foreground"}>
                {money(p.amount_cents)}
              </span>
            </li>
          ))}
          {data.payments.length === 0 ? (
            <li className="py-3 text-sm text-muted-foreground">No online payments yet.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
