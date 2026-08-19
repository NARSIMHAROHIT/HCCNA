import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";

import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { getCommunity } from "@/lib/community.functions";

export const communityQuery = queryOptions({
  queryKey: ["community"],
  queryFn: () => getCommunity(),
  staleTime: 60_000,
});

/**
 * Target number of donors per page. A tier is never split across two pages, so
 * a page runs over this figure rather than break a tier in half — every donor
 * in a tier is always shown together.
 */
const TARGET_PER_PAGE = 24;

interface Tier {
  name: string;
  donors: DonorRow[];
}

type DonorRow = Awaited<ReturnType<typeof getCommunity>>["donors"][number];

/** Group donors into tiers, preserving the admin's display order. */
function groupIntoTiers(donors: DonorRow[]): Tier[] {
  const tiers: Tier[] = [];
  for (const donor of donors) {
    const name = donor.tier ?? "Supporters";
    const existing = tiers.find((t) => t.name === name);
    if (existing) existing.donors.push(donor);
    else tiers.push({ name, donors: [donor] });
  }
  return tiers;
}

/** Pack whole tiers onto pages, starting a new page once a page is full. */
function paginateTiers(tiers: Tier[]): Tier[][] {
  const pages: Tier[][] = [];
  let page: Tier[] = [];
  let count = 0;

  for (const tier of tiers) {
    // A tier that would overflow a page that already has content starts a new one.
    if (page.length > 0 && count + tier.donors.length > TARGET_PER_PAGE) {
      pages.push(page);
      page = [];
      count = 0;
    }
    page.push(tier);
    count += tier.donors.length;
  }
  if (page.length > 0) pages.push(page);
  return pages.length > 0 ? pages : [[]];
}

export const Route = createFileRoute("/donors")({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1).default(1),
  }),
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
  const { page } = Route.useSearch();

  const all = data.donors;

  // Tiers are free text set in Admin → Board & donors, so a new category (for
  // example "$1,000 – $10,000") appears here as soon as it is used on a donor.
  const pages = paginateTiers(groupIntoTiers(all));
  const totalPages = pages.length;
  const current = Math.min(page, totalPages);
  const tiersOnPage = pages[current - 1] ?? [];
  const shownCount = tiersOnPage.reduce((sum, t) => sum + t.donors.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Gratitude"
        title="Our donors & sponsors"
        description="Every lamp lit and every festival celebrated is made possible by these devotees and families."
      />
      <Section>
        {all.length === 0 ? (
          <EmptyState
            title="Donor wall coming soon"
            description="The temple office is preparing the list of contributors."
          />
        ) : (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              Showing {shownCount} of {all.length} donors
              {totalPages > 1 ? ` · page ${current} of ${totalPages}` : ""}
            </p>

            <div className="space-y-12">
              {tiersOnPage.map((tier) => {
                const rows = tier.donors;
                return (
                  <div key={tier.name}>
                    <h2 className="text-2xl">{tier.name}</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {rows.map((d) => (
                        <article key={d.id} className="surface-panel p-5">
                          <p className="font-display text-lg">
                            {d.is_anonymous ? "Anonymous devotee" : d.donor_name}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {[d.category, d.year ? String(d.year) : null]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          {money(d.amount_cents, data.temple.currency) ? (
                            <p className="mt-2 text-sm font-semibold text-primary">
                              {money(d.amount_cents, data.temple.currency)}
                            </p>
                          ) : null}
                          {d.message ? (
                            <p className="mt-3 text-sm italic text-muted-foreground">
                              “{d.message}”
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 ? <DonorPager current={current} pages={pages} /> : null}
          </>
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

function DonorPager({ current, pages }: { current: number; pages: Tier[][] }) {
  const totalPages = pages.length;

  /** Label a page by the tiers on it, so "Next" tells you what you are going to. */
  const labelFor = (index: number) => {
    const tiers = pages[index];
    if (!tiers || tiers.length === 0) return String(index + 1);
    if (tiers.length === 1) return tiers[0]!.name;
    return `${tiers[0]!.name} +${tiers.length - 1}`;
  };

  return (
    <nav
      aria-label="Donor wall pages"
      className="mt-14 flex flex-wrap items-center justify-center gap-2 border-t border-border/70 pt-8"
    >
      <Button
        asChild={current > 1}
        variant="outline"
        size="sm"
        disabled={current === 1}
        aria-label="Previous page of donors"
      >
        {current > 1 ? (
          <Link to="/donors" search={{ page: current - 1 }}>
            <ChevronLeft className="size-4" aria-hidden /> {labelFor(current - 2)}
          </Link>
        ) : (
          <span>
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </span>
        )}
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {pages.map((_, i) => {
          const p = i + 1;
          return (
            <Button key={p} asChild variant={p === current ? "default" : "ghost"} size="sm">
              <Link
                to="/donors"
                search={{ page: p }}
                aria-current={p === current ? "page" : undefined}
              >
                {labelFor(i)}
              </Link>
            </Button>
          );
        })}
      </div>

      <Button
        asChild={current < totalPages}
        variant="outline"
        size="sm"
        disabled={current === totalPages}
        aria-label="Next page of donors"
      >
        {current < totalPages ? (
          <Link to="/donors" search={{ page: current + 1 }}>
            {labelFor(current)} <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span>
            Next <ChevronRight className="size-4" aria-hidden />
          </span>
        )}
      </Button>
    </nav>
  );
}
