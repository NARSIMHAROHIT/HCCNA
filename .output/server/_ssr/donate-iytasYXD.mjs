import { r as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as siteQuery } from "./queries-CH7ElXGN.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, p as Section, t as Button } from "./router-FwX4_uf4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as createPaymentCheckout } from "./payments.functions-Boh6CxNT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/donate-iytasYXD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CAUSES = [
	{
		title: "Daily worship",
		body: "Flowers, fruits, oil lamps and materials for the daily pooja cycle."
	},
	{
		title: "Festivals",
		body: "Utsavams, annadanam and cultural programs through the year."
	},
	{
		title: "Temple upkeep",
		body: "Sanctum maintenance, utilities and expansion of community space."
	}
];
var PRESETS = [
	51,
	101,
	251,
	501,
	1001
];
function Donate() {
	const { data } = useSuspenseQuery(siteQuery);
	const t = data.temple;
	const [amount, setAmount] = (0, import_react.useState)(101);
	const [custom, setCustom] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const dollars = custom ? Number(custom) : Number(amount);
		const amountCents = Math.round(dollars * 100);
		if (!Number.isFinite(amountCents) || amountCents < 100) {
			toast.error("Please choose or enter an amount of $1 or more.");
			return;
		}
		setPending(true);
		try {
			const { url } = await createPaymentCheckout({ data: {
				kind: "donation",
				itemName: String(form.get("purpose") || "General donation"),
				amountCents,
				devoteeName: String(form.get("name") ?? ""),
				devoteeEmail: String(form.get("email") ?? ""),
				devoteePhone: String(form.get("phone") ?? ""),
				notes: String(form.get("notes") ?? ""),
				origin: window.location.origin
			} });
			window.location.href = url;
		} catch (err) {
			setPending(false);
			toast.error(err instanceof Error ? err.message : "Donation could not be started.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Seva",
		title: "Support the temple",
		description: "Every contribution sustains worship, festivals and cultural education for our community."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 md:grid-cols-3",
			children: CAUSES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-panel p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg",
					children: c.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: c.body
				})]
			}, c.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "surface-panel mx-auto mt-10 max-w-2xl space-y-5 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl",
					children: "Make a donation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: !custom && amount === p ? "default" : "outline",
						onClick: () => {
							setAmount(p);
							setCustom("");
						},
						children: ["$", p]
					}, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "custom",
						children: "Other amount (USD)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "custom",
						inputMode: "decimal",
						value: custom,
						onChange: (e) => setCustom(e.target.value),
						placeholder: "Enter any amount"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Your name"
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
								htmlFor: "purpose",
								children: "Purpose"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "purpose",
								name: "purpose",
								defaultValue: "General donation"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "notes",
						children: "Message (optional)"
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
					children: pending ? "Redirecting to secure checkout…" : "Donate securely"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "Processed by Stripe. You will receive a printable receipt immediately."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex flex-wrap justify-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/services",
						children: "Sponsor a specific seva"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/donors",
						children: "See our donors"
					})
				}),
				t.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `tel:${t.phone}`,
						children: "Call the office"
					})
				}) : null
			]
		})
	] })] });
}
//#endregion
export { Donate as component };
