import { r as auditQuery } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.audit-C9FBB46e.js
var import_jsx_runtime = require_jsx_runtime();
var ENTITY_LABEL = {
	events: "Event",
	priests: "Priest",
	donors: "Donor",
	deities: "Deity"
};
var ACTION_LABEL = {
	insert: "created",
	update: "edited",
	delete: "deleted"
};
function preview(value) {
	if (value === null || value === void 0) return "—";
	if (typeof value === "string") return value.length > 60 ? `${value.slice(0, 60)}…` : value;
	if (Array.isArray(value)) return value.join(", ") || "—";
	if (typeof value === "object") return JSON.stringify(value).slice(0, 60);
	return String(value);
}
function AdminAudit() {
	const { data, isLoading } = useQuery(auditQuery);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading the audit trail…"
	});
	if (!data?.isAdmin) return null;
	const actorName = (id) => {
		if (!id) return "System";
		const actor = data.actors.find((a) => a.id === id);
		return actor?.full_name || actor?.email || "Unknown user";
	};
	const tracked = data.entries.filter((e) => e.entity && ENTITY_LABEL[e.entity]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-panel p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Audit log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Every change to events, priests, donors and deities — who made it, when, and what changed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-6 space-y-4",
				children: [tracked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted-foreground",
					children: "No recorded changes yet."
				}) : null, tracked.map((entry) => {
					const changes = entry.changes ?? {};
					const fields = entry.action === "update" ? Object.entries(changes) : [];
					const label = entry.metadata?.label;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-border/70 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold",
								children: [
									actorName(entry.actor_id),
									" ",
									ACTION_LABEL[entry.action] ?? entry.action,
									" ",
									ENTITY_LABEL[entry.entity ?? ""] ?? entry.entity,
									label ? ` — ${label}` : ""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: new Date(entry.created_at).toLocaleString()
							})]
						}), fields.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "mt-3 w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "w-1/4 pb-1 text-left font-medium",
										children: "Field"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-1 text-left font-medium",
										children: "Before"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-1 text-left font-medium",
										children: "After"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/60",
								children: fields.map(([field, diff]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1.5 pr-3 font-medium",
										children: field.replace(/_/g, " ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1.5 pr-3 text-muted-foreground",
										children: preview(diff?.from)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-1.5",
										children: preview(diff?.to)
									})
								] }, field))
							})]
						}) : null]
					}, entry.id);
				})]
			})
		]
	});
}
//#endregion
export { AdminAudit as component };
