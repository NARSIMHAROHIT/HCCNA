import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { m as siteQuery } from "./queries-CH7ElXGN.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, p as Section } from "./router-FwX4_uf4.mjs";
import { c as Phone, d as MapPin, f as Mail } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BbfQDoMZ.js
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const { data } = useSuspenseQuery(siteQuery);
	const t = data.temple;
	const mapQuery = encodeURIComponent([
		t.address_line1,
		t.city,
		t.state,
		t.postal_code
	].filter(Boolean).join(", "));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Visit us",
		title: "Contact & directions",
		description: "We welcome devotees and visitors of all backgrounds. Please remove footwear before entering the sanctum."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-panel p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Temple office"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", {
					className: "mt-4 space-y-3 text-sm not-italic text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "mt-0.5 size-4 shrink-0",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								t.address_line1,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								[
									t.city,
									t.state,
									t.postal_code
								].filter(Boolean).join(", ")
							] })]
						}),
						t.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "size-4",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "hover:text-foreground",
								href: `tel:${t.phone}`,
								children: t.phone
							})]
						}) : null,
						t.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
								className: "size-4",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "hover:text-foreground",
								href: `mailto:${t.email}`,
								children: t.email
							})]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "mt-6 inline-flex text-sm font-semibold text-primary hover:underline",
					href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
					target: "_blank",
					rel: "noreferrer",
					children: "Open in Google Maps"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-panel overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				title: "Temple location map",
				className: "h-full min-h-72 w-full",
				loading: "lazy",
				src: `https://www.google.com/maps?q=${mapQuery}&output=embed`
			})
		})]
	}) })] });
}
//#endregion
export { Contact as component };
