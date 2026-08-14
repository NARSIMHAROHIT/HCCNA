import { zonedTimeToUtc, weekdayOfIsoDate } from "./timezone";

/**
 * Pure booking-slot engine.
 *
 * A slot is offered only when ALL of these hold:
 *  - the priest can perform the service (priest_services)
 *  - the slot fits entirely inside one of the priest's weekly availability windows,
 *    including the service's buffer time
 *  - the date is not inside a priest blackout (vacation / blocked)
 *  - it does not overlap an existing non-cancelled booking for that priest,
 *    with the service buffer applied on both sides
 *  - the priest is under their maximum bookings for that day
 *  - the start is at least `minNoticeHours` in the future
 */

export interface AvailabilityWindow {
  priest_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Blackout {
  priest_id: string;
  start_date: string;
  end_date: string;
}

export interface ExistingBooking {
  priest_id: string | null;
  starts_at: string;
  ends_at: string;
}

export interface PriestLite {
  id: string;
  full_name: string;
  max_bookings_per_day: number;
}

export interface SlotInput {
  /** Local civil date, YYYY-MM-DD, in the temple timezone. */
  date: string;
  timezone: string;
  durationMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  priests: PriestLite[];
  windows: AvailabilityWindow[];
  blackouts: Blackout[];
  bookings: ExistingBooking[];
  now?: Date;
  /** Slot grid granularity in minutes. */
  stepMinutes?: number;
}

export interface Slot {
  /** UTC ISO instant of the slot start. */
  startsAt: string;
  endsAt: string;
  /** Wall-clock label in the temple timezone, e.g. "10:00 AM". */
  label: string;
  priestId: string;
  priestName: string;
}

function minutesOf(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function computeSlots(input: SlotInput): Slot[] {
  const {
    date,
    timezone,
    durationMinutes,
    bufferMinutes,
    minNoticeHours,
    priests,
    windows,
    blackouts,
    bookings,
    now = new Date(),
    stepMinutes = 30,
  } = input;

  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return [];
  const weekday = weekdayOfIsoDate(date);
  const earliest = now.getTime() + minNoticeHours * 3600000;
  const slots: Slot[] = [];

  for (const priest of priests) {
    if (blackouts.some((b) => b.priest_id === priest.id && date >= b.start_date && date <= b.end_date)) {
      continue;
    }

    const priestBookings = bookings.filter((b) => b.priest_id === priest.id);
    const sameDayCount = priestBookings.filter((b) => {
      const local = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(b.starts_at));
      return local === date;
    }).length;
    if (sameDayCount >= priest.max_bookings_per_day) continue;

    for (const window of windows.filter((w) => w.priest_id === priest.id && w.day_of_week === weekday)) {
      const windowStart = minutesOf(window.start_time);
      const windowEnd = minutesOf(window.end_time);
      const needed = durationMinutes + bufferMinutes;

      for (let start = windowStart; start + needed <= windowEnd; start += stepMinutes) {
        const startsAt = zonedTimeToUtc(timezone, y, m, d, Math.floor(start / 60), start % 60);
        if (startsAt.getTime() < earliest) continue;
        const endsAt = new Date(startsAt.getTime() + durationMinutes * 60000);

        const blockedStart = startsAt.getTime() - bufferMinutes * 60000;
        const blockedEnd = endsAt.getTime() + bufferMinutes * 60000;
        const clash = priestBookings.some((b) => {
          const bs = new Date(b.starts_at).getTime();
          const be = new Date(b.ends_at).getTime();
          return bs < blockedEnd && be > blockedStart;
        });
        if (clash) continue;

        slots.push({
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
          label: new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "2-digit",
          }).format(startsAt),
          priestId: priest.id,
          priestName: priest.full_name,
        });
      }
    }
  }

  // One offer per clock time — earliest priest wins, ties broken by name.
  const byTime = new Map<string, Slot>();
  for (const slot of slots.sort((a, b) => a.priestName.localeCompare(b.priestName))) {
    if (!byTime.has(slot.startsAt)) byTime.set(slot.startsAt, slot);
  }
  return [...byTime.values()].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
