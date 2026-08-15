import { E as PageHeader, P as Section, S as Button, w as EmptyState } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as Link, b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useServerFn, r as getMyDashboard, t as cancelMyBooking } from "./booking.functions-CaQ6iYX5.mjs";
import { n as formatMoney, t as formatInTimezone } from "./timezone-BD2Gbves.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DQr-m9Yd.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const fetchDashboard = useServerFn(getMyDashboard);
	const cancel = useServerFn(cancelMyBooking);
	const queryClient = useQueryClient();
	const router = useRouter();
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fetchDashboard()
	});
	const cancelMutation = useMutation({
		mutationFn: (id) => cancel({ data: { id } }),
		onSuccess: () => {
			toast.success("Booking cancelled");
			queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			router.invalidate();
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not cancel")
	});
	const upcoming = (data?.bookings ?? []).filter((b) => b.status !== "cancelled" && new Date(b.starts_at).getTime() > Date.now());
	const past = (data?.bookings ?? []).filter((b) => b.status === "cancelled" || new Date(b.starts_at).getTime() <= Date.now());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Devotee portal",
		title: data?.profile?.full_name ? `Namaste, ${data.profile.full_name}` : "My account",
		description: "Your bookings, event registrations and temple notifications."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/services",
					children: "Book a pooja"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					children: "Edit profile"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 text-2xl",
			children: "Upcoming bookings"
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading…"
		}) : upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No upcoming bookings",
			description: "Choose a seva to get started."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: upcoming.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "surface-panel flex flex-wrap items-center gap-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-56 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg",
								children: b.services?.name ?? "Service"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: formatInTimezone(b.starts_at, "UTC", {
									weekday: "short",
									month: "short",
									day: "numeric",
									hour: "numeric",
									minute: "2-digit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: ["Ref ", b.reference]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: b.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-semibold",
							children: formatMoney(b.amount_cents)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: cancelMutation.isPending,
						onClick: () => cancelMutation.mutate(b.id),
						children: "Cancel"
					})
				]
			}, b.id))
		}),
		past.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 mt-12 text-2xl",
			children: "History"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-panel divide-y divide-border/70 p-5",
			children: past.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: b.services?.name ?? "Service"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						formatInTimezone(b.starts_at, "UTC", {
							month: "short",
							day: "numeric",
							year: "numeric"
						}),
						" · Ref ",
						b.reference
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: b.status
				})]
			}, b.id))
		})] }) : null,
		data?.notifications.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 mt-12 text-2xl",
			children: "Notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "surface-panel divide-y divide-border/70 p-5",
			children: data.notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: n.title
				}), n.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: n.body
				}) : null]
			}, n.id))
		})] }) : null
	] })] });
}
//#endregion
export { Dashboard as component };
