import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { volunteerForEvent } from "@/lib/community.functions";
import { eventQuery } from "@/lib/queries";
import { formatInTimezone, formatMoney } from "@/lib/timezone";

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(eventQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Event unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.event.title} — HCCNA`;
    const description =
      loaderData.event.description?.slice(0, 155) ??
      `Join us for ${loaderData.event.title} at our temple.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(eventQuery(slug));
  if (!data) return null;
  const { event, temple, items, photos } = data;
  const tz = temple.timezone;

  return (
    <>
      <PageHeader
        eyebrow={event.category ?? "Event"}
        title={event.title}
        description={formatInTimezone(event.starts_at, tz, {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {(event.description ?? "")
              .split("\n")
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}

            {items.length ? (
              <div className="surface-panel p-6 text-foreground">
                <h2 className="font-display text-xl">Items to bring for this pooja</h2>
                <ul className="mt-4 divide-y divide-border/70">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-4 py-2.5 text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        {[item.quantity, item.note].filter(Boolean).join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {event.volunteers_needed ? <VolunteerForm eventId={event.id} /> : null}

            {photos.length ? (
              <div>
                <h2 className="font-display text-xl text-foreground">Photos from earlier years</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {photos.map((photo) => (
                    <figure key={photo.id} className="surface-panel overflow-hidden">
                      <img
                        src={photo.image_url}
                        alt={photo.title ?? `${event.title} photograph`}
                        loading="lazy"
                        className="h-48 w-full object-cover"
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
              </div>
            ) : null}
          </div>
          <aside className="surface-panel h-fit p-6">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Starts</dt>
                <dd className="font-medium">
                  {formatInTimezone(event.starts_at, tz, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </dd>
              </div>
              {event.ends_at ? (
                <div>
                  <dt className="text-muted-foreground">Ends</dt>
                  <dd className="font-medium">
                    {formatInTimezone(event.ends_at, tz, { hour: "numeric", minute: "2-digit" })}
                  </dd>
                </div>
              ) : null}
              {event.location ? (
                <div>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="font-medium">{event.location}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted-foreground">Contribution</dt>
                <dd className="font-medium">
                  {event.fee_cents > 0 ? formatMoney(event.fee_cents, temple.currency) : "Free"}
                </dd>
              </div>
            </dl>
            {event.deity ? (
              <Badge className="mt-4" variant="secondary">
                {event.deity}
              </Badge>
            ) : null}
            {event.sponsor_name ? (
              <div className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="eyebrow">Sponsored by</p>
                <p className="mt-1 font-display text-lg">{event.sponsor_name}</p>
                {event.sponsorship_amount_cents ? (
                  <p className="text-sm text-primary">
                    {formatMoney(event.sponsorship_amount_cents, temple.currency)}
                  </p>
                ) : null}
                {event.sponsor_note ? (
                  <p className="mt-1 text-sm text-muted-foreground">{event.sponsor_note}</p>
                ) : null}
                {event.sponsor_contact ? (
                  <p className="mt-1 text-xs text-muted-foreground">{event.sponsor_contact}</p>
                ) : null}
              </div>
            ) : null}
            {event.is_annual ? (
              <Badge className="mt-4" variant="outline">
                Celebrated every year
              </Badge>
            ) : null}
            {event.registration_required ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Registration is required — please contact the temple office to reserve your place.
              </p>
            ) : null}
          </aside>
        </div>
      </Section>
    </>
  );
}

function VolunteerForm({ eventId }: { eventId: string }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [rolePreference, setRolePreference] = useState("");
  const [availability, setAvailability] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.user));
    });
    return () => {
      active = false;
    };
  }, []);

  if (done) {
    return (
      <div className="surface-panel p-6 text-foreground">
        <h2 className="font-display text-xl">Thank you for volunteering</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The temple team will contact you with details closer to the event.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-panel p-6 text-foreground">
      <h2 className="font-display text-xl">Volunteer for this event</h2>
      {signedIn === false ? (
        <p className="mt-3 text-sm">
          Please{" "}
          <Link to="/auth" className="text-primary underline">
            sign in
          </Link>{" "}
          to register as a volunteer.
        </p>
      ) : (
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await volunteerForEvent({
                data: {
                  eventId,
                  ...(fullName ? { fullName } : {}),
                  ...(phone ? { phone } : {}),
                  ...(rolePreference ? { rolePreference } : {}),
                  ...(availability ? { availability } : {}),
                  ...(notes ? { notes } : {}),
                },
              });
              setDone(true);
              toast.success("You are registered as a volunteer.");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not register");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="v-name">Your name</Label>
            <Input id="v-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-phone">Phone</Label>
            <Input id="v-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-role">How would you like to help?</Label>
            <Input
              id="v-role"
              placeholder="Kitchen, decorations, parking…"
              value={rolePreference}
              onChange={(e) => setRolePreference(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-avail">Availability</Label>
            <Input
              id="v-avail"
              placeholder="Morning, evening…"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="v-notes">Notes</Label>
            <Textarea
              id="v-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy || signedIn === null}>
              {busy ? "Registering…" : "Register as volunteer"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
