/** Timezone helpers built on Intl — no extra dependency, works on the edge runtime. */

/** Offset in minutes (east positive) of `timezone` at the given UTC instant. */
export function timezoneOffsetMinutes(timezone: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(at);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second"),
  );
  return (asUtc - at.getTime()) / 60000;
}

/** Convert a wall-clock time in `timezone` to the matching UTC instant. */
export function zonedTimeToUtc(
  timezone: string,
  y: number,
  m: number,
  d: number,
  hours = 0,
  minutes = 0,
): Date {
  const naive = Date.UTC(y, m - 1, d, hours, minutes);
  let result = naive - timezoneOffsetMinutes(timezone, new Date(naive)) * 60000;
  // One refinement pass handles DST transition boundaries.
  result = naive - timezoneOffsetMinutes(timezone, new Date(result)) * 60000;
  return new Date(result);
}

/** Civil y/m/d/weekday of a UTC instant inside `timezone`. */
export function zonedParts(timezone: string, at: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    weekday: weekdayMap[get("weekday")] ?? 0,
  };
}

export function formatInTimezone(
  at: Date | string,
  timezone: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
): string {
  const date = typeof at === "string" ? new Date(at) : at;
  return new Intl.DateTimeFormat("en-US", { timeZone: timezone, ...options }).format(date);
}

/** Weekday index (0=Sunday) of a civil date string `YYYY-MM-DD`. */
export function weekdayOfIsoDate(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1)).getUTCDay();
}

export function isoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
