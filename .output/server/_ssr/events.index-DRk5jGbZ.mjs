import { E as PageHeader, P as Section, m as siteQuery, w as EmptyState } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as EventCard } from "./cards-TlQ8mL-q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events.index-DRk5jGbZ.js
var import_jsx_runtime = require_jsx_runtime();
function EventsIndex() {
	const { data } = useSuspenseQuery(siteQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Community",
			title: "Events & festivals",
			description: "Join us for festivals, abhishekams, satsangs and cultural programs through the year."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: data.events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No upcoming events yet",
			description: "Please check back soon."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: data.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, {
				event: e,
				timezone: data.temple.timezone
			}, e.id))
		}) }),
		data.annualEvents.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			tone: "muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-6 text-2xl",
				children: "Yearly events at the temple"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: data.annualEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, {
					event: e,
					timezone: data.temple.timezone
				}, e.id))
			})]
		}) : null,
		data.eventPhotos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-6 text-2xl",
			children: "Photos from earlier events"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: data.eventPhotos.map((photo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "surface-panel overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: photo.image_url,
					alt: photo.title ?? "Temple event photograph",
					loading: "lazy",
					className: "h-52 w-full object-cover"
				}), photo.title || photo.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "p-3 text-xs text-muted-foreground",
					children: [[photo.title, photo.year].filter(Boolean).join(" · "), photo.caption ? ` — ${photo.caption}` : ""]
				}) : null]
			}, photo.id))
		})] }) : null
	] });
}
//#endregion
export { EventsIndex as component };
