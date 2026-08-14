import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { m as siteQuery } from "./queries-CH7ElXGN.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, p as Section, r as EmptyState } from "./router-FwX4_uf4.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timings-CV50zhpG.js
var import_jsx_runtime = require_jsx_runtime();
var DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
function formatClock(value) {
	if (!value) return "—";
	const [h, m] = value.split(":").map(Number);
	const hour = h ?? 0;
	const suffix = hour >= 12 ? "PM" : "AM";
	return `${hour % 12 === 0 ? 12 : hour % 12}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
}
function Timings() {
	const { data } = useSuspenseQuery(siteQuery);
	const weekly = data.schedules.filter((s) => s.day_of_week !== null);
	const special = data.schedules.filter((s) => s.special_date !== null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Darshan",
			title: "Temple timings",
			description: "The sanctum is open for darshan during the hours below. Timings may shift on festival days — check the events page."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: weekly.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Timings are being updated",
			description: "Please call the temple office."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: DAYS.map((day, index) => {
				const rows = weekly.filter((s) => s.day_of_week === index).sort((a, b) => (a.opens_at ?? "").localeCompare(b.opens_at ?? ""));
				if (rows.length === 0) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg",
							children: day
						}), rows.every((r) => r.is_closed) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: "Closed"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-3",
						children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-4 border-b border-border/70 py-2 last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
								className: "text-sm",
								children: [r.label, r.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: r.note
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "whitespace-nowrap text-sm font-semibold",
								children: r.is_closed ? "Closed" : `${formatClock(r.opens_at)} – ${formatClock(r.closes_at)}`
							})]
						}, r.id))
					})]
				}, day);
			})
		}) }),
		special.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			tone: "muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-6 text-2xl",
				children: "Special day timings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "surface-panel divide-y divide-border/70 p-5",
				children: special.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: s.special_date
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-nowrap text-sm font-semibold",
						children: s.is_closed ? "Closed" : `${formatClock(s.opens_at)} – ${formatClock(s.closes_at)}`
					})]
				}, s.id))
			})]
		}) : null
	] });
}
//#endregion
export { Timings as component };
