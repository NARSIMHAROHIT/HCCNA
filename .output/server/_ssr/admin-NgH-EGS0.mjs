import { r as __toESM } from "../_runtime.mjs";
import { E as PageHeader, P as Section, S as Button, a as claimFirstAdmin, n as adminQuery } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as Link, p as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-NgH-EGS0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/admin",
		label: "Overview",
		exact: true
	},
	{
		to: "/admin/temple",
		label: "Temple details"
	},
	{
		to: "/admin/timings",
		label: "Timings"
	},
	{
		to: "/admin/poojas",
		label: "Poojas & prices"
	},
	{
		to: "/admin/events",
		label: "Events & notices"
	},
	{
		to: "/admin/community",
		label: "Board & donors"
	},
	{
		to: "/admin/people",
		label: "People & admins"
	},
	{
		to: "/admin/payments",
		label: "Payments"
	},
	{
		to: "/admin/audit",
		label: "Audit log"
	}
];
function ClaimAdmin() {
	const qc = useQueryClient();
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-panel max-w-xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Setting up the temple for the first time?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "If no administrator has been appointed yet, you can claim administrator access for this account. Afterwards you can add other administrators from the People tab."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				disabled: busy,
				onClick: async () => {
					setBusy(true);
					try {
						await claimFirstAdmin();
						await qc.invalidateQueries({ queryKey: ["admin"] });
						toast.success("You are now a temple administrator.");
					} catch (err) {
						toast.error(err instanceof Error ? err.message : "Could not claim access");
					} finally {
						setBusy(false);
					}
				},
				children: busy ? "Checking…" : "Claim administrator access"
			})
		]
	});
}
function AdminLayout() {
	const { data, isLoading, error } = useQuery(adminQuery);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading the admin console…"
	}) });
	if (error || !data?.isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin",
		title: "Administrator access only",
		description: "Your account does not have temple administrator permissions. Please contact the temple office."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClaimAdmin, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		className: "mt-6 inline-block text-primary underline",
		children: "Return to the temple home page"
	})] })] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin console",
		title: data.temple.name,
		description: "Update pages, timings, seva prices, events and review online payments."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		className: "pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": "Admin sections",
			className: "mb-8 flex flex-wrap gap-2",
			children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: t.to,
				activeOptions: { exact: "exact" in t },
				className: "rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent/60",
				activeProps: { className: "bg-primary text-primary-foreground border-primary" },
				children: t.label
			}, t.to))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
	})] });
}
//#endregion
export { AdminLayout as component };
