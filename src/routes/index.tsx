import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Sparkles, Sunrise, Sunset } from "lucide-react";
import heroImage from "@/assets/temple-hero.jpg";
import heroImage1 from "@/assets/temple-hero-1.jpg";
import heroImage2 from "@/assets/temple-hero-2.jpg";

import { EventCard, ServiceCard } from "@/components/site/cards";
import { NewsletterSignup } from "@/components/site/NewsletterSignup";
import { DataRow, GoldRule, Section, SectionHeading } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
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
          {announcement.body ? <span className="hidden sm:inline"> — {announcement.body}</span> : null}
        </div>
      ) : null}

      <RadixCarousel />

      <section className="temple-gradient relative overflow-hidden px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow">{[temple.city, temple.state].filter(Boolean).join(", ")}</p>
            {temple.tagline ? (
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{temple.tagline}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/services">
                  Book a pooja <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/timings">Temple timings</Link>
              </Button>
            </div>
            {data.deities.length ? (
              <div className="mt-10">
                <p className="eyebrow mb-3">Deities worshipped here</p>
                <div className="flex flex-wrap gap-2">
                  {data.deities.map((d) => (
                    <Badge key={d.id} variant="secondary">
                      {d.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

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

      {upcomingEvents.length ? (
        <Section tone="muted">
          <SectionHeading
            eyebrow="Community"
            title="Upcoming events & festivals"
            action={
              <Button asChild variant="outline">
                <Link to="/events">All events</Link>
              </Button>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} timezone={tz} />
            ))}
          </div>
        </Section>
      ) : null}

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
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
