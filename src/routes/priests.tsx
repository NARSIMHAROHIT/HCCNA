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
        <div className="mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Priests in Hindu temples usually come from families with long heritage of priesthood.
            They are well-versed in Hindu scriptures and Sanskrit language in which most of the
            scriptures are written. The priests carry out the worship in the temple on behalf of
            other devotees. It is hence parartha, a service conducted for the sake of others. This
            worship of the deities is known as pooja and devotees can request such a service to the
            deity of their choice. Each deity is worshipped in a different way -- rituals are
            different and different Sanskrit Mantras are chanted.
          </p>
          <p>
            Typically temple priests do not engage in preaching (which is done by Swamijis, or Hindu
            monks). They will, however, explain the meaning of the pooja if asked. The priest
            performs the daily ceremonial ritual, &apos;pooja&apos;, which includes making offerings
            to the God, showering the idol with flowers, and on special occasions, milk, honey and
            curd. Towards the end of the pooja, an oil lamp with one or several wicks is lit called
            Aarati (sacred flame). With ringing of bells and gongs and chanting of mantras the
            Aarati is waved slowly in front of the deity around in a vertical oval traversing the
            whole deity from head to foot. After the ceremony, holy water, sacred flame and prasad
            are offered as blessings to the attending devotees to absorb the spiritual vibrations.
            The priest offers a spoonful of the holy water to all the attending devotees. This is
            accepted with a cupped right hand, sipped and then the right palm is touched to the
            forehead. When the sacred flame is brought around, with palms facing down, one reaches
            out both hands gently over the flame and then touch the hands to one&apos;s eyes. The
            &apos;Prasad&apos; is an edible offering, generally a fruit or a sweet, which is
            accepted reverentially with a cupped right hand before eating.
          </p>
          <p>
            Temple Priests perform daily poojas to the deities in the temple in the morning and
            evening to maintain the sanctity and the spiritual atmosphere in the temple.
          </p>
          <h2 className="pt-2 font-display text-xl text-foreground">HCCNA Priests</h2>
          <p>
            The priests at HCCNA are well versed in Ágama Sastras and Vedic Sastras. They have
            extensive experience in performing Archanas, Poojas, Homas and Abhishekams. They are
            highly qualified and well versed in all Hindu scriptures with years of experience in
            performing all poojas and ceremonies. They are also specialized in deity decorations,
            especially Moola and Utsav Murthy(s). Priest services are also available to devotees
            homes. Devotees have praised their high standard of performance and the manner in which
            poojas and abhisekams are conducted with dedication and quality. They are conversant in
            several languages including Hindi, Gujarati, Telugu, Odia, Tamil, Kannada and English.
          </p>
        </div>

        {active.length === 0 ? (
          <EmptyState title="Priest profiles coming soon" />
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
              .sort(
                (a, b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time),
              );
            const serviceIds = data.links
              .filter((l) => l.priest_id === p.id)
              .map((l) => l.service_id);
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
                  <p className="mt-3 text-sm text-muted-foreground">
                    By appointment — contact the office.
                  </p>
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
