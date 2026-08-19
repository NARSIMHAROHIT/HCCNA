import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, CircleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { basisLabel, formatMoney, quoteHall } from "@/lib/hall-pricing";
import {
  HALL_EVENT_TYPES,
  createHallBooking,
  getHallAvailability,
  getHallBySlug,
} from "@/lib/hall.functions";
import { formatInTimezone } from "@/lib/timezone";

export const Route = createFileRoute("/_authenticated/hall/$slug")({
  head: () => ({
    meta: [{ title: "Book the Hall — HCCNA" }, { name: "robots", content: "noindex" }],
  }),
  component: HallBookingPage,
});

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

interface Submitted {
  reference: string;
  checkoutUrl: string | null;
  totalCents: number;
  depositCents: number;
}

function HallBookingPage() {
  const { slug } = Route.useParams();
  const loadHall = useServerFn(getHallBySlug);
  const loadAvailability = useServerFn(getHallAvailability);
  const book = useServerFn(createHallBooking);

  const { data: hallData } = useQuery({
    queryKey: ["hall", slug],
    queryFn: () => loadHall({ data: { slug } }),
  });
  const hall = hallData?.hall ?? null;
  const currency = hallData?.temple.currency ?? "USD";
  const timezone = hallData?.temple.timezone ?? "America/Chicago";

  const earliestDate = useMemo(() => {
    const days = hall?.min_notice_days ?? 7;
    return isoDate(new Date(Date.now() + days * 86400000));
  }, [hall?.min_notice_days]);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [hours, setHours] = useState(4);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  const [form, setForm] = useState({
    eventType: "Wedding reception",
    eventTitle: "",
    guestCount: 100,
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    organisation: "",
    needsKitchen: false,
    needsAv: false,
    needsTables: false,
    setupNotes: "",
    notes: "",
  });

  const { data: availability, isFetching } = useQuery({
    queryKey: ["hall-availability", slug, date],
    queryFn: () => loadAvailability({ data: { slug, from: date, days: 1 } }),
    enabled: Boolean(date),
  });

  const quote = hall ? quoteHall(hall, hours) : null;

  const dayIsTaken = (availability?.busy.length ?? 0) > 0;

  const mutation = useMutation({
    mutationFn: async () =>
      book({
        data: {
          slug,
          date,
          startTime,
          hours,
          eventType: form.eventType as (typeof HALL_EVENT_TYPES)[number],
          guestCount: Number(form.guestCount),
          contactName: form.contactName,
          contactPhone: form.contactPhone,
          contactEmail: form.contactEmail,
          needsKitchen: form.needsKitchen,
          needsAv: form.needsAv,
          needsTables: form.needsTables,
          origin: window.location.origin,
          ...(form.eventTitle ? { eventTitle: form.eventTitle } : {}),
          ...(form.organisation ? { organisation: form.organisation } : {}),
          ...(form.setupNotes ? { setupNotes: form.setupNotes } : {}),
          ...(form.notes ? { notes: form.notes } : {}),
        },
      }),
    onSuccess: (result) => {
      setSubmitted({
        reference: result.reference,
        checkoutUrl: result.checkoutUrl,
        totalCents: result.quote.totalCents,
        depositCents: result.quote.depositCents,
      });
      toast.success(`Hall request ${result.reference} received`);
      if (result.checkoutUrl) window.location.href = result.checkoutUrl;
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "The request could not be sent."),
  });

  if (hallData && !hall) {
    return (
      <Section>
        <p className="text-muted-foreground">This hall is not available for booking.</p>
        <Link to="/halls" className="mt-4 inline-block text-primary underline">
          Back to hall rental
        </Link>
      </Section>
    );
  }

  if (submitted) {
    return (
      <>
        <PageHeader
          eyebrow="Request received"
          title={`Your reference is ${submitted.reference}`}
          description="The temple office will confirm your booking. Your date is held while we do."
        />
        <Section>
          <div className="surface-panel mx-auto max-w-xl space-y-4 p-8 text-center">
            <CalendarCheck className="mx-auto size-10 text-primary" aria-hidden />
            <p className="text-muted-foreground">
              {submitted.depositCents > 0
                ? `A refundable deposit of ${formatMoney(submitted.depositCents, currency)} secures the date. The balance of ${formatMoney(submitted.totalCents, currency)} is due before your event.`
                : `Your rental total is ${formatMoney(submitted.totalCents, currency)}.`}
            </p>
            {submitted.checkoutUrl ? (
              <Button asChild size="lg" className="w-full">
                <a href={submitted.checkoutUrl}>Pay the deposit now</a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                The temple office will contact you about payment.
              </p>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">View my bookings</Link>
            </Button>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Hall booking"
        title={hall?.name ?? "Book the hall"}
        {...(hall
          ? {
              description: `Up to ${hall.capacity} guests · available ${hall.opens_at.slice(0, 5)}–${hall.closes_at.slice(0, 5)} · minimum ${hall.min_hours} hours`,
            }
          : {})}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* ---------------------------------------------- date & quote */}
          <div className="surface-panel h-fit space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="date">Event date</Label>
              <Input
                id="date"
                type="date"
                min={earliestDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              {hall ? (
                <p className="text-xs text-muted-foreground">
                  Earliest bookable date is {earliestDate} ({hall.min_notice_days} days&apos;
                  notice).
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start time</Label>
                <Input
                  id="startTime"
                  type="time"
                  step={1800}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours needed</Label>
                <Input
                  id="hours"
                  type="number"
                  min={hall?.min_hours ?? 1}
                  max={hall?.max_hours ?? 12}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>
            </div>

            {/* availability for the chosen day */}
            <div className="rounded-md border border-border/70 p-4">
              <p className="text-sm font-semibold">Availability</p>
              {!date ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a date to see what is already reserved.
                </p>
              ) : isFetching ? (
                <p className="mt-2 text-sm text-muted-foreground">Checking the calendar…</p>
              ) : !dayIsTaken ? (
                <p className="mt-2 text-sm text-primary">
                  Nothing else is booked on this date — the hall is yours to reserve.
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
                    Already reserved on this date:
                  </p>
                  <ul className="space-y-1 text-sm">
                    {availability!.busy.map((b) => (
                      <li key={b.starts_at} className="rounded bg-muted px-3 py-1.5">
                        {formatInTimezone(b.starts_at, timezone, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {formatInTimezone(b.ends_at, timezone, {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    You can still request another time on this day.
                  </p>
                </div>
              )}
            </div>

            {/* live quote */}
            {quote ? (
              <div className="rounded-md border border-primary/40 bg-accent/40 p-4">
                <p className="eyebrow">Estimate</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <QuoteRow
                    label={`${basisLabel(quote.basis)} · ${quote.hours} hrs`}
                    value={formatMoney(quote.rentalCents, currency)}
                  />
                  {quote.cleaningFeeCents > 0 ? (
                    <QuoteRow
                      label="Cleaning fee"
                      value={formatMoney(quote.cleaningFeeCents, currency)}
                    />
                  ) : null}
                  <QuoteRow
                    label="Rental total"
                    value={formatMoney(quote.totalCents, currency)}
                    strong
                  />
                  {quote.depositCents > 0 ? (
                    <QuoteRow
                      label="Refundable deposit (due now)"
                      value={formatMoney(quote.depositCents, currency)}
                    />
                  ) : null}
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  We automatically apply whichever rate is cheapest for your hours. Final amounts
                  are confirmed by the temple office.
                </p>
              </div>
            ) : null}
          </div>

          {/* ---------------------------------------------------- the form */}
          <form
            className="surface-panel space-y-5 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!date) {
                toast.error("Please choose an event date.");
                return;
              }
              mutation.mutate();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventType">Type of event</Label>
                <Select
                  value={form.eventType}
                  onValueChange={(v) => setForm({ ...form, eventType: v })}
                >
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    {HALL_EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestCount">Expected guests</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min={1}
                  max={hall?.capacity ?? 5000}
                  required
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event name (optional)</Label>
              <Input
                id="eventTitle"
                placeholder="e.g. Sharma–Rao wedding reception"
                value={form.eventTitle}
                onChange={(e) => setForm({ ...form, eventTitle: e.target.value })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Your name</Label>
                <Input
                  id="contactName"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  required
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  required
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organisation">Organisation (optional)</Label>
                <Input
                  id="organisation"
                  value={form.organisation}
                  onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                />
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold">What do you need?</legend>
              <CheckboxRow
                id="needsTables"
                label="Tables and chairs set up"
                checked={form.needsTables}
                onChange={(v) => setForm({ ...form, needsTables: v })}
              />
              <CheckboxRow
                id="needsKitchen"
                label="Kitchen access for catering"
                checked={form.needsKitchen}
                onChange={(v) => setForm({ ...form, needsKitchen: v })}
              />
              <CheckboxRow
                id="needsAv"
                label="Sound system / projector"
                checked={form.needsAv}
                onChange={(v) => setForm({ ...form, needsAv: v })}
              />
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="setupNotes">Setup and layout notes (optional)</Label>
              <Textarea
                id="setupNotes"
                rows={2}
                value={form.setupNotes}
                onChange={(e) => setForm({ ...form, setupNotes: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Anything else for the temple office (optional)</Label>
              <Textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending your request…" : "Request this date"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Requesting holds the date. Your booking is confirmed once the deposit is received.
            </p>
          </form>
        </div>
      </Section>
    </>
  );
}

function QuoteRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/50 py-1.5 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={strong ? "font-display text-lg text-primary" : "font-semibold"}>{value}</dd>
    </div>
  );
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  );
}
