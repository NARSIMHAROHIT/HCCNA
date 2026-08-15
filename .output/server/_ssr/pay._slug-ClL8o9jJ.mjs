import { r as __toESM } from "../_runtime.mjs";
import { E as PageHeader, P as Section, S as Button, m as siteQuery } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { y as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as createPaymentCheckout } from "./payments.functions-DPBav9dh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pay._slug-ClL8o9jJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function money(cents, currency) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency
	}).format(cents / 100);
}
function PayPage() {
	const { slug } = useParams({ from: "/pay/$slug" });
	const { data } = useSuspenseQuery(siteQuery);
	const service = data.services.find((s) => s.slug === slug);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [custom, setCustom] = (0, import_react.useState)("");
	if (!service) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "This seva is no longer offered."
	}) });
	const openAmount = service.price_cents === 0;
	async function onSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const amountCents = openAmount ? Math.round(Number(custom || 0) * 100) : service.price_cents;
		if (!Number.isFinite(amountCents) || amountCents < 100) {
			toast.error("Please enter an amount of $1 or more.");
			return;
		}
		setPending(true);
		try {
			const { url } = await createPaymentCheckout({ data: {
				kind: "pooja",
				serviceSlug: slug,
				itemName: service.name,
				amountCents,
				devoteeName: String(form.get("name") ?? ""),
				devoteeEmail: String(form.get("email") ?? ""),
				devoteePhone: String(form.get("phone") ?? ""),
				gotra: String(form.get("gotra") ?? ""),
				nakshatra: String(form.get("nakshatra") ?? ""),
				preferredDate: String(form.get("date") ?? ""),
				notes: String(form.get("notes") ?? ""),
				origin: window.location.origin
			} });
			window.location.href = url;
		} catch (err) {
			setPending(false);
			toast.error(err instanceof Error ? err.message : "Payment could not be started.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Seva offering",
		title: service.name,
		description: service.short_description ?? "Complete the sankalpam details and pay securely."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "surface-panel mx-auto max-w-2xl space-y-5 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between border-b border-border/70 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "Offering amount"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl text-primary",
					children: openAmount ? "Your choice" : money(service.price_cents, data.temple.currency)
				})]
			}),
			openAmount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "custom",
					children: "Amount (USD)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "custom",
					inputMode: "decimal",
					value: custom,
					onChange: (e) => setCustom(e.target.value),
					placeholder: "51",
					required: true
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Devotee name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							name: "name",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							name: "email",
							type: "email",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "phone",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							name: "phone"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "date",
							children: "Preferred date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "date",
							name: "date",
							type: "date"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gotra",
							children: "Gotra"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "gotra",
							name: "gotra"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nakshatra",
							children: "Nakshatra / Rashi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nakshatra",
							name: "nakshatra"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "notes",
					children: "Names for sankalpam / notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "notes",
					name: "notes",
					rows: 3
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				className: "w-full",
				disabled: pending,
				children: pending ? "Redirecting to secure checkout…" : "Continue to payment"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-muted-foreground",
				children: "Payments are processed securely by Stripe. A receipt is issued instantly."
			})
		]
	}) })] });
}
//#endregion
export { PayPage as component };
