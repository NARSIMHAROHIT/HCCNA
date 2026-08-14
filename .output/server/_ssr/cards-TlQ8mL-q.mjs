import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as MapPin, h as CalendarDays, n as Users, p as Clock } from "../_libs/lucide-react.mjs";
import { n as formatMoney, t as formatInTimezone } from "./timezone-BD2Gbves.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cards-TlQ8mL-q.js
var import_jsx_runtime = require_jsx_runtime();
function ServiceCard({ service, currency }) {
	const locationLabel = service.location_type === "temple" ? "At the temple" : service.location_type === "home" ? "At your home" : "Temple or home";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/services/$slug",
		params: { slug: service.slug },
		className: "surface-panel group flex h-full flex-col p-5 transition hover:shadow-[var(--shadow-lift)] focus-visible:shadow-[var(--shadow-lift)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl leading-snug transition group-hover:text-primary",
				children: service.name
			}),
			service.short_description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 flex-1 text-sm text-muted-foreground",
				children: service.short_description
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							className: "size-3.5",
							"aria-hidden": true
						}),
						" ",
						service.duration_minutes,
						" min"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							className: "size-3.5",
							"aria-hidden": true
						}),
						" ",
						locationLabel
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-lg text-primary",
				children: service.price_cents > 0 ? formatMoney(service.price_cents, currency) : "By donation"
			})
		]
	});
}
function EventCard({ event, timezone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/events/$slug",
		params: { slug: event.slug },
		className: "surface-panel group flex h-full flex-col p-5 transition hover:shadow-[var(--shadow-lift)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex size-14 shrink-0 flex-col items-center justify-center rounded-lg bg-accent text-accent-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[0.65rem] font-bold uppercase tracking-wide",
						children: formatInTimezone(event.starts_at, timezone, { month: "short" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl leading-none",
						children: formatInTimezone(event.starts_at, timezone, { day: "numeric" })
					})]
				}), event.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: event.category
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-lg leading-snug transition group-hover:text-primary",
				children: event.title
			}),
			event.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground",
				children: event.description
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-1.5 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
							className: "size-3.5",
							"aria-hidden": true
						}), formatInTimezone(event.starts_at, timezone, {
							weekday: "short",
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "2-digit"
						})]
					}),
					event.location ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "size-3.5",
								"aria-hidden": true
							}),
							" ",
							event.location
						]
					}) : null,
					event.registration_required ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "inline-flex items-center gap-1.5 text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
							className: "size-3.5",
							"aria-hidden": true
						}), " Registration required"]
					}) : null
				]
			})
		]
	});
}
function PriestCard({ priest }) {
	const initials = priest.full_name.split(" ").slice(-2).map((part) => part[0]).join("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "surface-panel flex h-full flex-col p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-14 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary",
					children: initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg leading-tight",
						children: priest.full_name
					}),
					priest.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: priest.title
					}) : null,
					priest.working_since ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Serving since",
							" ",
							new Date(priest.working_since).toLocaleDateString(void 0, {
								month: "long",
								year: "numeric"
							})
						]
					}) : null
				] })]
			}),
			priest.biography ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 flex-1 text-sm text-muted-foreground",
				children: priest.biography
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
			priest.qualifications ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: "Qualifications: "
				}), priest.qualifications]
			}) : null,
			priest.specializations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-1.5",
				children: priest.specializations.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: s
				}, s))
			}) : null,
			priest.working_days?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: "At the temple: "
				}), priest.working_days.join(", ")]
			}) : null,
			priest.languages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: ["Languages: ", priest.languages.join(", ")]
			}) : null
		]
	});
}
//#endregion
export { PriestCard as n, ServiceCard as r, EventCard as t };
