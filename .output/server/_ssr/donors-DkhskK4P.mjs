import { E as PageHeader, L as communityQuery, P as Section, S as Button, w as EmptyState } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/donors-DkhskK4P.js
var import_jsx_runtime = require_jsx_runtime();
function money(cents, currency) {
	if (!cents) return null;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(cents / 100);
}
function DonorsPage() {
	const { data } = useSuspenseQuery(communityQuery);
	const tiers = Array.from(new Set(data.donors.map((d) => d.tier ?? "Supporters")));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Gratitude",
		title: "Our donors & sponsors",
		description: "Every lamp lit and every festival celebrated is made possible by these devotees and families."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [data.donors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Donor wall coming soon",
		description: "The temple office is preparing the list of contributors."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-12",
		children: tiers.map((tier) => {
			const rows = data.donors.filter((d) => (d.tier ?? "Supporters") === tier);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl",
				children: tier
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg",
							children: d.is_anonymous ? "Anonymous devotee" : d.donor_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [d.category, d.year ? String(d.year) : null].filter(Boolean).join(" · ")
						}),
						money(d.amount_cents, data.temple.currency) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-semibold text-primary",
							children: money(d.amount_cents, data.temple.currency)
						}) : null,
						d.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm italic text-muted-foreground",
							children: [
								"“",
								d.message,
								"”"
							]
						}) : null
					]
				}, d.id))
			})] }, tier);
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-12 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/donate",
				children: "Join our donors"
			})
		})
	})] })] });
}
//#endregion
export { DonorsPage as component };
