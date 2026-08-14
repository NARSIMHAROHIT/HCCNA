import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { EventCard } from "@/components/site/cards";
import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { siteQuery } from "@/lib/queries";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events & Festivals — HCCNA" },
      {
        name: "description",
        content: "Upcoming festivals, satsangs, cultural programs and community events at our temple.",
      },
      { property: "og:title", content: "Events & Festivals" },
      { property: "og:description", content: "Upcoming festivals and community events at our temple." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsIndex,
});

function EventsIndex() {
  const { data } = useSuspenseQuery(siteQuery);
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Events & festivals"
        description="Join us for festivals, abhishekams, satsangs and cultural programs through the year."
      />
      <Section>
        {data.events.length === 0 ? (
          <EmptyState title="No upcoming events yet" description="Please check back soon." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.events.map((e) => (
              <EventCard key={e.id} event={e} timezone={data.temple.timezone} />
            ))}
          </div>
        )}
      </Section>

      {data.annualEvents.length ? (
        <Section tone="muted">
          <h2 className="mb-6 text-2xl">Yearly events at the temple</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.annualEvents.map((e) => (
              <EventCard key={e.id} event={e} timezone={data.temple.timezone} />
            ))}
          </div>
        </Section>
      ) : null}

      {data.eventPhotos.length ? (
        <Section>
          <h2 className="mb-6 text-2xl">Photos from earlier events</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.eventPhotos.map((photo) => (
              <figure key={photo.id} className="surface-panel overflow-hidden">
                <img
                  src={photo.image_url}
                  alt={photo.title ?? "Temple event photograph"}
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
                {photo.title || photo.caption ? (
                  <figcaption className="p-3 text-xs text-muted-foreground">
                    {[photo.title, photo.year].filter(Boolean).join(" · ")}
                    {photo.caption ? ` — ${photo.caption}` : ""}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
