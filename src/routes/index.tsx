import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Sparkles, Sunrise, Sunset } from "lucide-react";

import { EventCard, ServiceCard } from "@/components/site/cards";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { DataRow, GoldRule, Section, SectionHeading } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { panchangQuery, siteQuery } from "@/lib/queries";
import { formatInTimezone } from "@/lib/timezone";
import RadixCarousel from "@/components/ui/radixcarousel";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(siteQuery),
      context.queryClient.ensureQueryData(panchangQuery()),
    ]);
  },
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "Daily darshan timings, online pooja booking with our priests, festivals, and the Hindu calendar for our North Alabama temple community.",
      },
      {
        property: "og:description",
        content: "Book poojas online, view daily timings and panchang, and join our festivals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(siteQuery);
  const { data: panchang } = useSuspenseQuery(panchangQuery());
  const temple = data.temple;
  const tz = temple.timezone;
  const today = panchang.today;

  const featuredServices = data.services.filter((s) => s.is_active).slice(0, 6);
  const upcomingEvents = data.events.slice(0, 3);
  const announcement = data.announcements[0];

  return (
    <>
      {announcement ? (
        <div className="bg-primary px-4 py-2.5 text-center text-sm text-primary-foreground">
          <span className="font-semibold">{announcement.title}</span>
          {announcement.body ? (
            <span className="hidden sm:inline"> — {announcement.body}</span>
          ) : null}
        </div>
      ) : null}

      {/* Photographs on the left, today's panchang on the right. */}
      <section className="temple-gradient relative overflow-hidden px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <RadixCarousel />

          <div className="flex flex-col gap-5">
            <aside className="surface-panel p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Today&apos;s Panchang</p>
                  <p className="mt-1 font-display text-xl">
                    {formatInTimezone(new Date().toISOString(), tz, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Sparkles className="size-6 text-primary" aria-hidden />
              </div>
              <GoldRule className="my-4" />
              <dl>
                <DataRow label="Tithi" value={`${today.tithiName} (${today.paksha})`} />
                <DataRow label="Nakshatra" value={today.nakshatraName} />
                <DataRow label="Yoga" value={today.yogaName} />
                <DataRow label="Masa" value={today.masaName} />
                <DataRow
                  label="Sunrise / Sunset"
                  value={
                    <span className="inline-flex items-center gap-2">
                      <Sunrise className="size-3.5" aria-hidden /> {today.sunrise}
                      <Sunset className="size-3.5" aria-hidden /> {today.sunset}
                    </span>
                  }
                />
                <DataRow label="Rahu Kalam" value={today.rahuKalam} />
              </dl>
              {today.observances.length ? (
                <p className="mt-4 rounded-md bg-accent/60 px-3 py-2 text-sm text-accent-foreground">
                  {today.observances.join(" • ")}
                </p>
              ) : null}
              <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
                <Link to="/calendar">
                  <CalendarDays className="size-4" aria-hidden /> Full calendar
                </Link>
              </Button>
            </aside>

            {upcomingEvents.length ? (
              <aside className="surface-panel p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="eyebrow">Upcoming events</p>
                  <Link to="/events" className="text-sm font-semibold text-primary hover:underline">
                    View all events
                  </Link>
                </div>
                <GoldRule className="my-4" />
                <ul className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <li key={event.id}>
                      <Link
                        to="/events/$slug"
                        params={{ slug: event.slug }}
                        className="-mx-2 flex items-baseline justify-between gap-4 rounded-md px-2 py-2 transition hover:bg-accent/60"
                      >
                        <span className="min-w-0 truncate font-medium">{event.title}</span>
                        <span className="shrink-0 text-sm text-muted-foreground">
                          {formatInTimezone(event.starts_at, tz, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link to="/services">
                  Book a pooja <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link to="/timings">Temple timings</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Sevas & Poojas"
          title="Book a ceremony with our priests"
          description="Choose a seva, pick a time that suits you, and we confirm a priest instantly — no phone tag required."
          action={
            <Button asChild variant="outline">
              <Link to="/services">View all services</Link>
            </Button>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((s) => (
            <ServiceCard key={s.id} service={s} currency={temple.currency} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <SectionHeading
              eyebrow="Stay connected"
              title="Subscribe to temple event updates"
              description="Receive festival announcements and pooja schedules, and let us know if you would like to volunteer at our events."
            />
            {data.eventPhotos.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {data.eventPhotos.slice(0, 6).map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.image_url}
                    alt={photo.title ?? "Past temple event"}
                    loading="lazy"
                    className="h-28 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            ) : null}
          </div>
          <NewsletterSignup />
        </div>
      </Section>

      <Section tone="accent">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-3xl md:text-4xl">Support the temple</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Your contributions sustain daily worship, festivals, priest services, and cultural
              education for the next generation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="lg">
              <Link to="/donate">Donate now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/halls">Book our hall</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
