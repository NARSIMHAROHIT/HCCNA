//#region node_modules/.nitro/vite/services/ssr/assets/timezone-BD2Gbves.js
/** Timezone helpers built on Intl — no extra dependency, works on the edge runtime. */
/** Offset in minutes (east positive) of `timezone` at the given UTC instant. */
function timezoneOffsetMinutes(timezone, at) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		hour12: false,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	}).formatToParts(at);
	const get = (type) => Number(parts.find((p) => p.type === type)?.value ?? "0");
	return (Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second")) - at.getTime()) / 6e4;
}
/** Convert a wall-clock time in `timezone` to the matching UTC instant. */
function zonedTimeToUtc(timezone, y, m, d, hours = 0, minutes = 0) {
	const naive = Date.UTC(y, m - 1, d, hours, minutes);
	let result = naive - timezoneOffsetMinutes(timezone, new Date(naive)) * 6e4;
	result = naive - timezoneOffsetMinutes(timezone, new Date(result)) * 6e4;
	return new Date(result);
}
function formatInTimezone(at, timezone, options = {
	dateStyle: "medium",
	timeStyle: "short"
}) {
	const date = typeof at === "string" ? new Date(at) : at;
	return new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		...options
	}).format(date);
}
/** Weekday index (0=Sunday) of a civil date string `YYYY-MM-DD`. */
function weekdayOfIsoDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).getUTCDay();
}
function formatMoney(cents, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0
	}).format(cents / 100);
}
//#endregion
export { zonedTimeToUtc as i, formatMoney as n, weekdayOfIsoDate as r, formatInTimezone as t };
