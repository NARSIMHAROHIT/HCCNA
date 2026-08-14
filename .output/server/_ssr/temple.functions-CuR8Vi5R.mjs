import { n as createServerFn } from "./server-ClbIPfyi.mjs";
import { i as objectType, o as stringType, r as numberType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-BbYHarZ6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/temple.functions-CuR8Vi5R.js
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
var RAD = Math.PI / 180;
var DEG = 180 / Math.PI;
var TITHI_NAMES = [
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
	"Chaturdashi"
];
var NAKSHATRA_NAMES = [
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
	"Revati"
];
var YOGA_NAMES = [
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
	"Vaidhriti"
];
var KARANA_NAMES = [
	"Bava",
	"Balava",
	"Kaulava",
	"Taitila",
	"Gara",
	"Vanija",
	"Vishti"
];
var WEEKDAY_NAMES = [
	"Ravivara (Sunday)",
	"Somavara (Monday)",
	"Mangalavara (Tuesday)",
	"Budhavara (Wednesday)",
	"Guruvara (Thursday)",
	"Shukravara (Friday)",
	"Shanivara (Saturday)"
];
var MASA_NAMES = [
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
	"Phalguna"
];
function norm360(x) {
	const v = x % 360;
	return v < 0 ? v + 360 : v;
}
/** Julian Day from a UTC instant. */
function toJulianDay(date) {
	return date.getTime() / 864e5 + 2440587.5;
}
/** Julian centuries since J2000.0. */
function centuries(jd) {
	return (jd - 2451545) / 36525;
}
/** Apparent geocentric solar longitude in degrees (Meeus ch. 25). */
function sunLongitude(jd) {
	const t = centuries(jd);
	const l0 = 280.46646 + 36000.76983 * t + 3032e-7 * t * t;
	const mr = norm360(357.52911 + 35999.05029 * t - 1537e-7 * t * t) * RAD;
	const trueLong = l0 + ((1.914602 - .004817 * t - 14e-6 * t * t) * Math.sin(mr) + (.019993 - 101e-6 * t) * Math.sin(2 * mr) + 289e-6 * Math.sin(3 * mr));
	const omega = 125.04 - 1934.136 * t;
	return norm360(trueLong - .00569 - .00478 * Math.sin(omega * RAD));
}
/** Apparent geocentric lunar longitude in degrees (truncated ELP, Meeus ch. 47). */
function moonLongitude(jd) {
	const t = centuries(jd);
	const lp = 218.3164477 + 481267.88123421 * t - .0015786 * t * t;
	const d = 297.8501921 + 445267.1114034 * t - .0018819 * t * t;
	const m = 357.5291092 + 35999.0502909 * t - 1536e-7 * t * t;
	const mp = 134.9633964 + 477198.8675055 * t + .0087414 * t * t;
	const f = 93.272095 + 483202.0175233 * t - .0036539 * t * t;
	const D = norm360(d) * RAD;
	const M = norm360(m) * RAD;
	const MP = norm360(mp) * RAD;
	const F = norm360(f) * RAD;
	return norm360(lp + (6.288774 * Math.sin(MP) + 1.274027 * Math.sin(2 * D - MP) + .658314 * Math.sin(2 * D) + .213618 * Math.sin(2 * MP) - .185116 * Math.sin(M) - .114332 * Math.sin(2 * F) + .058793 * Math.sin(2 * D - 2 * MP) + .057066 * Math.sin(2 * D - M - MP) + .05332 * Math.sin(2 * D + MP) + .045758 * Math.sin(2 * D - M) - .040923 * Math.sin(M - MP) - .03472 * Math.sin(D) - .030383 * Math.sin(M + MP) + .015327 * Math.sin(2 * D - 2 * F) - .012528 * Math.sin(MP + 2 * F) + .01098 * Math.sin(MP - 2 * F) + .010675 * Math.sin(4 * D - MP) + .010034 * Math.sin(3 * MP) + .008548 * Math.sin(4 * D - 2 * MP) - .007888 * Math.sin(2 * D + M - MP) - .006766 * Math.sin(2 * D + M) - .005163 * Math.sin(D - MP) + .004987 * Math.sin(D + M) + .004036 * Math.sin(2 * D - M + MP) + .003994 * Math.sin(2 * D + 2 * MP) + .003861 * Math.sin(4 * D) + .003665 * Math.sin(2 * D - 3 * MP)));
}
/**
* Lahiri (Chitrapaksha) ayanamsa in degrees — linear fit accurate to ~0.01°
* across the 20th–21st centuries (23°51'11" at J2000, precessing ~50.29"/yr).
*/
function ayanamsa(jd) {
	return 23.85337 + (jd - 2451545) / 365.25 * .0139697;
}
/** NOAA sunrise/sunset for the civil date `ymd` at the given coordinates. */
function sunTimes(ymd, lat, lon) {
	const t = centuries(Date.UTC(ymd.y, ymd.m - 1, ymd.d) / 864e5 + 2440587.5);
	const geomMeanLong = norm360(280.46646 + t * (36000.76983 + t * 3032e-7));
	const geomMeanAnom = 357.52911 + t * (35999.05029 - 1537e-7 * t);
	const eccent = .016708634 - t * (42037e-9 + 1.267e-7 * t);
	const anomR = geomMeanAnom * RAD;
	const appLong = geomMeanLong + (Math.sin(anomR) * (1.914602 - t * (.004817 + 14e-6 * t)) + Math.sin(2 * anomR) * (.019993 - 101e-6 * t) + Math.sin(3 * anomR) * 289e-6) - .00569 - .00478 * Math.sin((125.04 - 1934.136 * t) * RAD);
	const obliq = 23 + (26 + (21.448 - t * (46.815 + t * (59e-5 - t * .001813))) / 60) / 60 + .00256 * Math.cos((125.04 - 1934.136 * t) * RAD);
	const declin = Math.asin(Math.sin(obliq * RAD) * Math.sin(appLong * RAD)) * DEG;
	const varY = Math.tan(obliq / 2 * RAD) ** 2;
	const eqTime = 4 * DEG * (varY * Math.sin(2 * geomMeanLong * RAD) - 2 * eccent * Math.sin(anomR) + 4 * eccent * varY * Math.sin(anomR) * Math.cos(2 * geomMeanLong * RAD) - .5 * varY * varY * Math.sin(4 * geomMeanLong * RAD) - 1.25 * eccent * eccent * Math.sin(2 * anomR));
	const cosH = (Math.cos(90.833 * RAD) - Math.sin(lat * RAD) * Math.sin(declin * RAD)) / (Math.cos(lat * RAD) * Math.cos(declin * RAD));
	const noonMinutes = 720 - 4 * lon - eqTime;
	const dayStart = Date.UTC(ymd.y, ymd.m - 1, ymd.d);
	const solarNoon = new Date(dayStart + noonMinutes * 6e4);
	if (cosH > 1 || cosH < -1) return {
		sunrise: null,
		sunset: null,
		solarNoon
	};
	const ha = Math.acos(cosH) * DEG;
	return {
		sunrise: new Date(dayStart + (noonMinutes - ha * 4) * 6e4),
		sunset: new Date(dayStart + (noonMinutes + ha * 4) * 6e4),
		solarNoon
	};
}
/** Segment index (1-8 of the daylight span) for each inauspicious period. */
var RAHU_SEGMENT = [
	8,
	2,
	7,
	5,
	6,
	4,
	3
];
var YAMAGANDA_SEGMENT = [
	5,
	4,
	3,
	2,
	1,
	7,
	6
];
var GULIKA_SEGMENT = [
	7,
	6,
	5,
	4,
	3,
	2,
	1
];
function segment(sunrise, sunset, index) {
	const part = (sunset.getTime() - sunrise.getTime()) / 8;
	return {
		start: new Date(sunrise.getTime() + part * (index - 1)),
		end: new Date(sunrise.getTime() + part * index)
	};
}
function tithiLabel(index0) {
	const paksha = index0 < 15 ? "Shukla" : "Krishna";
	const within = index0 % 15;
	if (within === 14) return {
		name: paksha === "Shukla" ? "Purnima" : "Amavasya",
		paksha
	};
	return {
		name: TITHI_NAMES[within] ?? "Prathama",
		paksha
	};
}
function observancesFor(tithiName, weekday, nakshatra) {
	const out = [];
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
function computePanchang(ymd, lat, lon) {
	const times = sunTimes(ymd, lat, lon);
	const jd = toJulianDay(times.sunrise ?? times.solarNoon);
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
	const karanaName = karanaSeq === 0 ? "Kimstughna" : karanaSeq >= 57 ? [
		"Shakuni",
		"Chatushpada",
		"Naga"
	][karanaSeq - 57] ?? "Naga" : KARANA_NAMES[(karanaSeq - 1) % 7];
	const masaName = MASA_NAMES[Math.floor(norm360(sunSid + 30) / 30) % 12];
	const weekday = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d)).getUTCDay();
	return {
		date: ymd,
		weekday,
		weekdayName: WEEKDAY_NAMES[weekday],
		sunrise: times.sunrise,
		sunset: times.sunset,
		tithiIndex: tithiIndex0 + 1,
		tithiName,
		paksha,
		nakshatraName: NAKSHATRA_NAMES[nakIndex % 27],
		nakshatraIndex: nakIndex + 1,
		yogaName: YOGA_NAMES[yogaIndex % 27],
		karanaName,
		masaName,
		moonPhasePercent: Math.round((1 - Math.cos(elongation * RAD)) * 50),
		rahuKalam: times.sunrise && times.sunset ? segment(times.sunrise, times.sunset, RAHU_SEGMENT[weekday]) : null,
		yamaganda: times.sunrise && times.sunset ? segment(times.sunrise, times.sunset, YAMAGANDA_SEGMENT[weekday]) : null,
		gulika: times.sunrise && times.sunset ? segment(times.sunrise, times.sunset, GULIKA_SEGMENT[weekday]) : null,
		observances: observancesFor(tithiName, weekday, NAKSHATRA_NAMES[nakIndex % 27])
	};
}
/** Panchang for every day of a civil month at a location. */
function computeMonth(year, month, lat, lon) {
	const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
	const out = [];
	for (let d = 1; d <= days; d++) out.push(computePanchang({
		y: year,
		m: month,
		d
	}, lat, lon));
	return out;
}
/** Civil y/m/d of "today" in a given IANA timezone. */
function todayInTimezone(timezone, now = /* @__PURE__ */ new Date()) {
	const [y, m, d] = new Intl.DateTimeFormat("en-CA", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now).split("-").map(Number);
	return {
		y,
		m,
		d
	};
}
/** Format a UTC instant as a local clock time in the temple's timezone. */
function formatTime(date, timezone) {
	if (!date) return "—";
	return new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}
function formatPeriod(period, timezone) {
	if (!period) return "—";
	return `${formatTime(period.start, timezone)} – ${formatTime(period.end, timezone)}`;
}
/**
* Public content API. Every read is scoped to the temple configured for this
* deployment (TEMPLE_SLUG), so the same codebase serves any temple.
*/
var getSiteData_createServerFn_handler = createServerRpc({
	id: "72d8957e8d6790aa0bcd06f5285d49a32dd6fca2ccb1d1f33fa73c33a9390c90",
	name: "getSiteData",
	filename: "src/lib/temple.functions.ts"
}, (opts) => getSiteData.__executeServer(opts));
var getSiteData = createServerFn({ method: "GET" }).handler(getSiteData_createServerFn_handler, async () => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = createPublicServerClient();
	const { data: temple, error } = await supabase.from("temples").select("*").eq("slug", activeTempleSlug()).maybeSingle();
	if (error) throw new Error(error.message);
	if (!temple) throw new Error("No temple is configured for this deployment.");
	const [deities, schedules, announcements, events, services, priests, categories, annual, photos] = await Promise.all([
		supabase.from("deities").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("temple_schedules").select("*").eq("temple_id", temple.id),
		supabase.from("announcements").select("*").eq("temple_id", temple.id).order("created_at", { ascending: false }).limit(5),
		supabase.from("events").select("*").eq("temple_id", temple.id).gte("starts_at", (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString()).order("starts_at").limit(20),
		supabase.from("services").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("priests").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("service_categories").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("events").select("*").eq("temple_id", temple.id).eq("is_annual", true).order("starts_at"),
		supabase.from("event_photos").select("*").eq("temple_id", temple.id).order("year", { ascending: false }).order("display_order").limit(60)
	]);
	return {
		temple,
		deities: deities.data ?? [],
		schedules: schedules.data ?? [],
		announcements: announcements.data ?? [],
		events: events.data ?? [],
		services: services.data ?? [],
		priests: priests.data ?? [],
		categories: categories.data ?? [],
		annualEvents: annual.data ?? [],
		eventPhotos: photos.data ?? []
	};
});
var getServiceBySlug_createServerFn_handler = createServerRpc({
	id: "f5bb228111b3dc986131eba8cf88cebb61b23aaa5a7d002240452e9743de7d4a",
	name: "getServiceBySlug",
	filename: "src/lib/temple.functions.ts"
}, (opts) => getServiceBySlug.__executeServer(opts));
var getServiceBySlug = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1) }).parse(input)).handler(getServiceBySlug_createServerFn_handler, async ({ data }) => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = createPublicServerClient();
	const { data: temple } = await supabase.from("temples").select("id, name, timezone, currency, phone, email, latitude, longitude").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: service } = await supabase.from("services").select("*, service_categories(name, slug)").eq("temple_id", temple.id).eq("slug", data.slug).maybeSingle();
	if (!service) return null;
	const [{ data: links }, { data: deities }] = await Promise.all([supabase.from("priest_services").select("priest_id, priests(id, full_name, title, photo_url, languages, specializations)").eq("service_id", service.id), supabase.from("deities").select("*").eq("temple_id", temple.id).order("display_order")]);
	const haystack = `${service.name} ${service.short_description ?? ""} ${service.description ?? ""}`.toLowerCase();
	const relatedDeities = (deities ?? []).filter((d) => d.image_url && haystack.includes(d.name.toLowerCase()));
	return {
		temple,
		service,
		priests: (links ?? []).map((l) => l.priests).filter(Boolean),
		deities: relatedDeities
	};
});
var getEventBySlug_createServerFn_handler = createServerRpc({
	id: "5cb16491917ea8b575f71b091116354822abf5deb496dc36b4d6c8f381532695",
	name: "getEventBySlug",
	filename: "src/lib/temple.functions.ts"
}, (opts) => getEventBySlug.__executeServer(opts));
var getEventBySlug = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1) }).parse(input)).handler(getEventBySlug_createServerFn_handler, async ({ data }) => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = createPublicServerClient();
	const { data: temple } = await supabase.from("temples").select("id, name, timezone, currency, city, state").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data: event } = await supabase.from("events").select("*, priests(full_name, title)").eq("temple_id", temple.id).eq("slug", data.slug).maybeSingle();
	if (!event) return null;
	const [items, photos] = await Promise.all([supabase.from("event_items").select("*").eq("event_id", event.id).order("display_order"), supabase.from("event_photos").select("*").eq("event_id", event.id).order("display_order")]);
	return {
		temple,
		event,
		items: items.data ?? [],
		photos: photos.data ?? []
	};
});
var getBooks_createServerFn_handler = createServerRpc({
	id: "8d90df718b6b950670a8fae00bb6889afb9043ac31a934f466dfa4b6c4218f3c",
	name: "getBooks",
	filename: "src/lib/temple.functions.ts"
}, (opts) => getBooks.__executeServer(opts));
var getBooks = createServerFn({ method: "GET" }).handler(getBooks_createServerFn_handler, async () => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = createPublicServerClient();
	const { data: temple } = await supabase.from("temples").select("id, name").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const { data } = await supabase.from("books").select("*").eq("temple_id", temple.id).order("display_order");
	return {
		temple,
		books: data ?? []
	};
});
var getPriestDirectory_createServerFn_handler = createServerRpc({
	id: "689f0deed877e52244f2a47094664945725467a3a3495a8f6eda091e3e100c25",
	name: "getPriestDirectory",
	filename: "src/lib/temple.functions.ts"
}, (opts) => getPriestDirectory.__executeServer(opts));
var getPriestDirectory = createServerFn({ method: "GET" }).handler(getPriestDirectory_createServerFn_handler, async () => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const supabase = createPublicServerClient();
	const { data: temple } = await supabase.from("temples").select("id, name, timezone").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const [priests, windows, links, services] = await Promise.all([
		supabase.from("priests").select("*").eq("temple_id", temple.id).order("display_order"),
		supabase.from("priest_availability").select("*"),
		supabase.from("priest_services").select("*"),
		supabase.from("services").select("id, name, slug").eq("temple_id", temple.id)
	]);
	return {
		temple,
		priests: priests.data ?? [],
		windows: windows.data ?? [],
		links: links.data ?? [],
		services: services.data ?? []
	};
});
var getPanchang_createServerFn_handler = createServerRpc({
	id: "ba60d7b579517ba9bda7d09d68fa419818a13ab41cce633bd3d7424fce172fba",
	name: "getPanchang",
	filename: "src/lib/temple.functions.ts"
}, (opts) => getPanchang.__executeServer(opts));
var getPanchang = createServerFn({ method: "GET" }).inputValidator((input) => objectType({
	year: numberType().int().optional(),
	month: numberType().int().min(1).max(12).optional()
}).parse(input ?? {})).handler(getPanchang_createServerFn_handler, async ({ data }) => {
	const { createPublicServerClient, activeTempleSlug } = await import("./supabase-public.server-Bswr2KGX.mjs");
	const { data: temple } = await createPublicServerClient().from("temples").select("id, name, city, state, latitude, longitude, timezone").eq("slug", activeTempleSlug()).maybeSingle();
	if (!temple) throw new Error("Temple not configured");
	const tz = temple.timezone;
	const today = todayInTimezone(tz);
	const year = data.year ?? today.y;
	const month = data.month ?? today.m;
	const shape = (p) => ({
		date: `${p.date.y}-${String(p.date.m).padStart(2, "0")}-${String(p.date.d).padStart(2, "0")}`,
		day: p.date.d,
		weekday: p.weekday,
		weekdayName: p.weekdayName,
		sunrise: formatTime(p.sunrise, tz),
		sunset: formatTime(p.sunset, tz),
		tithiName: p.tithiName,
		paksha: p.paksha,
		nakshatraName: p.nakshatraName,
		yogaName: p.yogaName,
		karanaName: p.karanaName,
		masaName: p.masaName,
		moonPhasePercent: p.moonPhasePercent,
		rahuKalam: formatPeriod(p.rahuKalam, tz),
		yamaganda: formatPeriod(p.yamaganda, tz),
		gulika: formatPeriod(p.gulika, tz),
		observances: p.observances
	});
	return {
		location: {
			label: [temple.city, temple.state].filter(Boolean).join(", "),
			latitude: temple.latitude,
			longitude: temple.longitude,
			timezone: tz
		},
		year,
		month,
		today: shape(computePanchang(today, temple.latitude, temple.longitude)),
		days: computeMonth(year, month, temple.latitude, temple.longitude).map(shape)
	};
});
//#endregion
export { getBooks_createServerFn_handler, getEventBySlug_createServerFn_handler, getPanchang_createServerFn_handler, getPriestDirectory_createServerFn_handler, getServiceBySlug_createServerFn_handler, getSiteData_createServerFn_handler };
