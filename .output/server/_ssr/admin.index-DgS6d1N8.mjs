import { n as adminQuery } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-DgS6d1N8.js
var import_jsx_runtime = require_jsx_runtime();
function money(cents) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
}
function AdminOverview() {
	const { data } = useQuery(adminQuery);
	if (!data?.isAdmin) return null;
	const paid = data.payments.filter((p) => p.status === "paid");
	const thisMonth = paid.filter((p) => new Date(p.paid_at ?? p.created_at).getMonth() === (/* @__PURE__ */ new Date()).getMonth());
	const total = paid.reduce((sum, p) => sum + p.amount_cents, 0);
	const monthTotal = thisMonth.reduce((sum, p) => sum + p.amount_cents, 0);
	const stats = [
		{
			label: "Received (all time)",
			value: money(total)
		},
		{
			label: "Received this month",
			value: money(monthTotal)
		},
		{
			label: "Paid transactions",
			value: String(paid.length)
		},
		{
			label: "Active poojas listed",
			value: String(data.services.filter((s) => s.is_active).length)
		},
		{
			label: "Upcoming events",
			value: String(data.events.length)
		},
		{
			label: "Board members",
			value: String(data.board.length)
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-panel p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl text-primary",
					children: s.value
				})]
			}, s.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "surface-panel p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Latest offerings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 divide-y divide-border/70",
				children: [data.payments.slice(0, 8).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold",
							children: p.item_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								p.devotee_name,
								" · ",
								p.receipt_number,
								" · ",
								new Date(p.created_at).toLocaleDateString()
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: p.status === "paid" ? "text-primary" : "text-muted-foreground",
						children: money(p.amount_cents)
					})]
				}, p.id)), data.payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-3 text-sm text-muted-foreground",
					children: "No online payments yet."
				}) : null]
			})]
		})]
	});
}
//#endregion
export { AdminOverview as component };
