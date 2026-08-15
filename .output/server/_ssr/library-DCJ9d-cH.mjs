import { E as PageHeader, P as Section, S as Button, i as booksQuery, w as EmptyState } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-DCJ9d-cH.js
var import_jsx_runtime = require_jsx_runtime();
function Library() {
	const { data } = useSuspenseQuery(booksQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Study",
		title: "Digital library",
		description: "Scriptures, stotras and cultural resources for devotees of every age."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: data.books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "The library is being catalogued" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
		children: data.books.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "surface-panel flex h-full flex-col p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg leading-snug",
					children: b.title
				}),
				b.author ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: b.author
				}) : null,
				b.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 flex-1 text-sm text-muted-foreground",
					children: b.description
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-1.5",
					children: [b.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: b.category
					}) : null, b.language ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: b.language
					}) : null]
				}),
				b.file_url || b.external_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: b.file_url ?? b.external_url,
						target: "_blank",
						rel: "noreferrer",
						children: "Open"
					})
				}) : null
			]
		}, b.id))
	}) })] });
}
//#endregion
export { Library as component };
