import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: AdminPayments,
});

function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function AdminPayments() {
  const { data } = useQuery(adminQuery);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    if (!data?.isAdmin) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data.payments;
    return data.payments.filter((p) =>
      [p.receipt_number, p.item_name, p.devotee_name, p.devotee_email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle)),
    );
  }, [data, q]);

  if (!data?.isAdmin) return null;

  function exportCsv() {
    const header = ["Receipt", "Date", "Item", "Kind", "Devotee", "Email", "Amount", "Status"];
    const lines = rows.map((p) =>
      [
        p.receipt_number,
        new Date(p.paid_at ?? p.created_at).toISOString(),
        p.item_name,
        p.kind,
        p.devotee_name ?? "",
        p.devotee_email ?? "",
        (p.amount_cents / 100).toFixed(2),
        p.status,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `temple-payments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="surface-panel p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Payments & receipts</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every online pooja sponsorship and donation, with its receipt number.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search receipt, name, email"
            className="w-56"
          />
          <Button variant="outline" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-4">Receipt</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Offering</th>
              <th className="py-2 pr-4">Devotee</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-border/60">
                <td className="py-2 pr-4 font-mono text-xs">{p.receipt_number}</td>
                <td className="py-2 pr-4">
                  {new Date(p.paid_at ?? p.created_at).toLocaleDateString()}
                </td>
                <td className="py-2 pr-4">{p.item_name}</td>
                <td className="py-2 pr-4">
                  <span className="block">{p.devotee_name}</span>
                  <span className="block text-xs text-muted-foreground">{p.devotee_email}</span>
                </td>
                <td className="py-2 pr-4 capitalize">{p.status}</td>
                <td className="py-2 text-right font-semibold">
                  {money(p.amount_cents, p.currency)}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-muted-foreground">
                  No payments found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
