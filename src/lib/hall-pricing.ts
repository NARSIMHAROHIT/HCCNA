/**
 * Pure hall pricing. Shared by the booking form (live estimate) and the server
 * (the price that is actually charged), so a devotee never sees one number and
 * is billed another.
 */

export interface HallRates {
  hourly_rate_cents: number;
  half_day_rate_cents: number;
  full_day_rate_cents: number;
  cleaning_fee_cents: number;
  deposit_cents: number;
  min_hours: number;
  max_hours: number;
}

export type RateBasis = "hourly" | "half_day" | "full_day";

export interface HallQuote {
  basis: RateBasis;
  hours: number;
  rentalCents: number;
  cleaningFeeCents: number;
  depositCents: number;
  /** Rental + cleaning. The deposit is refundable and quoted separately. */
  totalCents: number;
  /** Due now to hold the date. */
  dueNowCents: number;
}

/** A half day covers up to 5 hours; a full day covers up to 12. */
export const HALF_DAY_HOURS = 5;
export const FULL_DAY_HOURS = 12;

/**
 * Picks whichever basis is cheapest for the requested duration, so booking six
 * hours never costs more than booking the whole day.
 */
export function quoteHall(rates: HallRates, hours: number): HallQuote {
  const safeHours = Math.max(0, hours);

  const options: { basis: RateBasis; cents: number }[] = [];
  if (rates.hourly_rate_cents > 0) {
    options.push({ basis: "hourly", cents: rates.hourly_rate_cents * Math.ceil(safeHours) });
  }
  if (rates.half_day_rate_cents > 0 && safeHours <= HALF_DAY_HOURS) {
    options.push({ basis: "half_day", cents: rates.half_day_rate_cents });
  }
  if (rates.full_day_rate_cents > 0 && safeHours <= FULL_DAY_HOURS) {
    options.push({ basis: "full_day", cents: rates.full_day_rate_cents });
  }

  const cheapest = options.sort((a, b) => a.cents - b.cents)[0] ?? {
    basis: "hourly" as RateBasis,
    cents: 0,
  };

  const rentalCents = cheapest.cents;
  const cleaningFeeCents = rates.cleaning_fee_cents;
  const depositCents = rates.deposit_cents;

  return {
    basis: cheapest.basis,
    hours: safeHours,
    rentalCents,
    cleaningFeeCents,
    depositCents,
    totalCents: rentalCents + cleaningFeeCents,
    dueNowCents: depositCents > 0 ? depositCents : rentalCents + cleaningFeeCents,
  };
}

export function basisLabel(basis: RateBasis): string {
  if (basis === "half_day") return "Half-day rate";
  if (basis === "full_day") return "Full-day rate";
  return "Hourly rate";
}

export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
