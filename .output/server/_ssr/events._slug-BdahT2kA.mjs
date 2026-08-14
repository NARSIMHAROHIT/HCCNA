import { r as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as eventQuery } from "./queries-CH7ElXGN.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, l as Route$14, p as Section, t as Button, v as volunteerForEvent } from "./router-FwX4_uf4.mjs";
import { t as supabase } from "./client-B_zZjpbc.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as formatMoney, t as formatInTimezone } from "./timezone-BD2Gbves.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events._slug-BdahT2kA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EventDetail() {
	const { slug } = Route$14.useParams();
	const { data } = useSuspenseQuery(eventQuery(slug));
	if (!data) return null;
	const { event, temple, items, photos } = data;
	const tz = temple.timezone;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: event.category ?? "Event",
		title: event.title,
		description: formatInTimezone(event.starts_at, tz, {
			weekday: "long",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10 lg:grid-cols-[1.3fr_0.7fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 text-base leading-relaxed text-muted-foreground",
			children: [
				(event.description ?? "").split("\n").filter(Boolean).map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: para }, i)),
				items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-panel p-6 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Items to bring for this pooja"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border/70",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-4 py-2.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: [item.quantity, item.note].filter(Boolean).join(" · ")
							})]
						}, item.id))
					})]
				}) : null,
				event.volunteers_needed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolunteerForm, { eventId: event.id }) : null,
				photos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-foreground",
					children: "Photos from earlier years"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: photos.map((photo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "surface-panel overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: photo.image_url,
							alt: photo.title ?? `${event.title} photograph`,
							loading: "lazy",
							className: "h-48 w-full object-cover"
						}), photo.title || photo.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "p-3 text-xs text-muted-foreground",
							children: [[photo.title, photo.year].filter(Boolean).join(" · "), photo.caption ? ` — ${photo.caption}` : ""]
						}) : null]
					}, photo.id))
				})] }) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "surface-panel h-fit p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Starts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: formatInTimezone(event.starts_at, tz, {
								month: "short",
								day: "numeric",
								hour: "numeric",
								minute: "2-digit"
							})
						})] }),
						event.ends_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Ends"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: formatInTimezone(event.ends_at, tz, {
								hour: "numeric",
								minute: "2-digit"
							})
						})] }) : null,
						event.location ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: event.location
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: "Contribution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-medium",
							children: event.fee_cents > 0 ? formatMoney(event.fee_cents, temple.currency) : "Free"
						})] })
					]
				}),
				event.deity ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "mt-4",
					variant: "secondary",
					children: event.deity
				}) : null,
				event.sponsor_name ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-lg border border-primary/30 bg-primary/5 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Sponsored by"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-lg",
							children: event.sponsor_name
						}),
						event.sponsorship_amount_cents ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-primary",
							children: formatMoney(event.sponsorship_amount_cents, temple.currency)
						}) : null,
						event.sponsor_note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: event.sponsor_note
						}) : null,
						event.sponsor_contact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: event.sponsor_contact
						}) : null
					]
				}) : null,
				event.is_annual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "mt-4",
					variant: "outline",
					children: "Celebrated every year"
				}) : null,
				event.registration_required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Registration is required — please contact the temple office to reserve your place."
				}) : null
			]
		})]
	}) })] });
}
function VolunteerForm({ eventId }) {
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [rolePreference, setRolePreference] = (0, import_react.useState)("");
	const [availability, setAvailability] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		supabase.auth.getUser().then(({ data }) => {
			if (active) setSignedIn(Boolean(data.user));
		});
		return () => {
			active = false;
		};
	}, []);
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-panel p-6 text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl",
			children: "Thank you for volunteering"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "The temple team will contact you with details closer to the event."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-panel p-6 text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl",
			children: "Volunteer for this event"
		}), signedIn === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm",
			children: [
				"Please",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					className: "text-primary underline",
					children: "sign in"
				}),
				" ",
				"to register as a volunteer."
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-4 grid gap-3 sm:grid-cols-2",
			onSubmit: async (e) => {
				e.preventDefault();
				setBusy(true);
				try {
					await volunteerForEvent({ data: {
						eventId,
						...fullName ? { fullName } : {},
						...phone ? { phone } : {},
						...rolePreference ? { rolePreference } : {},
						...availability ? { availability } : {},
						...notes ? { notes } : {}
					} });
					setDone(true);
					toast.success("You are registered as a volunteer.");
				} catch (err) {
					toast.error(err instanceof Error ? err.message : "Could not register");
				} finally {
					setBusy(false);
				}
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "v-name",
						children: "Your name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "v-name",
						value: fullName,
						onChange: (e) => setFullName(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "v-phone",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "v-phone",
						value: phone,
						onChange: (e) => setPhone(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "v-role",
						children: "How would you like to help?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "v-role",
						placeholder: "Kitchen, decorations, parking…",
						value: rolePreference,
						onChange: (e) => setRolePreference(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "v-avail",
						children: "Availability"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "v-avail",
						placeholder: "Morning, evening…",
						value: availability,
						onChange: (e) => setAvailability(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "v-notes",
						children: "Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "v-notes",
						rows: 3,
						value: notes,
						onChange: (e) => setNotes(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || signedIn === null,
						children: busy ? "Registering…" : "Register as volunteer"
					})
				})
			]
		})]
	});
}
//#endregion
export { EventDetail as component };
