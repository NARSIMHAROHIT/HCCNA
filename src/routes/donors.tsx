import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";

import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { getCommunity } from "@/lib/community.functions";

export const communityQuery = queryOptions({
  queryKey: ["community"],
  queryFn: () => getCommunity(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/donors")({
  loader: ({ context }) => context.queryClient.ensureQueryData(communityQuery),
  head: () => ({
    meta: [
      { title: "Our Donors & Sponsors — HCCNA" },
      {
        name: "description",
        content:
          "With gratitude we recognise the devotees and families whose sponsorships sustain daily worship, festivals and temple construction.",
      },
      { property: "og:title", content: "Our Donors & Sponsors" },
      { property: "og:description", content: "Devotees and families sustaining the temple." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonorsPage,
});

function money(cents: number | null, currency: string) {
  if (!cents) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function DonorsPage() {
  const { data } = useSuspenseQuery(communityQuery);
  const tiers = Array.from(new Set(data.donors.map((d) => d.tier ?? "Supporters")));

  return (
    <>
      <PageHeader
        eyebrow="Gratitude"
        title="Our donors & sponsors"
        description="Every lamp lit and every festival celebrated is made possible by these devotees and families."
      />
      <Section>
        {data.donors.length === 0 ? (
          <EmptyState
            title="Donor wall coming soon"
            description="The temple office is preparing the list of contributors."
          />
        ) : (
          <div className="space-y-12">
            {tiers.map((tier) => {
              const rows = data.donors.filter((d) => (d.tier ?? "Supporters") === tier);
              return (
                <div key={tier}>
                  <h2 className="text-2xl">{tier}</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rows.map((d) => (
                      <article key={d.id} className="surface-panel p-5">
                        <p className="font-display text-lg">
                          {d.is_anonymous ? "Anonymous devotee" : d.donor_name}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[d.category, d.year ? String(d.year) : null].filter(Boolean).join(" · ")}
                        </p>
                        {money(d.amount_cents, data.temple.currency) ? (
                          <p className="mt-2 text-sm font-semibold text-primary">
                            {money(d.amount_cents, data.temple.currency)}
                          </p>
                        ) : null}
                        {d.message ? (
                          <p className="mt-3 text-sm italic text-muted-foreground">“{d.message}”</p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link to="/donate">Join our donors</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
