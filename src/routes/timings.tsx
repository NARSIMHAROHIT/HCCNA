import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
import { siteQuery } from "@/lib/queries";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatClock(value: string | null) {
  if (!value) return "—";
  const [h, m] = value.split(":").map(Number);
  const hour = h ?? 0;
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
}

export const Route = createFileRoute("/timings")({
  head: () => ({
    meta: [
      { title: "Temple Timings & Daily Darshan — HCCNA" },
      {
        name: "description",
        content:
          "Daily darshan hours, aarti schedule and special day timings at the Hindu Cultural Center of North Alabama.",
      },
      { property: "og:title", content: "Temple Timings & Daily Darshan" },
      { property: "og:description", content: "Daily darshan hours and aarti schedule." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Timings,
});

function Timings() {
  const { data } = useSuspenseQuery(siteQuery);
  const weekly = data.schedules.filter((s) => s.day_of_week !== null);
  const special = data.schedules.filter((s) => s.special_date !== null);

  return (
    <>
      <PageHeader
        eyebrow="Darshan"
        title="Temple timings"
        description="The sanctum is open for darshan during the hours below. Timings may shift on festival days — check the events page."
      />

      <Section>
        {weekly.length === 0 ? (
          <EmptyState title="Timings are being updated" description="Please call the temple office." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {DAYS.map((day, index) => {
              const rows = weekly
                .filter((s) => s.day_of_week === index)
                .sort((a, b) => (a.opens_at ?? "").localeCompare(b.opens_at ?? ""));
              if (rows.length === 0) return null;
              return (
                <article key={day} className="surface-panel p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg">{day}</h2>
                    {rows.every((r) => r.is_closed) ? <Badge variant="secondary">Closed</Badge> : null}
                  </div>
                  <dl className="mt-3">
                    {rows.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2 last:border-0"
                      >
                        <dt className="text-sm">
                          {r.label}
                          {r.note ? (
                            <span className="block text-xs text-muted-foreground">{r.note}</span>
                          ) : null}
                        </dt>
                        <dd className="whitespace-nowrap text-sm font-semibold">
                          {r.is_closed ? "Closed" : `${formatClock(r.opens_at)} – ${formatClock(r.closes_at)}`}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>
              );
            })}
          </div>
        )}
      </Section>

      {special.length ? (
        <Section tone="muted">
          <h2 className="mb-6 text-2xl">Special day timings</h2>
          <div className="surface-panel divide-y divide-border/70 p-5">
            {special.map((s) => (
              <div key={s.id} className="flex items-baseline justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold">{s.label}</p>
                  <p className="text-sm text-muted-foreground">{s.special_date}</p>
                </div>
                <p className="whitespace-nowrap text-sm font-semibold">
                  {s.is_closed ? "Closed" : `${formatClock(s.opens_at)} – ${formatClock(s.closes_at)}`}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
