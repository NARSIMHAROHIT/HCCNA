import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatInTimezone, formatMoney } from "@/lib/timezone";

export interface ServiceCardData {
  slug: string;
  name: string;
  short_description: string | null;
  duration_minutes: number;
  price_cents: number;
  location_type: string;
}

export function ServiceCard({ service, currency }: { service: ServiceCardData; currency: string }) {
  const locationLabel =
    service.location_type === "temple"
      ? "At the temple"
      : service.location_type === "home"
        ? "At your home"
        : "Temple or home";

  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="surface-panel group flex h-full flex-col p-5 transition hover:shadow-[var(--shadow-lift)] focus-visible:shadow-[var(--shadow-lift)]"
    >
      <h3 className="text-xl leading-snug transition group-hover:text-primary">{service.name}</h3>
      {service.short_description ? (
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{service.short_description}</p>
      ) : (
        <div className="flex-1" />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden /> {service.duration_minutes} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden /> {locationLabel}
        </span>
      </div>
      <p className="mt-4 font-display text-lg text-primary">
        {service.price_cents > 0 ? formatMoney(service.price_cents, currency) : "By donation"}
      </p>
    </Link>
  );
}

export interface EventCardData {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  starts_at: string;
  location: string | null;
  registration_required: boolean;
}

export function EventCard({ event, timezone }: { event: EventCardData; timezone: string }) {
  return (
    <Link
      to="/events/$slug"
      params={{ slug: event.slug }}
      className="surface-panel group flex h-full flex-col p-5 transition hover:shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <span className="text-[0.65rem] font-bold uppercase tracking-wide">
            {formatInTimezone(event.starts_at, timezone, { month: "short" })}
          </span>
          <span className="font-display text-xl leading-none">
            {formatInTimezone(event.starts_at, timezone, { day: "numeric" })}
          </span>
        </div>
        {event.category ? <Badge variant="secondary">{event.category}</Badge> : null}
      </div>
      <h3 className="mt-4 text-lg leading-snug transition group-hover:text-primary">
        {event.title}
      </h3>
      {event.description ? (
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {event.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}
      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
        <p className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden />
          {formatInTimezone(event.starts_at, timezone, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        {event.location ? (
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5" aria-hidden /> {event.location}
          </p>
        ) : null}
        {event.registration_required ? (
          <p className="inline-flex items-center gap-1.5 text-primary">
            <Users className="size-3.5" aria-hidden /> Registration required
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export interface PriestCardData {
  id: string;
  full_name: string;
  title: string | null;
  biography: string | null;
  qualifications: string | null;
  languages: string[];
  specializations: string[];
  photo_url: string | null;
  working_since?: string | null;
  working_days?: string[] | null;
}

export function PriestCard({ priest }: { priest: PriestCardData }) {
  const initials = priest.full_name
    .split(" ")
    .slice(-2)
    .map((part) => part[0])
    .join("");

  return (
    <article className="surface-panel flex h-full flex-col p-5">
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
          {initials}
        </div>
        <div>
          <h3 className="text-lg leading-tight">{priest.full_name}</h3>
          {priest.title ? <p className="text-sm text-muted-foreground">{priest.title}</p> : null}
          {priest.working_since ? (
            <p className="text-xs text-muted-foreground">
              Serving since{" "}
              {new Date(priest.working_since).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>
      </div>
      {priest.biography ? (
        <p className="mt-4 flex-1 text-sm text-muted-foreground">{priest.biography}</p>
      ) : (
        <div className="flex-1" />
      )}
      {priest.qualifications ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Qualifications: </span>
          {priest.qualifications}
        </p>
      ) : null}
      {priest.specializations.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {priest.specializations.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      ) : null}
      {priest.working_days?.length ? (
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">At the temple: </span>
          {priest.working_days.join(", ")}
        </p>
      ) : null}
      {priest.languages.length ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Languages: {priest.languages.join(", ")}
        </p>
      ) : null}
    </article>
  );
}
