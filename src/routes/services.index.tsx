import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ServiceCard } from "@/components/site/cards";
import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { siteQuery } from "@/lib/queries";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Poojas & Services — Book Online | HCCNA" },
      {
        name: "description",
        content:
          "Browse archana, abhishekam, homam, samskara and home poojas offered by our priests, and book a conflict-free time online.",
      },
      { property: "og:title", content: "Poojas & Services — Book Online" },
      { property: "og:description", content: "Browse and book poojas with our temple priests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { data } = useSuspenseQuery(siteQuery);
  const services = data.services.filter((s) => s.is_active);

  return (
    <>
      <PageHeader
        eyebrow="Sevas"
        title="Poojas & services"
        description="Select a seva to see details, priests and available times. Bookings are confirmed instantly."
      />

      <Section>
        {services.length === 0 ? (
          <EmptyState title="Services are being published" />
        ) : (
          <div className="space-y-12">
            {data.categories.map((cat) => {
              const inCat = services.filter((s) => s.category_id === cat.id);
              if (inCat.length === 0) return null;
              return (
                <div key={cat.id}>
                  <h2 className="text-2xl">{cat.name}</h2>
                  {cat.description ? (
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  ) : null}
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {inCat.map((s) => (
                      <ServiceCard key={s.id} service={s} currency={data.temple.currency} />
                    ))}
                  </div>
                </div>
              );
            })}
            {(() => {
              const uncategorized = services.filter(
                (s) => !s.category_id || !data.categories.some((c) => c.id === s.category_id),
              );
              if (uncategorized.length === 0) return null;
              return (
                <div>
                  <h2 className="text-2xl">Other services</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {uncategorized.map((s) => (
                      <ServiceCard key={s.id} service={s} currency={data.temple.currency} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Section>
    </>
  );
}
