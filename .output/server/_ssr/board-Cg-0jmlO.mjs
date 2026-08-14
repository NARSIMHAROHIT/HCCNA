import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, h as communityQuery, p as Section, r as EmptyState } from "./router-FwX4_uf4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-Cg-0jmlO.js
var import_jsx_runtime = require_jsx_runtime();
function BoardPage() {
	const { data } = useSuspenseQuery(communityQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Seva leadership",
		title: "Board & committee",
		description: "Elected volunteers who steward the temple's worship, finances and community programs."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: data.board.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Board listing coming soon" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
		children: data.board.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "surface-panel p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: m.position ?? "Member"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-xl",
					children: m.full_name
				}),
				m.term ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Term: ", m.term]
				}) : null,
				m.bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: m.bio
				}) : null,
				m.email || m.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: [m.email, m.phone].filter(Boolean).join(" · ")
				}) : null
			]
		}, m.id))
	}) })] });
}
//#endregion
export { BoardPage as component };
