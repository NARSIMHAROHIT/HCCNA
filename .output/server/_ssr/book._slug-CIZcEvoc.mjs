import { r as __toESM } from "../_runtime.mjs";
import { E as PageHeader, O as Route$1, P as Section, S as Button } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as getServiceAvailability, n as createBooking, o as useServerFn } from "./booking.functions-CaQ6iYX5.mjs";
import { n as formatMoney } from "./timezone-BD2Gbves.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._slug-CIZcEvoc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function todayIso() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function BookPage() {
	const { slug } = Route$1.useParams();
	const navigate = useNavigate();
	const availability = useServerFn(getServiceAvailability);
	const book = useServerFn(createBooking);
	const [date, setDate] = (0, import_react.useState)(todayIso());
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		contactName: "",
		contactPhone: "",
		contactEmail: "",
		gotra: "",
		nakshatra: "",
		address: "",
		notes: ""
	});
	const { data, isFetching } = useQuery({
		queryKey: [
			"availability",
			slug,
			date
		],
		queryFn: () => availability({ data: {
			serviceSlug: slug,
			date
		} })
	});
	const service = data?.service ?? null;
	const locationType = service?.location_type === "home" ? "home" : "temple";
	const mutation = useMutation({
		mutationFn: async () => {
			if (!selected) throw new Error("Please choose a time slot.");
			return book({ data: {
				serviceSlug: slug,
				startsAt: selected.startsAt,
				priestId: selected.priestId,
				locationType,
				contactName: form.contactName,
				contactPhone: form.contactPhone,
				contactEmail: form.contactEmail,
				...form.gotra ? { gotra: form.gotra } : {},
				...form.nakshatra ? { nakshatra: form.nakshatra } : {},
				...form.address ? { address: form.address } : {},
				...form.notes ? { notes: form.notes } : {}
			} });
		},
		onSuccess: (result) => {
			toast.success(`Booking confirmed — reference ${result.reference}`);
			navigate({ to: "/dashboard" });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Booking failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Booking",
		title: service?.name ?? "Book a service",
		...service ? { description: `${service.duration_minutes} minutes · ${service.price_cents > 0 ? formatMoney(service.price_cents) : "By donation"}` } : {}
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[0.9fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-panel h-fit p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "date",
					children: "Choose a date"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "date",
					type: "date",
					className: "mt-2",
					min: todayIso(),
					value: date,
					onChange: (e) => {
						setDate(e.target.value);
						setSelected(null);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-sm font-semibold",
					children: "Available times"
				}),
				isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Checking availability…"
				}) : (data?.slots.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "No slots on this date. Please try another day."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: data.slots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelected({
							startsAt: s.startsAt,
							priestId: s.priestId,
							label: s.label
						}),
						className: `rounded-md border px-3 py-2 text-sm transition ${selected?.startsAt === s.startsAt && selected?.priestId === s.priestId ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent/60"}`,
						children: [s.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs opacity-80",
							children: s.priestName
						})]
					}, `${s.startsAt}-${s.priestId}`))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "surface-panel space-y-5 p-6",
			onSubmit: (e) => {
				e.preventDefault();
				mutation.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: selected ? `Selected time: ${selected.label}` : "Select a time slot to continue."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contactName",
							children: "Your name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "contactName",
							required: true,
							value: form.contactName,
							onChange: (e) => setForm({
								...form,
								contactName: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contactPhone",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "contactPhone",
							type: "tel",
							required: true,
							value: form.contactPhone,
							onChange: (e) => setForm({
								...form,
								contactPhone: e.target.value
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "contactEmail",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "contactEmail",
						type: "email",
						required: true,
						value: form.contactEmail,
						onChange: (e) => setForm({
							...form,
							contactEmail: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "gotra",
							children: "Gotra (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "gotra",
							value: form.gotra,
							onChange: (e) => setForm({
								...form,
								gotra: e.target.value
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nakshatra",
							children: "Nakshatra (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nakshatra",
							value: form.nakshatra,
							onChange: (e) => setForm({
								...form,
								nakshatra: e.target.value
							})
						})]
					})]
				}),
				locationType === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "address",
						children: "Service address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "address",
						required: true,
						value: form.address,
						onChange: (e) => setForm({
							...form,
							address: e.target.value
						})
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "notes",
						children: "Notes for the priest (optional)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "notes",
						value: form.notes,
						onChange: (e) => setForm({
							...form,
							notes: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "lg",
					disabled: !selected || mutation.isPending,
					children: "Confirm booking"
				})
			]
		})]
	}) })] });
}
//#endregion
export { BookPage as component };
