import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as priestsQuery } from "./queries-CH7ElXGN.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, p as Section, r as EmptyState, t as Button } from "./router-FwX4_uf4.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as PriestCard } from "./cards-TlQ8mL-q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/priests-BS9q0dl2.js
var import_jsx_runtime = require_jsx_runtime();
var DAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function Priests() {
	const { data } = useSuspenseQuery(priestsQuery);
	const active = data.priests.filter((p) => p.is_active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Purohits",
			title: "Our priests",
			description: "Our priests are trained in Agama and Vedic traditions and serve devotees at the temple and in their homes."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Priest profiles coming soon" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 md:grid-cols-2 lg:grid-cols-3",
			children: active.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriestCard, { priest: p }, p.id))
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			tone: "muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-6 text-2xl",
					children: "Weekly availability"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: active.map((p) => {
						const windows = data.windows.filter((w) => w.priest_id === p.id).sort((a, b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time));
						const serviceIds = data.links.filter((l) => l.priest_id === p.id).map((l) => l.service_id);
						const services = data.services.filter((s) => serviceIds.includes(s.id));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "surface-panel p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg",
									children: p.full_name
								}),
								windows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-1.5 text-sm text-muted-foreground",
									children: windows.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: DAYS[w.day_of_week] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium text-foreground",
											children: [
												w.start_time.slice(0, 5),
												" – ",
												w.end_time.slice(0, 5)
											]
										})]
									}, `${w.priest_id}-${i}`))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground",
									children: "By appointment — contact the office."
								}),
								services.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex flex-wrap gap-1.5",
									children: services.slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: s.name
									}, s.id))
								}) : null
							]
						}, p.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/services",
							children: "Book a service"
						})
					})
				})
			]
		})
	] });
}
//#endregion
export { Priests as component };
