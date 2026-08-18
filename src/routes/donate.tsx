import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPaymentCheckout } from "@/lib/payments.functions";
import { siteQuery } from "@/lib/queries";

const CAUSES = [
  {
    title: "Daily worship",
    body: "Flowers, fruits, oil lamps and materials for the daily pooja cycle.",
  },
  { title: "Festivals", body: "Utsavams, annadanam and cultural programs through the year." },
  {
    title: "Temple upkeep",
    body: "Sanctum maintenance, utilities and expansion of community space.",
  },
];

const PRESETS = [51, 101, 251, 501, 1001];

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate & Support the Temple — HCCNA" },
      {
        name: "description",
        content:
          "Support daily worship, festivals and temple upkeep with a secure online contribution to our temple.",
      },
      { property: "og:title", content: "Donate & Support the Temple" },
      {
        property: "og:description",
        content: "Support daily worship, festivals and temple upkeep.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Donate,
});

function Donate() {
  const { data } = useSuspenseQuery(siteQuery);
  const t = data.temple;
  const [amount, setAmount] = useState<number | "">(101);
  const [custom, setCustom] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const dollars = custom ? Number(custom) : Number(amount);
    const amountCents = Math.round(dollars * 100);
    if (!Number.isFinite(amountCents) || amountCents < 100) {
      toast.error("Please choose or enter an amount of $1 or more.");
      return;
    }
    setPending(true);
    try {
      const { url } = await createPaymentCheckout({
        data: {
          kind: "donation",
          itemName: String(form.get("purpose") || "General donation"),
          amountCents,
          devoteeName: String(form.get("name") ?? ""),
          devoteeEmail: String(form.get("email") ?? ""),
          devoteePhone: String(form.get("phone") ?? ""),
          notes: String(form.get("notes") ?? ""),
          origin: window.location.origin,
        },
      });
      window.location.href = url;
    } catch (err) {
      setPending(false);
      toast.error(err instanceof Error ? err.message : "Donation could not be started.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Seva"
        title="Support the temple"
        description="Every contribution sustains worship, festivals and cultural education for our community."
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {CAUSES.map((c) => (
            <article key={c.title} className="surface-panel p-5">
              <h2 className="text-lg">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </article>
          ))}
        </div>

        <form onSubmit={onSubmit} className="surface-panel mx-auto mt-10 max-w-2xl space-y-5 p-6">
          <h2 className="text-xl">Make a donation</h2>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p}
                type="button"
                variant={!custom && amount === p ? "default" : "outline"}
                onClick={() => {
                  setAmount(p);
                  setCustom("");
                }}
              >
                ${p}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom">Other amount (USD)</Label>
            <Input
              id="custom"
              inputMode="decimal"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Enter any amount"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" name="purpose" defaultValue="General donation" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Message (optional)</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Redirecting to secure checkout…" : "Donate securely"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Processed by Stripe. You will receive a printable receipt immediately.
          </p>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/services">Sponsor a specific seva</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/donors">See our donors</Link>
          </Button>
          {t.phone ? (
            <Button asChild variant="outline">
              <a href={`tel:${t.phone}`}>Call the office</a>
            </Button>
          ) : null}
        </div>
      </Section>
    </>
  );
}
