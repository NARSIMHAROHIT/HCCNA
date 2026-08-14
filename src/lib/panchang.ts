/**
 * Panchang (Hindu almanac) engine — location aware, no external service.
 *
 * METHODOLOGY / SOURCES
 * ---------------------
 * - Solar position: Jean Meeus, "Astronomical Algorithms" (2nd ed.), ch. 25
 *   (low-precision geocentric solar longitude, accuracy ~0.01°).
 * - Lunar position: Meeus ch. 47, truncated ELP-2000/82 series (the largest
 *   periodic terms), accuracy ~0.02° in longitude — well inside the precision
 *   needed to resolve a tithi (12° of elongation) or a nakshatra (13°20').
 * - Sunrise / sunset: NOAA Solar Calculator equations with the standard
 *   -0.833° (refraction + solar semi-diameter) altitude for the visible disc.
 * - Sidereal (nirayana) longitudes use the **Lahiri / Chitrapaksha ayanamsa**,
 *   the ayanamsa used by the Indian Calendar Reform Committee and by most
 *   panchangs in India and North America.
 * - Panchang limbs follow the classical definitions:
 *     tithi     = floor(((moon - sun) mod 360) / 12) + 1
 *     nakshatra = floor(sidereal moon / 13°20') + 1
 *     yoga      = floor(((sidereal sun + sidereal moon) mod 360) / 13°20') + 1
 *     karana    = floor(((moon - sun) mod 360) / 6) + 1
 *   All limbs are reported **at local sunrise**, which is the convention used
 *   for determining the religious day (dinamana) in South Indian panchangs.
 * - Rahu Kalam / Yamaganda / Gulika Kalam divide the day from sunrise to
 *   sunset into eight equal parts, selected by weekday per the classical table.
 *
 * Every calculation takes latitude, longitude and IANA timezone as inputs, so
 * the same code serves a temple in Huntsville, Dallas, Atlanta or Chennai.
 */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export const TITHI_NAMES = [
  "Prathama",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
] as const;

export const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const YOGA_NAMES = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shula",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
] as const;

export const KARANA_NAMES = [
  "Bava",
  "Balava",
  "Kaulava",
  "Taitila",
  "Gara",
  "Vanija",
  "Vishti",
] as const;

export const WEEKDAY_NAMES = [
  "Ravivara (Sunday)",
  "Somavara (Monday)",
  "Mangalavara (Tuesday)",
  "Budhavara (Wednesday)",
  "Guruvara (Thursday)",
  "Shukravara (Friday)",
  "Shanivara (Saturday)",
] as const;

export const MASA_NAMES = [
  "Chaitra",
  "Vaishakha",
  "Jyeshtha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashwina",
  "Kartika",
  "Margashirsha",
  "Pausha",
  "Magha",
  "Phalguna",
] as const;

function norm360(x: number): number {
  const v = x % 360;
  return v < 0 ? v + 360 : v;
}

/** Julian Day from a UTC instant. */
export function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Julian centuries since J2000.0. */
function centuries(jd: number): number {
  return (jd - 2451545.0) / 36525;
}

/** Apparent geocentric solar longitude in degrees (Meeus ch. 25). */
export function sunLongitude(jd: number): number {
  const t = centuries(jd);
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const mr = norm360(m) * RAD;
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(mr) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * mr) +
    0.000289 * Math.sin(3 * mr);
  const trueLong = l0 + c;
  const omega = 125.04 - 1934.136 * t;
  return norm360(trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD));
}

/** Apparent geocentric lunar longitude in degrees (truncated ELP, Meeus ch. 47). */
export function moonLongitude(jd: number): number {
  const t = centuries(jd);
  const lp = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t;
  const d = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t;
  const m = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t;
  const mp = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t;
  const f = 93.272095 + 483202.0175233 * t - 0.0036539 * t * t;

  const D = norm360(d) * RAD;
  const M = norm360(m) * RAD;
  const MP = norm360(mp) * RAD;
  const F = norm360(f) * RAD;

  const sum =
    6.288774 * Math.sin(MP) +
    1.274027 * Math.sin(2 * D - MP) +
    0.658314 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * MP) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F) +
    0.058793 * Math.sin(2 * D - 2 * MP) +
    0.057066 * Math.sin(2 * D - M - MP) +
    0.05332 * Math.sin(2 * D + MP) +
    0.045758 * Math.sin(2 * D - M) -
    0.040923 * Math.sin(M - MP) -
    0.034720 * Math.sin(D) -
    0.030383 * Math.sin(M + MP) +
    0.015327 * Math.sin(2 * D - 2 * F) -
    0.012528 * Math.sin(MP + 2 * F) +
    0.010980 * Math.sin(MP - 2 * F) +
    0.010675 * Math.sin(4 * D - MP) +
    0.010034 * Math.sin(3 * MP) +
    0.008548 * Math.sin(4 * D - 2 * MP) -
    0.007888 * Math.sin(2 * D + M - MP) -
    0.006766 * Math.sin(2 * D + M) -
    0.005163 * Math.sin(D - MP) +
    0.004987 * Math.sin(D + M) +
    0.004036 * Math.sin(2 * D - M + MP) +
    0.003994 * Math.sin(2 * D + 2 * MP) +
    0.003861 * Math.sin(4 * D) +
    0.003665 * Math.sin(2 * D - 3 * MP);

  return norm360(lp + sum);
}

/**
 * Lahiri (Chitrapaksha) ayanamsa in degrees — linear fit accurate to ~0.01°
 * across the 20th–21st centuries (23°51'11" at J2000, precessing ~50.29"/yr).
 */
export function ayanamsa(jd: number): number {
  const years = (jd - 2451545.0) / 365.25;
  return 23.85337 + years * 0.0139697;
}

export interface SunTimes {
  /** UTC instant of sunrise, or null on days without one at this latitude. */
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date;
}

/** NOAA sunrise/sunset for the civil date `ymd` at the given coordinates. */
export function sunTimes(ymd: { y: number; m: number; d: number }, lat: number, lon: number): SunTimes {
  const jdMidnight = Date.UTC(ymd.y, ymd.m - 1, ymd.d) / 86400000 + 2440587.5;
  const t = centuries(jdMidnight);

  const geomMeanLong = norm360(280.46646 + t * (36000.76983 + t * 0.0003032));
  const geomMeanAnom = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const eccent = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const anomR = geomMeanAnom * RAD;
  const eqOfCtr =
    Math.sin(anomR) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * anomR) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * anomR) * 0.000289;
  const trueLong = geomMeanLong + eqOfCtr;
  const appLong = trueLong - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * t) * RAD);
  const meanObliq =
    23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const obliq = meanObliq + 0.00256 * Math.cos((125.04 - 1934.136 * t) * RAD);
  const declin =
    Math.asin(Math.sin(obliq * RAD) * Math.sin(appLong * RAD)) * DEG;

  const varY = Math.tan((obliq / 2) * RAD) ** 2;
  const eqTime =
    4 *
    DEG *
    (varY * Math.sin(2 * geomMeanLong * RAD) -
      2 * eccent * Math.sin(anomR) +
      4 * eccent * varY * Math.sin(anomR) * Math.cos(2 * geomMeanLong * RAD) -
      0.5 * varY * varY * Math.sin(4 * geomMeanLong * RAD) -
      1.25 * eccent * eccent * Math.sin(2 * anomR));

  const zenith = 90.833;
  const cosH =
    (Math.cos(zenith * RAD) - Math.sin(lat * RAD) * Math.sin(declin * RAD)) /
    (Math.cos(lat * RAD) * Math.cos(declin * RAD));

  const noonMinutes = 720 - 4 * lon - eqTime;
  const dayStart = Date.UTC(ymd.y, ymd.m - 1, ymd.d);
  const solarNoon = new Date(dayStart + noonMinutes * 60000);

  if (cosH > 1 || cosH < -1) {
    return { sunrise: null, sunset: null, solarNoon };
  }
  const ha = Math.acos(cosH) * DEG;
  return {
    sunrise: new Date(dayStart + (noonMinutes - ha * 4) * 60000),
    sunset: new Date(dayStart + (noonMinutes + ha * 4) * 60000),
    solarNoon,
  };
}

/** Segment index (1-8 of the daylight span) for each inauspicious period. */
const RAHU_SEGMENT = [8, 2, 7, 5, 6, 4, 3];
const YAMAGANDA_SEGMENT = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_SEGMENT = [7, 6, 5, 4, 3, 2, 1];

export interface Period {
  start: Date;
  end: Date;
}

function segment(sunrise: Date, sunset: Date, index: number): Period {
  const part = (sunset.getTime() - sunrise.getTime()) / 8;
  return {
    start: new Date(sunrise.getTime() + part * (index - 1)),
    end: new Date(sunrise.getTime() + part * index),
  };
}

export interface Panchang {
  /** Civil date in the temple's timezone, as y/m/d. */
  date: { y: number; m: number; d: number };
  weekday: number;
  weekdayName: string;
  sunrise: Date | null;
  sunset: Date | null;
  tithiIndex: number;
  tithiName: string;
  paksha: "Shukla" | "Krishna";
  nakshatraName: string;
  nakshatraIndex: number;
  yogaName: string;
  karanaName: string;
  masaName: string;
  moonPhasePercent: number;
  rahuKalam: Period | null;
  yamaganda: Period | null;
  gulika: Period | null;
  observances: string[];
}

function tithiLabel(index0: number): { name: string; paksha: "Shukla" | "Krishna" } {
  const paksha: "Shukla" | "Krishna" = index0 < 15 ? "Shukla" : "Krishna";
  const within = index0 % 15;
  if (within === 14) {
    return { name: paksha === "Shukla" ? "Purnima" : "Amavasya", paksha };
  }
  return { name: TITHI_NAMES[within] ?? "Prathama", paksha };
}

function observancesFor(tithiName: string, weekday: number, nakshatra: string): string[] {
  const out: string[] = [];
  if (tithiName === "Ekadashi") out.push("Ekadashi — fasting observance");
  if (tithiName === "Purnima") out.push("Purnima — full moon, Satyanarayana Vratam");
  if (tithiName === "Amavasya") out.push("Amavasya — new moon, ancestral offerings");
  if (tithiName === "Chaturthi") out.push("Chaturthi — Ganesha worship");
  if (tithiName === "Ashtami") out.push("Ashtami — Devi worship");
  if (tithiName === "Trayodashi") out.push("Pradosham — evening Shiva worship");
  if (weekday === 6) out.push("Shanivara — Hanuman worship");
  if (weekday === 5) out.push("Shukravara — Lakshmi worship");
  if (weekday === 1) out.push("Somavara — Shiva abhishekam");
  if (nakshatra === "Shravana") out.push("Shravana nakshatra — auspicious for Vishnu worship");
  return out;
}

/**
 * Compute the panchang for a civil date at a location.
 * `ymd` is the local civil date in the temple's timezone.
 */
export function computePanchang(
  ymd: { y: number; m: number; d: number },
  lat: number,
  lon: number,
): Panchang {
  const times = sunTimes(ymd, lat, lon);
  const reference = times.sunrise ?? times.solarNoon;
  const jd = toJulianDay(reference);

  const sun = sunLongitude(jd);
  const moon = moonLongitude(jd);
  const ay = ayanamsa(jd);
  const sunSid = norm360(sun - ay);
  const moonSid = norm360(moon - ay);

  const elongation = norm360(moon - sun);
  const tithiIndex0 = Math.floor(elongation / 12);
  const { name: tithiName, paksha } = tithiLabel(tithiIndex0);

  const nakIndex = Math.floor(moonSid / (360 / 27));
  const yogaIndex = Math.floor(norm360(sunSid + moonSid) / (360 / 27));
  const karanaSeq = Math.floor(elongation / 6);
  const karanaName =
    karanaSeq === 0
      ? "Kimstughna"
      : karanaSeq >= 57
        ? ["Shakuni", "Chatushpada", "Naga"][karanaSeq - 57] ?? "Naga"
        : KARANA_NAMES[(karanaSeq - 1) % 7]!;

  // Lunar month (amanta): named after the solar sign the sun occupies at the
  // new moon that begins the month; approximated from the sidereal sun.
  const masaName = MASA_NAMES[Math.floor(norm360(sunSid + 30) / 30) % 12]!;

  const weekday = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d)).getUTCDay();

  return {
    date: ymd,
    weekday,
    weekdayName: WEEKDAY_NAMES[weekday]!,
    sunrise: times.sunrise,
    sunset: times.sunset,
    tithiIndex: tithiIndex0 + 1,
    tithiName,
    paksha,
    nakshatraName: NAKSHATRA_NAMES[nakIndex % 27]!,
    nakshatraIndex: nakIndex + 1,
    yogaName: YOGA_NAMES[yogaIndex % 27]!,
    karanaName,
    masaName,
    moonPhasePercent: Math.round((1 - Math.cos(elongation * RAD)) * 50),
    rahuKalam:
      times.sunrise && times.sunset
        ? segment(times.sunrise, times.sunset, RAHU_SEGMENT[weekday]!)
        : null,
    yamaganda:
      times.sunrise && times.sunset
        ? segment(times.sunrise, times.sunset, YAMAGANDA_SEGMENT[weekday]!)
        : null,
    gulika:
      times.sunrise && times.sunset
        ? segment(times.sunrise, times.sunset, GULIKA_SEGMENT[weekday]!)
        : null,
    observances: observancesFor(tithiName, weekday, NAKSHATRA_NAMES[nakIndex % 27]!),
  };
}

/** Panchang for every day of a civil month at a location. */
export function computeMonth(
  year: number,
  month: number,
  lat: number,
  lon: number,
): Panchang[] {
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const out: Panchang[] = [];
  for (let d = 1; d <= days; d++) {
    out.push(computePanchang({ y: year, m: month, d }, lat, lon));
  }
  return out;
}

/** Civil y/m/d of "today" in a given IANA timezone. */
export function todayInTimezone(timezone: string, now = new Date()): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [y, m, d] = parts.split("-").map(Number);
  return { y: y!, m: m!, d: d! };
}

/** Format a UTC instant as a local clock time in the temple's timezone. */
export function formatTime(date: Date | null, timezone: string): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatPeriod(period: Period | null, timezone: string): string {
  if (!period) return "—";
  return `${formatTime(period.start, timezone)} – ${formatTime(period.end, timezone)}`;
}
