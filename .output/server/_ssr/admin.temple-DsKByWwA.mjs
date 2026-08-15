import { r as __toESM } from "../_runtime.mjs";
import { S as Button, n as adminQuery } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as RecordDialog } from "./CrudSection-Wn7twfrB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.temple-DsKByWwA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	{
		name: "name",
		label: "Temple name"
	},
	{
		name: "short_name",
		label: "Short name"
	},
	{
		name: "tagline",
		label: "Tagline",
		full: true
	},
	{
		name: "phone",
		label: "Phone"
	},
	{
		name: "email",
		label: "Email"
	},
	{
		name: "website",
		label: "Website"
	},
	{
		name: "address_line1",
		label: "Address line 1"
	},
	{
		name: "address_line2",
		label: "Address line 2"
	},
	{
		name: "city",
		label: "City"
	},
	{
		name: "state",
		label: "State"
	},
	{
		name: "postal_code",
		label: "Postal code"
	},
	{
		name: "country",
		label: "Country"
	},
	{
		name: "facebook_url",
		label: "Facebook URL"
	},
	{
		name: "instagram_url",
		label: "Instagram URL"
	},
	{
		name: "youtube_url",
		label: "YouTube URL"
	},
	{
		name: "whatsapp_url",
		label: "WhatsApp URL"
	},
	{
		name: "hero_image_url",
		label: "Hero image URL",
		full: true
	},
	{
		name: "about_html",
		label: "About (HTML allowed)",
		type: "textarea"
	},
	{
		name: "history_html",
		label: "History (HTML allowed)",
		type: "textarea"
	},
	{
		name: "mission_html",
		label: "Mission (HTML allowed)",
		type: "textarea"
	},
	{
		name: "seo_title",
		label: "SEO title",
		full: true
	},
	{
		name: "seo_description",
		label: "SEO description",
		type: "textarea"
	}
];
function AdminTemple() {
	const { data } = useQuery(adminQuery);
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!data?.isAdmin) return null;
	const t = data.temple;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "surface-panel p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Temple information"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Shown across the website header, footer, about and contact pages."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: () => setOpen(true),
					children: "Edit details"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2",
				children: [
					["Name", t.name],
					["Tagline", t.tagline],
					["Phone", t.phone],
					["Email", t.email],
					["Address", [
						t.address_line1,
						t.city,
						t.state,
						t.postal_code
					].filter(Boolean).join(", ")],
					["Website", t.website]
				].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-4 border-b border-border/60 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-sm text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-right text-sm font-semibold",
						children: value || "—"
					})]
				}, String(label)))
			})]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordDialog, {
			table: "temples",
			singular: "temple details",
			fields: FIELDS,
			row: t,
			onClose: () => setOpen(false)
		}) : null]
	});
}
//#endregion
export { AdminTemple as component };
