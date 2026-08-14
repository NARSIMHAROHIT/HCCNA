import { n as __exportAll, r as __toESM } from "../_runtime.mjs";
import { n as createServerFn, o as __exportAll$1 } from "./server-ClbIPfyi.mjs";
import { l as Slot, m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { F as notFound, M as redirect, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter, y as ClientOnly } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as requireSupabaseAuth } from "./auth-middleware--BG5KyxZ.mjs";
import { h as createSsrRpc, i as booksQuery, l as panchangQuery, m as siteQuery, p as serviceQuery, s as eventQuery, u as priestsQuery } from "./queries-CH7ElXGN.mjs";
import { i as objectType, o as stringType, t as booleanType } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as QueryClientProvider, n as queryOptions, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as supabase } from "./client-B_zZjpbc.mjs";
import { c as Phone, d as MapPin, f as Mail, t as X, u as Menu } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-C_uf36nf.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/community.functions-DGVoQCb8.js
/** Public reads for the donor wall and the temple board. */
var getCommunity = createServerFn({ method: "GET" }).handler(createSsrRpc("b1c01c4a57f5f029ed11393c4b25ab168056f23e25fb6cf9632f7b21c07c3815"));
/** Devotee subscribes to the events newsletter (and optionally volunteering). */
var subscribeNewsletter = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	email: stringType().trim().email().max(255),
	fullName: stringType().trim().max(120).optional(),
	phone: stringType().trim().max(40).optional(),
	wantsVolunteering: booleanType().default(false)
}).parse(input)).handler(createSsrRpc("7297db10bcd83ebb318694d114eec49dd65f3d9dc059a4e8fa1121176fd52957"));
/** Devotee signs up to volunteer for a specific event. */
var volunteerForEvent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	eventId: stringType().uuid(),
	fullName: stringType().trim().max(120).optional(),
	phone: stringType().trim().max(40).optional(),
	rolePreference: stringType().trim().max(120).optional(),
	availability: stringType().trim().max(200).optional(),
	notes: stringType().trim().max(600).optional()
}).parse(input)).handler(createSsrRpc("0f778a4178f4c0fac708e6fa38b508e003e648a5baf69d87ad74eeb573bd782a"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-FwX4_uf4.js
var router_FwX4_uf4_exports = /* @__PURE__ */ __exportAll({
	a: () => Route$16,
	c: () => Route$29,
	d: () => EmptyState,
	f: () => GoldRule,
	g: () => SectionHeading,
	getRouter: () => getRouter,
	h: () => Section,
	i: () => Route$14,
	l: () => Button,
	m: () => Prose,
	n: () => Route$1,
	o: () => Route$21,
	p: () => PageHeader,
	r: () => Route$11,
	s: () => communityQuery,
	t: () => router_exports,
	u: () => DataRow
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DEqRi4aV.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function Section({ children, className, tone = "plain" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("px-4 py-14 sm:px-6 md:py-20", tone === "muted" && "bg-muted/60", tone === "accent" && "bg-accent/40", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-6xl",
			children
		})
	});
}
function SectionHeading({ eyebrow, title, description, align = "left", action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mb-8 flex flex-col gap-3 md:mb-12", align === "center" && "items-center text-center", action && "md:flex-row md:items-end md:justify-between"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("max-w-2xl", align === "center" && "mx-auto"),
			children: [
				eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow mb-2",
					children: eyebrow
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-4xl",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-base text-muted-foreground",
					children: description
				}) : null
			]
		}), action]
	});
}
function GoldRule({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("gold-rule h-px w-full", className),
		"aria-hidden": true
	});
}
function Prose({ html, className }) {
	if (!html) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-4 text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground", className),
		dangerouslySetInnerHTML: { __html: html }
	});
}
function DataRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-right text-sm font-semibold text-foreground",
			children: value
		})]
	});
}
function PageHeader({ eyebrow, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "temple-gradient border-b border-border/70 px-4 py-12 sm:px-6 md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-6xl",
			children: [
				eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow mb-2",
					children: eyebrow
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "max-w-3xl text-4xl md:text-5xl",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-base text-muted-foreground md:text-lg",
					children: description
				}) : null
			]
		})
	});
}
function EmptyState({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-panel px-6 py-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg",
			children: title
		}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: description
		}) : null]
	});
}
function Footer() {
	const { data } = useSuspenseQuery(siteQuery);
	const t = data.temple;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-auto border-t border-border/70 bg-muted/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoldRule, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl",
								children: t.name
							}),
							t.tagline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-sm text-sm text-muted-foreground",
								children: t.tagline
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", {
								className: "mt-5 space-y-2 text-sm not-italic text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
											className: "mt-0.5 size-4 shrink-0",
											"aria-hidden": true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											t.address_line1,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											[
												t.city,
												t.state,
												t.postal_code
											].filter(Boolean).join(", ")
										] })]
									}),
									t.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
											className: "size-4",
											"aria-hidden": true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "hover:text-foreground",
											href: `tel:${t.phone}`,
											children: t.phone
										})]
									}) : null,
									t.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
											className: "size-4",
											"aria-hidden": true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											className: "hover:text-foreground",
											href: `mailto:${t.email}`,
											children: t.email
										})]
									}) : null
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": "Worship",
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 font-semibold",
							children: "Worship"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/timings",
									className: "hover:text-foreground",
									children: "Temple timings"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/services",
									className: "hover:text-foreground",
									children: "Poojas & services"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/priests",
									className: "hover:text-foreground",
									children: "Our priests"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/calendar",
									className: "hover:text-foreground",
									children: "Hindu calendar"
								}) })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": "Community",
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 font-semibold",
							children: "Community"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/events",
									className: "hover:text-foreground",
									children: "Events & festivals"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/library",
									className: "hover:text-foreground",
									children: "Digital library"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/donate",
									className: "hover:text-foreground",
									children: "Donate"
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard",
									className: "hover:text-foreground",
									children: "My account"
								}) })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border/70 px-4 py-5 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-6xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						t.name,
						". All rights reserved."
					] }), t.is_demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Demo content — replace with your temple's own information." }) : null]
				})
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/timings",
		label: "Timings"
	},
	{
		to: "/services",
		label: "Poojas & Services"
	},
	{
		to: "/priests",
		label: "Priests"
	},
	{
		to: "/events",
		label: "Events"
	},
	{
		to: "/calendar",
		label: "Calendar"
	},
	{
		to: "/donors",
		label: "Donors"
	},
	{
		to: "/board",
		label: "Board"
	},
	{
		to: "/library",
		label: "Library"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function Header() {
	const { data } = useSuspenseQuery(siteQuery);
	const [open, setOpen] = (0, import_react.useState)(false);
	const temple = data.temple;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative z-40 border-b border-border/70 bg-background/95 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border/60 px-4 py-5 text-center sm:px-6 md:py-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl leading-tight md:text-5xl",
						children: temple.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg leading-tight md:text-lg",
						children: "  A sarvajan mandir for worship, learning and gathering"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-lg leading-tight md:text-sm",
						children: " प्रज्ञानं ब्रह्म"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground md:text-base",
						children: [temple.city, temple.state].filter(Boolean).join(", ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-3 flex max-w-md items-center justify-center gap-3 text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-primary/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								className: "text-2xl",
								children: "ॐ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-primary/40" })
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl items-center justify-center gap-4 px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Main",
				className: "hidden items-center justify-center gap-1 lg:flex",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "rounded-md px-2.5 py-2 text-sm text-muted-foreground transition hover:bg-accent/60 hover:text-foreground",
					activeProps: { className: "bg-accent/70 text-foreground font-semibold" },
					activeOptions: { exact: item.to === "/" },
					children: item.label
				}, item.to))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "hidden sm:inline-flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/donate",
							children: "Donate"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-24",
						"aria-hidden": true
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								className: "lg:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
									className: "size-5",
									"aria-hidden": true
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "right",
							className: "w-[85vw] sm:w-80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "font-display text-xl",
								children: temple.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								"aria-label": "Mobile",
								className: "mt-6 flex flex-col gap-1",
								children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									onClick: () => setOpen(false),
									className: "rounded-md px-3 py-3 text-base text-foreground transition hover:bg-accent/60",
									activeProps: { className: "bg-accent/70 font-semibold" },
									activeOptions: { exact: item.to === "/" },
									children: item.label
								}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/donate",
									onClick: () => setOpen(false),
									className: "mt-2 rounded-md bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground",
									children: "Donate"
								})]
							})]
						})]
					})
				]
			})]
		})]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$33 = createRootRouteWithContext()({
	loader: ({ context }) => context.queryClient.ensureQueryData(siteQuery),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "theme-color",
				content: "#c2410c"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Marcellus&family=Karla:ital,wght@0,400..700;1,400..700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$33.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [queryClient, router]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$31 = () => import("./routes-Ked8p6Yl.mjs");
var Route$32 = createFileRoute("/")({
	loader: async ({ context }) => {
		await Promise.all([context.queryClient.ensureQueryData(siteQuery), context.queryClient.ensureQueryData(panchangQuery())]);
	},
	head: () => ({ meta: [
		{
			name: "description",
			content: "Daily darshan timings, online pooja booking with our priests, festivals, and the Hindu calendar for our North Alabama temple community."
		},
		{
			property: "og:description",
			content: "Book poojas online, view daily timings and panchang, and join our festivals."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./route-Di7iQBCH.mjs");
var Route$31 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({
			to: "/auth",
			search: { redirect: location.href }
		});
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./about-Uc-pMTks.mjs");
var Route$30 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Our Temple — Hindu Cultural Center of North Alabama" },
		{
			name: "description",
			content: "Our history, mission, and the deities worshipped at the Hindu Cultural Center of North Alabama."
		},
		{
			property: "og:title",
			content: "About Our Temple"
		},
		{
			property: "og:description",
			content: "History, mission and deities of our temple."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./auth-F0cAnT0-.mjs");
var searchSchema = objectType({ redirect: stringType().optional() });
var Route$29 = createFileRoute("/auth")({
	validateSearch: (search) => searchSchema.parse(search),
	head: () => ({ meta: [
		{ title: "Sign In or Create an Account — HCCNA" },
		{
			name: "description",
			content: "Sign in to book poojas, manage your bookings and register for temple events."
		},
		{
			property: "og:title",
			content: "Sign In — HCCNA"
		},
		{
			property: "og:description",
			content: "Sign in to book poojas and manage your temple bookings."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var communityQuery = queryOptions({
	queryKey: ["community"],
	queryFn: () => getCommunity(),
	staleTime: 6e4
});
var $$splitComponentImporter$27 = () => import("./donors-BR0ZIQ72.mjs");
var Route$28 = createFileRoute("/donors")({
	loader: ({ context }) => context.queryClient.ensureQueryData(communityQuery),
	head: () => ({ meta: [
		{ title: "Our Donors & Sponsors — HCCNA" },
		{
			name: "description",
			content: "With gratitude we recognise the devotees and families whose sponsorships sustain daily worship, festivals and temple construction."
		},
		{
			property: "og:title",
			content: "Our Donors & Sponsors"
		},
		{
			property: "og:description",
			content: "Devotees and families sustaining the temple."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./board-Cg-0jmlO.mjs");
var Route$27 = createFileRoute("/board")({
	loader: ({ context }) => context.queryClient.ensureQueryData(communityQuery),
	head: () => ({ meta: [
		{ title: "Board of Trustees & Committee — HCCNA" },
		{
			name: "description",
			content: "Meet the executive committee and board of trustees who serve the Hindu Cultural Center of North Alabama."
		},
		{
			property: "og:title",
			content: "Board of Trustees & Committee"
		},
		{
			property: "og:description",
			content: "The volunteers who serve our temple community."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./calendar-C1Fj_lWq.mjs");
var Route$26 = createFileRoute("/calendar")({
	loader: ({ context }) => context.queryClient.ensureQueryData(panchangQuery()),
	head: () => ({ meta: [
		{ title: "Hindu Calendar & Panchang — HCCNA" },
		{
			name: "description",
			content: "Location-aware Hindu calendar for North Alabama with daily tithi, nakshatra, yoga, sunrise, sunset and Rahu Kalam."
		},
		{
			property: "og:title",
			content: "Hindu Calendar & Panchang"
		},
		{
			property: "og:description",
			content: "Daily tithi, nakshatra, sunrise and Rahu Kalam for our location."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./contact-BbfQDoMZ.mjs");
var Route$25 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact & Directions — HCCNA" },
		{
			name: "description",
			content: "Temple address, phone, email and directions for the Hindu Cultural Center of North Alabama."
		},
		{
			property: "og:title",
			content: "Contact & Directions"
		},
		{
			property: "og:description",
			content: "Address, phone, email and directions to our temple."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./donate-iytasYXD.mjs");
var Route$24 = createFileRoute("/donate")({
	head: () => ({ meta: [
		{ title: "Donate & Support the Temple — HCCNA" },
		{
			name: "description",
			content: "Support daily worship, festivals and temple upkeep with a secure online contribution to our temple."
		},
		{
			property: "og:title",
			content: "Donate & Support the Temple"
		},
		{
			property: "og:description",
			content: "Support daily worship, festivals and temple upkeep."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./library-ByCfutWY.mjs");
var Route$23 = createFileRoute("/library")({
	loader: ({ context }) => context.queryClient.ensureQueryData(booksQuery),
	head: () => ({ meta: [
		{ title: "Digital Library — Scriptures & Bhajans | HCCNA" },
		{
			name: "description",
			content: "Read scriptures, stotras, bhajan collections and study material shared by our temple."
		},
		{
			property: "og:title",
			content: "Digital Library"
		},
		{
			property: "og:description",
			content: "Scriptures, stotras and study material from our temple."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./priests-BS9q0dl2.mjs");
var Route$22 = createFileRoute("/priests")({
	loader: ({ context }) => context.queryClient.ensureQueryData(priestsQuery),
	head: () => ({ meta: [
		{ title: "Our Priests & Availability — HCCNA" },
		{
			name: "description",
			content: "Meet the priests who perform poojas, samskaras and homams at our temple, with their languages, specializations and weekly availability."
		},
		{
			property: "og:title",
			content: "Our Priests & Availability"
		},
		{
			property: "og:description",
			content: "Meet the priests who serve our temple community."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./receipt-BlUgC3QJ.mjs");
var Route$21 = createFileRoute("/receipt")({
	validateSearch: objectType({ session_id: stringType().optional() }),
	head: () => ({ meta: [
		{ title: "Payment Receipt — HCCNA" },
		{
			name: "description",
			content: "View and print the receipt for your pooja sponsorship or donation to the temple."
		},
		{
			property: "og:title",
			content: "Payment Receipt"
		},
		{
			property: "og:description",
			content: "View and print your temple offering receipt."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "robots",
			content: "noindex"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./timings-CV50zhpG.mjs");
var Route$20 = createFileRoute("/timings")({
	head: () => ({ meta: [
		{ title: "Temple Timings & Daily Darshan — HCCNA" },
		{
			name: "description",
			content: "Daily darshan hours, aarti schedule and special day timings at the Hindu Cultural Center of North Alabama."
		},
		{
			property: "og:title",
			content: "Temple Timings & Daily Darshan"
		},
		{
			property: "og:description",
			content: "Daily darshan hours and aarti schedule."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./admin-Cffw1ScN.mjs");
var Route$19 = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./dashboard-CkAGdjh0.mjs");
var Route$18 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "My Temple Account — HCCNA" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./profile-j8pyqH76.mjs");
var Route$17 = createFileRoute("/_authenticated/profile")({
	head: () => ({ meta: [{ title: "My Profile — HCCNA" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./auth.callback-DnzKJgl8.mjs");
var Route$16 = createFileRoute("/auth/callback")({
	ssr: false,
	validateSearch: (search) => objectType({ redirect: stringType().optional() }).parse(search),
	head: () => ({ meta: [{ title: "Signing you in…" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./events.index-BTTWFfnm.mjs");
var Route$15 = createFileRoute("/events/")({
	head: () => ({ meta: [
		{ title: "Events & Festivals — HCCNA" },
		{
			name: "description",
			content: "Upcoming festivals, satsangs, cultural programs and community events at our temple."
		},
		{
			property: "og:title",
			content: "Events & Festivals"
		},
		{
			property: "og:description",
			content: "Upcoming festivals and community events at our temple."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./events._slug-BdahT2kA.mjs");
var Route$14 = createFileRoute("/events/$slug")({
	loader: async ({ context, params }) => {
		const data = await context.queryClient.ensureQueryData(eventQuery(params.slug));
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Event unavailable" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.event.title} — HCCNA`;
		const description = loaderData.event.description?.slice(0, 155) ?? `Join us for ${loaderData.event.title} at our temple.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./pay._slug-vyCoILdD.mjs");
var Route$13 = createFileRoute("/pay/$slug")({
	head: () => ({ meta: [
		{ title: "Sponsor a Pooja — Pay Online | HCCNA" },
		{
			name: "description",
			content: "Sponsor an archana, abhishekam, homam or yearly seva at the temple and pay securely online with a card."
		},
		{
			property: "og:title",
			content: "Sponsor a Pooja — Pay Online"
		},
		{
			property: "og:description",
			content: "Sponsor a seva and pay securely online."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./services.index-CJ5Xw6m6.mjs");
var Route$12 = createFileRoute("/services/")({
	head: () => ({ meta: [
		{ title: "Poojas & Services — Book Online | HCCNA" },
		{
			name: "description",
			content: "Browse archana, abhishekam, homam, samskara and home poojas offered by our priests, and book a conflict-free time online."
		},
		{
			property: "og:title",
			content: "Poojas & Services — Book Online"
		},
		{
			property: "og:description",
			content: "Browse and book poojas with our temple priests."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./services._slug-BJdWXMn7.mjs");
var Route$11 = createFileRoute("/services/$slug")({
	loader: async ({ context, params }) => {
		const data = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
		if (!data) throw notFound();
		return data;
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Service unavailable" }, {
			name: "robots",
			content: "noindex"
		}] };
		const title = `${loaderData.service.name} — Book Online | HCCNA`;
		const description = loaderData.service.short_description ?? `Book ${loaderData.service.name} with our temple priests at a time that suits you.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.index-mIkwuRUR.mjs");
var Route$10 = createFileRoute("/_authenticated/admin/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.audit-wxx6D9mR.mjs");
var Route$9 = createFileRoute("/_authenticated/admin/audit")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.community-cdPPB6C9.mjs");
var Route$8 = createFileRoute("/_authenticated/admin/community")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.events-s0Wmq_Kf.mjs");
var Route$7 = createFileRoute("/_authenticated/admin/events")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.payments-DnfGiUNE.mjs");
var Route$6 = createFileRoute("/_authenticated/admin/payments")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.people-D3q_qV5S.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/people")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.poojas-Cs9PDKnu.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/poojas")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.temple-jKfp3Fsn.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/temple")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.timings-DltiUP9K.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/timings")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./book._slug-Cuwck5X4.mjs");
var Route$1 = createFileRoute("/_authenticated/book/$slug")({
	head: () => ({ meta: [{ title: "Book a Pooja — HCCNA" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route = createFileRoute("/api/public/webhooks/stripe")({ server: { handlers: { POST: async ({ request }) => {
	const secret = processModule.env["STRIPE_SECRET_KEY"];
	const webhookSecret = processModule.env["STRIPE_WEBHOOK_SECRET"];
	if (!secret || !webhookSecret) return new Response("Stripe is not configured", { status: 503 });
	const signature = request.headers.get("stripe-signature");
	if (!signature) return new Response("Missing signature", { status: 401 });
	const body = await request.text();
	const Stripe = (await import("../_libs/stripe.mjs").then((n) => n.t)).default;
	const stripe = new Stripe(secret, { httpClient: Stripe.createFetchHttpClient() });
	let event;
	try {
		event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
	} catch {
		return new Response("Invalid signature", { status: 401 });
	}
	if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
		const session = event.data.object;
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		await supabaseAdmin.from("payments").update({
			status: session.payment_status === "paid" ? "paid" : "pending",
			paid_at: session.payment_status === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : null,
			stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null
		}).eq("stripe_session_id", session.id);
	}
	if (event.type === "checkout.session.expired") {
		const session = event.data.object;
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		await supabaseAdmin.from("payments").update({ status: "unpaid" }).eq("stripe_session_id", session.id);
	}
	return new Response("ok");
} } } });
var IndexRoute = Route$32.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$33
});
var AuthenticatedRouteRoute = Route$31.update({
	id: "/_authenticated",
	getParentRoute: () => Route$33
});
var AboutRoute = Route$30.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$33
});
var AuthRoute = Route$29.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$33
});
var BoardRoute = Route$27.update({
	id: "/board",
	path: "/board",
	getParentRoute: () => Route$33
});
var CalendarRoute = Route$26.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => Route$33
});
var ContactRoute = Route$25.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$33
});
var DonateRoute = Route$24.update({
	id: "/donate",
	path: "/donate",
	getParentRoute: () => Route$33
});
var DonorsRoute = Route$28.update({
	id: "/donors",
	path: "/donors",
	getParentRoute: () => Route$33
});
var LibraryRoute = Route$23.update({
	id: "/library",
	path: "/library",
	getParentRoute: () => Route$33
});
var PriestsRoute = Route$22.update({
	id: "/priests",
	path: "/priests",
	getParentRoute: () => Route$33
});
var ReceiptRoute = Route$21.update({
	id: "/receipt",
	path: "/receipt",
	getParentRoute: () => Route$33
});
var TimingsRoute = Route$20.update({
	id: "/timings",
	path: "/timings",
	getParentRoute: () => Route$33
});
var AuthenticatedAdminRoute = Route$19.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$18.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$17.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthCallbackRoute = Route$16.update({
	id: "/callback",
	path: "/callback",
	getParentRoute: () => AuthRoute
});
var EventsIndexRoute = Route$15.update({
	id: "/events/",
	path: "/events/",
	getParentRoute: () => Route$33
});
var EventsSlugRoute = Route$14.update({
	id: "/events/$slug",
	path: "/events/$slug",
	getParentRoute: () => Route$33
});
var PaySlugRoute = Route$13.update({
	id: "/pay/$slug",
	path: "/pay/$slug",
	getParentRoute: () => Route$33
});
var ServicesIndexRoute = Route$12.update({
	id: "/services/",
	path: "/services/",
	getParentRoute: () => Route$33
});
var ServicesSlugRoute = Route$11.update({
	id: "/services/$slug",
	path: "/services/$slug",
	getParentRoute: () => Route$33
});
var AuthenticatedAdminIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminAuditRoute = Route$9.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminCommunityRoute = Route$8.update({
	id: "/community",
	path: "/community",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminEventsRoute = Route$7.update({
	id: "/events",
	path: "/events",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminPaymentsRoute = Route$6.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminPeopleRoute = Route$5.update({
	id: "/people",
	path: "/people",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminPoojasRoute = Route$4.update({
	id: "/poojas",
	path: "/poojas",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminTempleRoute = Route$3.update({
	id: "/temple",
	path: "/temple",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminTimingsRoute = Route$2.update({
	id: "/timings",
	path: "/timings",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedBookSlugRoute = Route$1.update({
	id: "/book/$slug",
	path: "/book/$slug",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiPublicWebhooksStripeRoute = Route.update({
	id: "/api/public/webhooks/stripe",
	path: "/api/public/webhooks/stripe",
	getParentRoute: () => Route$33
});
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminAuditRoute,
	AuthenticatedAdminCommunityRoute,
	AuthenticatedAdminEventsRoute,
	AuthenticatedAdminPaymentsRoute,
	AuthenticatedAdminPeopleRoute,
	AuthenticatedAdminPoojasRoute,
	AuthenticatedAdminTempleRoute,
	AuthenticatedAdminTimingsRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute: AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren),
	AuthenticatedDashboardRoute,
	AuthenticatedProfileRoute,
	AuthenticatedBookSlugRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var AuthRouteChildren = { AuthCallbackRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	AboutRoute,
	AuthRoute: AuthRoute._addFileChildren(AuthRouteChildren),
	BoardRoute,
	CalendarRoute,
	ContactRoute,
	DonateRoute,
	DonorsRoute,
	LibraryRoute,
	PriestsRoute,
	ReceiptRoute,
	TimingsRoute,
	EventsSlugRoute,
	PaySlugRoute,
	ServicesSlugRoute,
	EventsIndexRoute,
	ServicesIndexRoute,
	ApiPublicWebhooksStripeRoute
};
var routeTree = Route$33._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { subscribeNewsletter as _, PageHeader as a, Route$11 as c, Route$21 as d, Route$29 as f, router_FwX4_uf4_exports as g, communityQuery as h, GoldRule as i, Route$14 as l, SectionHeading as m, DataRow as n, Prose as o, Section as p, EmptyState as r, Route$1 as s, Button as t, Route$16 as u, volunteerForEvent as v, cn as y };
