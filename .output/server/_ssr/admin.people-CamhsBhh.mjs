import { r as __toESM } from "../_runtime.mjs";
import { S as Button, c as grantAdmin, d as revokeAdmin, t as adminPeopleQuery } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQuery, o as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.people-CamhsBhh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPeople() {
	const qc = useQueryClient();
	const { data, isLoading } = useQuery(adminPeopleQuery);
	const [email, setEmail] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	if (!data?.isAdmin) return null;
	const nameFor = (userId) => {
		const p = data.profiles.find((x) => x.id === userId);
		return p?.full_name || p?.email || userId.slice(0, 8);
	};
	const emailFor = (userId) => data.profiles.find((x) => x.id === userId)?.email ?? "";
	const eventTitle = (id) => data.events.find((e) => e.id === id)?.title ?? "Event";
	const admins = data.roles.filter((r) => r.role === "temple_admin" || r.role === "super_admin");
	async function addAdmin(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await grantAdmin({ data: { email } });
			await qc.invalidateQueries({ queryKey: ["admin"] });
			setEmail("");
			toast.success("Administrator added");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not add administrator");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface-panel p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Temple administrators"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Anyone you add here can manage the temple website. They must already have an account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: addAdmin,
						className: "mt-5 flex flex-wrap items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-[16rem] flex-1 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "admin-email",
								children: "Account email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "admin-email",
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "devotee@example.com"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Adding…" : "Make administrator"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 divide-y divide-border/70",
						children: admins.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-4 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: nameFor(r.user_id)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										emailFor(r.user_id),
										" · ",
										r.role.replace("_", " ")
									]
								})]
							}), r.user_id === data.currentUserId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "You"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: async () => {
									if (!window.confirm("Remove admin access for this person?")) return;
									try {
										await revokeAdmin({ data: { roleId: r.id } });
										await qc.invalidateQueries({ queryKey: ["admin"] });
										toast.success("Access removed");
									} catch (err) {
										toast.error(err instanceof Error ? err.message : "Could not remove");
									}
								},
								children: "Remove"
							})]
						}, r.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface-panel p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "Newsletter subscribers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							data.subscribers.length,
							" devotee(s) subscribed ·",
							" ",
							data.subscribers.filter((s) => s.wants_volunteering).length,
							" open to volunteering."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-5 divide-y divide-border/70",
						children: [data.subscribers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-4 text-sm text-muted-foreground",
							children: "No subscribers yet."
						}) : null, data.subscribers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-4 py-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: s.full_name || s.email
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [s.email, s.phone ? ` · ${s.phone}` : ""]
								})]
							}), s.wants_volunteering ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground",
								children: "Volunteer"
							}) : null]
						}, s.id))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "surface-panel p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Event volunteers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-5 divide-y divide-border/70",
					children: [data.volunteers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-4 text-sm text-muted-foreground",
						children: "No volunteer sign-ups yet."
					}) : null, data.volunteers.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									v.full_name || nameFor(v.user_id),
									" — ",
									eventTitle(v.event_id)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									v.role_preference,
									v.availability,
									v.phone
								].filter(Boolean).join(" · ") || "No preferences given"
							}),
							v.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: v.notes
							}) : null
						]
					}, v.id))]
				})]
			})
		]
	});
}
//#endregion
export { AdminPeople as component };
