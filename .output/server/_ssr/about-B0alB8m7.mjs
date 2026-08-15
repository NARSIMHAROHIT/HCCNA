import { D as Prose, E as PageHeader, F as SectionHeading, P as Section, m as siteQuery } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-B0alB8m7.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	const { data } = useSuspenseQuery(siteQuery);
	const t = data.temple;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "About us",
			title: `About ${t.short_name ?? t.name}`,
			...t.tagline ? { description: t.tagline } : {}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-[1.3fr_0.7fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8",
				children: [t.about_html ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-2xl",
					children: "Our story"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { html: t.about_html })] }) : null, t.mission_html ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-2xl",
					children: "Our mission"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prose, { html: t.mission_html })] }) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "surface-panel h-fit p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Temple details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "font-medium",
							children: [
								t.address_line1,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								[
									t.city,
									t.state,
									t.postal_code
								].filter(Boolean).join(", ")
							]
						})] }),
						t.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: t.phone
						})] }) : null,
						t.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium break-all",
							children: t.email
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Timezone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: t.timezone
						})] })
					]
				})]
			})]
		}) }),
		data.deities.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			tone: "muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Sanctum",
				title: "Deities worshipped here",
				description: "Daily abhishekam, alankaram and archana are offered to each deity in the temple."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: data.deities.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg",
						children: d.name
					}), d.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: d.description
					}) : null]
				}, d.id))
			})]
		}) : null
	] });
}
//#endregion
export { About as component };
