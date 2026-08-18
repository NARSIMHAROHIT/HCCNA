import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { getReceipt } from "@/lib/payments.functions";

export const Route = createFileRoute("/receipt")({
  validateSearch: z.object({ session_id: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Payment Receipt — HCCNA" },
      {
        name: "description",
        content: "View and print the receipt for your pooja sponsorship or donation to the temple.",
      },
      { property: "og:title", content: "Payment Receipt" },
      { property: "og:description", content: "View and print your temple offering receipt." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReceiptPage,
});

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function ReceiptPage() {
  const { session_id: sessionId } = Route.useSearch();
  const { data, isLoading } = useQuery({
    queryKey: ["receipt", sessionId],
    queryFn: () => getReceipt({ data: { sessionId: sessionId! } }),
    enabled: Boolean(sessionId),
  });

  return (
    <>
      <PageHeader
        eyebrow="Thank you"
        title="Your offering is received"
        description="A copy of this receipt has been recorded by the temple office."
      />
      <Section>
        <div className="mx-auto max-w-2xl">
          {!sessionId ? (
            <p className="text-muted-foreground">No payment reference was provided.</p>
          ) : isLoading ? (
            <p className="text-muted-foreground">Loading your receipt…</p>
          ) : !data ? (
            <p className="text-muted-foreground">
              We could not find a payment with that reference.
            </p>
          ) : (
            <>
              <article className="surface-panel space-y-5 p-8 print:border-0 print:shadow-none">
                <header className="border-b border-border/70 pb-4">
                  <h2 className="font-display text-2xl">{data.temple?.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {[
                      data.temple?.address_line1,
                      data.temple?.city,
                      data.temple?.state,
                      data.temple?.postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[data.temple?.phone, data.temple?.email].filter(Boolean).join(" · ")}
                  </p>
                </header>

                <dl className="space-y-2 text-sm">
                  <Row label="Receipt number" value={data.payment.receipt_number} />
                  <Row label="Offering" value={data.payment.item_name} />
                  <Row label="Devotee" value={data.payment.devotee_name ?? "—"} />
                  <Row
                    label="Date"
                    value={new Date(
                      data.payment.paid_at ?? data.payment.created_at,
                    ).toLocaleString()}
                  />
                  <Row label="Status" value={data.payment.status === "paid" ? "Paid" : "Pending"} />
                  {data.payment.preferred_date ? (
                    <Row label="Requested date" value={data.payment.preferred_date} />
                  ) : null}
                </dl>

                <div className="flex items-baseline justify-between border-t border-border/70 pt-4">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-display text-3xl text-primary">
                    {money(data.payment.amount_cents, data.payment.currency)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Please retain this receipt for your records. Contributions may be tax deductible
                  to the extent allowed by law.
                </p>
              </article>

              <div className="mt-6 flex justify-center print:hidden">
                <Button onClick={() => window.print()}>Print receipt</Button>
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold text-foreground">{value}</dd>
    </div>
  );
}
