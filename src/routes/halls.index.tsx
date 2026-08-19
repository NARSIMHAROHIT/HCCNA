import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Users } from "lucide-react";

import { EmptyState, PageHeader, Section, SectionHeading } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/hall-pricing";
import { hallsQuery } from "@/lib/queries";

export const Route = createFileRoute("/halls/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(hallsQuery),
  head: () => ({
    meta: [
      { title: "Hall Rental — Book the Temple Hall | HCCNA" },
      {
        name: "description",
        content:
          "Reserve the temple community hall for weddings, receptions, birthdays, cultural programmes and community gatherings. Check availability and book online.",
      },
      { property: "og:title", content: "Hall Rental at HCCNA" },
      {
        property: "og:description",
        content: "Book the temple community hall for your wedding, reception or cultural event.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HallsPage,
});

function HallsPage() {
  const { data } = useSuspenseQuery(hallsQuery);
  const currency = data.temple.currency;

  return (
    <>
      <PageHeader
        eyebrow="Hall rental"
        title="Book our hall for your celebration"
        description="Weddings, receptions, birthdays, thread ceremonies, cultural programmes and community meetings — check the calendar and reserve your date online."
      />

      <Section>
        {data.halls.length === 0 ? (
          <EmptyState
            title="Hall booking is being set up"
            description="Please contact the temple office for hall availability and rates."
          />
        ) : (
          <div className="space-y-10">
            {data.halls.map((hall) => (
              <article key={hall.id} className="surface-panel overflow-hidden">
                <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="p-6 md:p-8">
                    <h2 className="font-display text-2xl md:text-3xl">{hall.name}</h2>
                    {hall.short_description ? (
                      <p className="mt-3 text-muted-foreground">{hall.short_description}</p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Users className="size-4 text-primary" aria-hidden />
                        Up to {hall.capacity} guests
                      </span>
                      {hall.area_sqft ? (
                        <span className="inline-flex items-center gap-2">
                          {hall.area_sqft.toLocaleString()} sq ft
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-2">
                        <Clock className="size-4 text-primary" aria-hidden />
                        {hall.opens_at.slice(0, 5)} – {hall.closes_at.slice(0, 5)}
                      </span>
                    </div>

                    {hall.description ? (
                      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                        {hall.description}
                      </p>
                    ) : null}

                    {hall.amenities.length ? (
                      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                        {hall.amenities.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {hall.rules ? (
                      <details className="mt-6 rounded-md border border-border/70 p-4">
                        <summary className="cursor-pointer text-sm font-semibold">
                          Rental terms &amp; house rules
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {hall.rules}
                        </p>
                      </details>
                    ) : null}
                  </div>

                  <aside className="border-t border-border/70 bg-muted/40 p-6 md:border-l md:border-t-0 md:p-8">
                    <p className="eyebrow">Rates</p>
                    <dl className="mt-4 space-y-1">
                      {hall.hourly_rate_cents > 0 ? (
                        <Rate
                          label="Per hour"
                          value={formatMoney(hall.hourly_rate_cents, currency)}
                        />
                      ) : null}
                      {hall.half_day_rate_cents > 0 ? (
                        <Rate
                          label="Half day (up to 5 hrs)"
                          value={formatMoney(hall.half_day_rate_cents, currency)}
                        />
                      ) : null}
                      {hall.full_day_rate_cents > 0 ? (
                        <Rate
                          label="Full day (up to 12 hrs)"
                          value={formatMoney(hall.full_day_rate_cents, currency)}
                        />
                      ) : null}
                      {hall.cleaning_fee_cents > 0 ? (
                        <Rate
                          label="Cleaning fee"
                          value={formatMoney(hall.cleaning_fee_cents, currency)}
                        />
                      ) : null}
                      {hall.deposit_cents > 0 ? (
                        <Rate
                          label="Refundable deposit"
                          value={formatMoney(hall.deposit_cents, currency)}
                        />
                      ) : null}
                    </dl>

                    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                      Minimum {hall.min_hours} hours · at least {hall.min_notice_days} days&apos;
                      notice. We charge whichever rate works out cheapest for your hours.
                    </p>

                    <Button asChild size="lg" className="mt-6 w-full">
                      <Link to="/hall/$slug" params={{ slug: hall.slug }}>
                        Check availability &amp; book
                      </Link>
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      You&apos;ll be asked to sign in so we can send your confirmation.
                    </p>
                  </aside>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Questions"
          title="Need something we haven't listed?"
          description="For multi-day events, non-standard hours or a walkthrough of the hall, the temple office is happy to help."
          align="center"
        />
        <div className="flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/contact">Contact the temple office</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

function Rate({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-display text-lg text-primary">{value}</dd>
    </div>
  );
}
