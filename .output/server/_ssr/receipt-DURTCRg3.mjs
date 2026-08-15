import { E as PageHeader, M as Route$21, P as Section, S as Button } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as getReceipt } from "./payments.functions-DPBav9dh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipt-DURTCRg3.js
var import_jsx_runtime = require_jsx_runtime();
function money(cents, currency) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency
	}).format(cents / 100);
}
function ReceiptPage() {
	const { session_id: sessionId } = Route$21.useSearch();
	const { data, isLoading } = useQuery({
		queryKey: ["receipt", sessionId],
		queryFn: () => getReceipt({ data: { sessionId } }),
		enabled: Boolean(sessionId)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Thank you",
		title: "Your offering is received",
		description: "A copy of this receipt has been recorded by the temple office."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl",
		children: !sessionId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "No payment reference was provided."
		}) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "Loading your receipt…"
		}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "We could not find a payment with that reference."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "surface-panel space-y-5 p-8 print:border-0 print:shadow-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "border-b border-border/70 pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: data.temple?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								data.temple?.address_line1,
								data.temple?.city,
								data.temple?.state,
								data.temple?.postal_code
							].filter(Boolean).join(", ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: [data.temple?.phone, data.temple?.email].filter(Boolean).join(" · ")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Receipt number",
							value: data.payment.receipt_number
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Offering",
							value: data.payment.item_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Devotee",
							value: data.payment.devotee_name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Date",
							value: new Date(data.payment.paid_at ?? data.payment.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Status",
							value: data.payment.status === "paid" ? "Paid" : "Pending"
						}),
						data.payment.preferred_date ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Requested date",
							value: data.payment.preferred_date
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between border-t border-border/70 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "Amount"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-3xl text-primary",
						children: money(data.payment.amount_cents, data.payment.currency)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Please retain this receipt for your records. Contributions may be tax deductible to the extent allowed by law."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex justify-center print:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => window.print(),
				children: "Print receipt"
			})
		})] })
	}) })] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right font-semibold text-foreground",
			children: value
		})]
	});
}
//#endregion
export { ReceiptPage as component };
