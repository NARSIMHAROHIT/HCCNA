import { E as PageHeader, P as Section, m as siteQuery, w as EmptyState } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { r as ServiceCard } from "./cards-TlQ8mL-q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services.index-Dn9B9RqJ.js
var import_jsx_runtime = require_jsx_runtime();
function ServicesIndex() {
	const { data } = useSuspenseQuery(siteQuery);
	const services = data.services.filter((s) => s.is_active);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Sevas",
		title: "Poojas & services",
		description: "Select a seva to see details, priests and available times. Bookings are confirmed instantly."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: services.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Services are being published" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-12",
		children: [data.categories.map((cat) => {
			const inCat = services.filter((s) => s.category_id === cat.id);
			if (inCat.length === 0) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl",
					children: cat.name
				}),
				cat.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: cat.description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: inCat.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, {
						service: s,
						currency: data.temple.currency
					}, s.id))
				})
			] }, cat.id);
		}), (() => {
			const uncategorized = services.filter((s) => !s.category_id || !data.categories.some((c) => c.id === s.category_id));
			if (uncategorized.length === 0) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: "Other services"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: uncategorized.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceCard, {
					service: s,
					currency: data.temple.currency
				}, s.id))
			})] });
		})()]
	}) })] });
}
//#endregion
export { ServicesIndex as component };
