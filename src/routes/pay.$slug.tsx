import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPaymentCheckout } from "@/lib/payments.functions";
import { siteQuery } from "@/lib/queries";

export const Route = createFileRoute("/pay/$slug")({
  head: () => ({
    meta: [
      { title: "Sponsor a Pooja — Pay Online | HCCNA" },
      {
        name: "description",
        content:
          "Sponsor an archana, abhishekam, homam or yearly seva at the temple and pay securely online with a card.",
      },
      { property: "og:title", content: "Sponsor a Pooja — Pay Online" },
      { property: "og:description", content: "Sponsor a seva and pay securely online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PayPage,
});

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function PayPage() {
  const { slug } = useParams({ from: "/pay/$slug" });
  const { data } = useSuspenseQuery(siteQuery);
  const service = data.services.find((s) => s.slug === slug);
  const [pending, setPending] = useState(false);
  const [custom, setCustom] = useState("");

  if (!service) {
    return (
      <Section>
        <p className="text-muted-foreground">This seva is no longer offered.</p>
      </Section>
    );
  }

  const openAmount = service.price_cents === 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const amountCents = openAmount ? Math.round(Number(custom || 0) * 100) : service!.price_cents;
    if (!Number.isFinite(amountCents) || amountCents < 100) {
      toast.error("Please enter an amount of $1 or more.");
      return;
    }
    setPending(true);
    try {
      const { url } = await createPaymentCheckout({
        data: {
          kind: "pooja",
          serviceSlug: slug,
          itemName: service!.name,
          amountCents,
          devoteeName: String(form.get("name") ?? ""),
          devoteeEmail: String(form.get("email") ?? ""),
          devoteePhone: String(form.get("phone") ?? ""),
          gotra: String(form.get("gotra") ?? ""),
          nakshatra: String(form.get("nakshatra") ?? ""),
          preferredDate: String(form.get("date") ?? ""),
          notes: String(form.get("notes") ?? ""),
          origin: window.location.origin,
        },
      });
      window.location.href = url;
    } catch (err) {
      setPending(false);
      toast.error(err instanceof Error ? err.message : "Payment could not be started.");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Seva offering"
        title={service.name}
        description={
          service.short_description ?? "Complete the sankalpam details and pay securely."
        }
      />
      <Section>
        <form onSubmit={onSubmit} className="surface-panel mx-auto max-w-2xl space-y-5 p-6">
          <div className="flex items-baseline justify-between border-b border-border/70 pb-4">
            <span className="text-sm text-muted-foreground">Offering amount</span>
            <span className="font-display text-2xl text-primary">
              {openAmount ? "Your choice" : money(service.price_cents, data.temple.currency)}
            </span>
          </div>

          {openAmount ? (
            <div className="space-y-2">
              <Label htmlFor="custom">Amount (USD)</Label>
              <Input
                id="custom"
                inputMode="decimal"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="51"
                required
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Devotee name</Label>
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
              <Label htmlFor="date">Preferred date</Label>
              <Input id="date" name="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gotra">Gotra</Label>
              <Input id="gotra" name="gotra" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nakshatra">Nakshatra / Rashi</Label>
              <Input id="nakshatra" name="nakshatra" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Names for sankalpam / notes</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Redirecting to secure checkout…" : "Continue to payment"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Payments are processed securely by Stripe. A receipt is issued instantly.
          </p>
        </form>
      </Section>
    </>
  );
}
