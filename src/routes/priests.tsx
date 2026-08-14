import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { PriestCard } from "@/components/site/cards";
import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { priestsQuery } from "@/lib/queries";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Route = createFileRoute("/priests")({
  loader: ({ context }) => context.queryClient.ensureQueryData(priestsQuery),
  head: () => ({
    meta: [
      { title: "Our Priests & Availability — HCCNA" },
      {
        name: "description",
        content:
          "Meet the priests who perform poojas, samskaras and homams at our temple, with their languages, specializations and weekly availability.",
      },
      { property: "og:title", content: "Our Priests & Availability" },
      { property: "og:description", content: "Meet the priests who serve our temple community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Priests,
});

function Priests() {
  const { data } = useSuspenseQuery(priestsQuery);
  const active = data.priests.filter((p) => p.is_active);

  return (
    <>
      <PageHeader
        eyebrow="Purohits"
        title="Our priests"
        description="Our priests are trained in Agama and Vedic traditions and serve devotees at the temple and in their homes."
      />

      <Section>
        {active.length === 0 ? (
          <EmptyState title="Priest profiles coming soon" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {active.map((p) => (
              <PriestCard key={p.id} priest={p} />
            ))}
          </div>
        )}
      </Section>

      <Section tone="muted">
        <h2 className="mb-6 text-2xl">Weekly availability</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {active.map((p) => {
            const windows = data.windows
              .filter((w) => w.priest_id === p.id)
              .sort((a, b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time));
            const serviceIds = data.links.filter((l) => l.priest_id === p.id).map((l) => l.service_id);
            const services = data.services.filter((s) => serviceIds.includes(s.id));
            return (
              <article key={p.id} className="surface-panel p-5">
                <h3 className="text-lg">{p.full_name}</h3>
                {windows.length ? (
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {windows.map((w, i) => (
                      <li key={`${w.priest_id}-${i}`} className="flex justify-between gap-4">
                        <span>{DAYS[w.day_of_week]}</span>
                        <span className="font-medium text-foreground">
                          {w.start_time.slice(0, 5)} – {w.end_time.slice(0, 5)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">By appointment — contact the office.</p>
                )}
                {services.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {services.slice(0, 6).map((s) => (
                      <Badge key={s.id} variant="secondary">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link to="/services">Book a service</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
