import { n as __exportAll$1, r as __toESM } from "../_runtime.mjs";
import { n as toResponse, t as H3Event } from "../_libs/h3-v2+rou3+srvx.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as recordType, i as objectType, n as enumType, o as stringType, r as numberType, s as unknownType, t as booleanType } from "../_libs/zod.mjs";
import { m as require_react, p as require_jsx_runtime, u as Slot } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { A as _getRenderedMatches, B as rootRouteId, D as getStylesheetHref, E as getScriptPreloadAttrs, H as notFound, I as isRedirect, L as isResolvedRedirect, M as invariant, O as resolveManifestAssetLink, R as parseRedirect, V as isNotFound, _ as Link, a as isSsrResponse, b as useRouter, c as stripSsrResponseBody, d as RouterProvider, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, i as disposeSsrResponseDetached, j as executeRewriteInput, k as resolveManifestCssLink, l as Scripts, m as lazyRouteComponent, n as bindSsrResponseToRequest, o as normalizeSsrResponse, p as Outlet, r as defineHandlerCallback, s as replaceSsrResponse, t as renderRouterToStream, u as HeadContent, x as ClientOnly, z as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createMemoryHistory } from "../_libs/tanstack__history.mjs";
import { a as getOrigin, c as createSerializationAdapter, d as toCrossJSONAsync, f as toCrossJSONStream, i as getNormalizedURL, l as makeSerovalPlugin, n as mergeHeaders, o as defaultSerovalPlugins, r as attachRouterServerSsrUtils, s as createRawStreamRPCPlugin, t as waitForRequest, u as fromJSON } from "../_libs/@tanstack/router-core+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { a as QueryClientProvider, n as queryOptions, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { c as Phone, d as MapPin, f as Mail, t as X, u as Menu } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { i as createMiddleware, n as supabase, r as createCsrfMiddleware } from "./server-Cc0YOX7k.mjs";
import processModule from "node:process";
import { AsyncLocalStorage } from "node:async_hooks";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-C_uf36nf.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/auth-middleware-zu0UBCWp.js
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const SUPABASE_URL = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SUPABASE_URL"];
	const SUPABASE_PUBLISHABLE_KEY = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_SUPABASE_PUBLISHABLE_KEY"];
	if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_PUBLISHABLE_KEY ? ["SUPABASE_PUBLISHABLE_KEY"] : []].join(", ")}. Connect Supabase in Lovable Cloud.`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	const authHeader = request.headers.get("authorization");
	if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
	if (!authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Only Bearer tokens are supported");
	const token = authHeader.replace("Bearer ", "");
	if (!token) throw new Error("Unauthorized: No token provided");
	if (token.split(".").length !== 3) throw new Error("Unauthorized: Invalid token");
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: {
			fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
			headers: { Authorization: `Bearer ${token}` }
		},
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data, error } = await supabase.auth.getClaims(token);
	if (error || !data?.claims) throw new Error("Unauthorized: Invalid token");
	if (!data.claims.sub) throw new Error("Unauthorized: No user ID found in token");
	return next({ context: {
		supabase,
		userId: data.claims.sub,
		claims: data.claims
	} });
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-CMFpIqNz.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/community.functions-B7aIEM9-.js
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
//#region node_modules/.nitro/vite/services/ssr/assets/router-irsN6Xvb.js
var router_irsN6Xvb_exports = /* @__PURE__ */ __exportAll$1({
	_: () => SectionHeading,
	a: () => Route$16,
	c: () => Route$29,
	d: () => DataRow,
	f: () => EmptyState,
	g: () => Section,
	getRouter: () => getRouter,
	h: () => Prose,
	i: () => Route$14,
	l: () => logo_exports,
	m: () => PageHeader,
	n: () => Route$1,
	o: () => Route$21,
	p: () => GoldRule,
	r: () => Route$11,
	s: () => communityQuery,
	t: () => router_exports,
	u: () => Button,
	v: () => __exportAll
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-CBfKybkm.css";
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
var logo_exports = /* @__PURE__ */ __exportAll({ default: () => logo_default });
var logo_default = "/assets/logo-BIGLHuYX.jpg";
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo_default,
						alt: "Hindu Cultural Center logo",
						className: "size-20 shrink-0 object-contain sm:size-24 md:size-28"
					}),
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
var $$splitComponentImporter$31 = () => import("./routes-6CQ8g5L8.mjs");
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
var $$splitComponentImporter$29 = () => import("./about-B0alB8m7.mjs");
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
var $$splitComponentImporter$28 = () => import("./auth-C2gCep5r.mjs");
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
var $$splitComponentImporter$27 = () => import("./donors-DkhskK4P.mjs");
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
var $$splitComponentImporter$26 = () => import("./board-Cw1xImOS.mjs");
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
var $$splitComponentImporter$25 = () => import("./calendar-uN7umuWd.mjs");
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
var $$splitComponentImporter$24 = () => import("./contact-Br7E2pRN.mjs");
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
var $$splitComponentImporter$23 = () => import("./donate-DaXihJ7W.mjs");
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
var $$splitComponentImporter$22 = () => import("./library-DCJ9d-cH.mjs");
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
var $$splitComponentImporter$21 = () => import("./priests-BMg3X9GE.mjs");
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
var $$splitComponentImporter$20 = () => import("./receipt-DURTCRg3.mjs");
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
var $$splitComponentImporter$19 = () => import("./timings-COD2hK8r.mjs");
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
var $$splitComponentImporter$18 = () => import("./admin-NgH-EGS0.mjs");
var Route$19 = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./dashboard-DQr-m9Yd.mjs");
var Route$18 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "My Temple Account — HCCNA" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./profile-WKvGoDHg.mjs");
var Route$17 = createFileRoute("/_authenticated/profile")({
	head: () => ({ meta: [{ title: "My Profile — HCCNA" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./auth.callback-CmrLV48r.mjs");
var Route$16 = createFileRoute("/auth/callback")({
	ssr: false,
	validateSearch: (search) => objectType({ redirect: stringType().optional() }).parse(search),
	head: () => ({ meta: [{ title: "Signing you in…" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./events.index-DRk5jGbZ.mjs");
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
var $$splitComponentImporter$13 = () => import("./events._slug-DQ9oGeYs.mjs");
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
var $$splitComponentImporter$12 = () => import("./pay._slug-ClL8o9jJ.mjs");
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
var $$splitComponentImporter$11 = () => import("./services.index-Dn9B9RqJ.mjs");
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
var $$splitComponentImporter$10 = () => import("./services._slug-CFdLj6JU.mjs");
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
var $$splitComponentImporter$9 = () => import("./admin.index-DgS6d1N8.mjs");
var Route$10 = createFileRoute("/_authenticated/admin/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.audit-C9FBB46e.mjs");
var Route$9 = createFileRoute("/_authenticated/admin/audit")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.community-Bna2z3FN.mjs");
var Route$8 = createFileRoute("/_authenticated/admin/community")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.events-DC7zT2Vg.mjs");
var Route$7 = createFileRoute("/_authenticated/admin/events")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./admin.payments-CkVukljm.mjs");
var Route$6 = createFileRoute("/_authenticated/admin/payments")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin.people-CamhsBhh.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/people")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.poojas-CHUifqgW.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/poojas")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.temple-DsKByWwA.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/temple")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.timings-D5uU4O3O.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/timings")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./book._slug-CIZcEvoc.mjs");
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
		const { supabaseAdmin } = await import("./client.server-DXw68B2-.mjs");
		await supabaseAdmin.from("payments").update({
			status: session.payment_status === "paid" ? "paid" : "pending",
			paid_at: session.payment_status === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : null,
			stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null
		}).eq("stripe_session_id", session.id);
	}
	if (event.type === "checkout.session.expired") {
		const session = event.data.object;
		const { supabaseAdmin } = await import("./client.server-DXw68B2-.mjs");
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
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
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
//#region node_modules/.nitro/vite/services/ssr/assets/server-Cc0YOX7k.js
function StartServer(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
	request,
	router,
	responseHeaders,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
	return typeof value.then === "function";
}
function getSetCookieValues(headers) {
	const headersWithSetCookie = headers;
	if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
	const value = headers.get("set-cookie");
	return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
	if (response.ok) return;
	const eventSetCookies = getSetCookieValues(event.res.headers);
	if (eventSetCookies.length === 0) return;
	const responseSetCookies = getSetCookieValues(response.headers);
	response.headers.delete("set-cookie");
	for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
	for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
	if (isPromiseLike(value)) return value.then((resolved) => {
		if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
		return resolved;
	});
	if (value instanceof Response) mergeEventResponseHeaders(value, event);
	return value;
}
function requestHandler(handler) {
	return (request, requestOpts) => {
		let h3Event;
		try {
			h3Event = new H3Event(request);
		} catch (error) {
			if (error instanceof URIError) return new Response(null, {
				status: 400,
				statusText: "Bad Request"
			});
			throw error;
		}
		return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
	};
}
function getH3Event() {
	const event = eventStorage.getStore();
	if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return event.h3Event;
}
function getRequest() {
	return getH3Event().req;
}
function getResponse() {
	return getH3Event().res;
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
/**
* @description Returns the router manifest data that should be sent to the client.
* This includes only the assets and preloads for the current route and any
* special assets that are needed for the client. It does not include relationships
* between routes or any other data that is not needed for the client.
*
* @param matchedRoutes - In dev mode, the matched routes are used to build
* the dev styles URL for route-scoped CSS collection.
*/
async function getStartManifest(matchedRoutes) {
	const { tsrStartManifest } = await import("../_tanstack-start-manifest_v-DvEZ7DiH.mjs");
	const startManifest = tsrStartManifest();
	let routes = startManifest.routes;
	routes[rootRouteId];
	const manifestRoutes = {};
	for (const k in routes) {
		const v = routes[k];
		const result = {};
		if (v.preloads && v.preloads.length > 0) result.preloads = v.preloads;
		if (v.scripts && v.scripts.length > 0) result.scripts = v.scripts;
		if (v.css?.length) result.css = v.css;
		if (result.preloads || result.scripts || result.css) manifestRoutes[k] = result;
	}
	return {
		...startManifest.scriptFormat ? { scriptFormat: startManifest.scriptFormat } : {},
		...startManifest.inlineCss ? { inlineCss: startManifest.inlineCss } : {},
		routes: manifestRoutes
	};
}
var manifest = {
	"02a72433e0a55d8d57e9bc21101895dbde29de4697d0be53cf5a1d07b0467de1": {
		functionName: "getServiceAvailability_createServerFn_handler",
		importer: () => import("./booking.functions-C2GxdKTQ.mjs")
	},
	"06e0572fac90316a37f1b88d6cb83786d8a44f92579a42e2a91a7f7f3f158af7": {
		functionName: "revokeAdmin_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"0b1fda76698d818c183c739e627db859295b336dbf95ea3fe75f3349ecf2d146": {
		functionName: "getMyDashboard_createServerFn_handler",
		importer: () => import("./booking.functions-C2GxdKTQ.mjs")
	},
	"0f1837f395f4bb48539777c2bbb6472ccf9a55c7f793455b67f68354476c518e": {
		functionName: "getAdminData_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"0f778a4178f4c0fac708e6fa38b508e003e648a5baf69d87ad74eeb573bd782a": {
		functionName: "volunteerForEvent_createServerFn_handler",
		importer: () => import("./community.functions-qFq4uoTa.mjs")
	},
	"2f695832197dfa0cbc14c4031bc614cf181ed185713317040ffc624ee7876dd0": {
		functionName: "getAuditLog_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"3d6080b78469ffc041c89ca44cd410f4207ca8b416dcfc63d887ddecba08f3cb": {
		functionName: "updateMyProfile_createServerFn_handler",
		importer: () => import("./booking.functions-C2GxdKTQ.mjs")
	},
	"4b6e7e6681041490dc067e5a74efeeaa2c3dacb936f370cf20cace5f206f6a8d": {
		functionName: "saveRecord_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"4f4fe79369cdbaab809e1634b08eb4f24cf905460298401ad068975fa0940060": {
		functionName: "getAdminPeople_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"56e0c992f75cb6547c2002a531f942e92547cc300b3d83a4e7b7e9b61fb46703": {
		functionName: "deleteRecord_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"5cb16491917ea8b575f71b091116354822abf5deb496dc36b4d6c8f381532695": {
		functionName: "getEventBySlug_createServerFn_handler",
		importer: () => import("./temple.functions-DS9-S5ii.mjs")
	},
	"689f0deed877e52244f2a47094664945725467a3a3495a8f6eda091e3e100c25": {
		functionName: "getPriestDirectory_createServerFn_handler",
		importer: () => import("./temple.functions-DS9-S5ii.mjs")
	},
	"6a7ec55dccf58578ec1151345d4cfa48d264c5c49a0e3a18d8c48a3efd623d5d": {
		functionName: "cancelMyBooking_createServerFn_handler",
		importer: () => import("./booking.functions-C2GxdKTQ.mjs")
	},
	"7297db10bcd83ebb318694d114eec49dd65f3d9dc059a4e8fa1121176fd52957": {
		functionName: "subscribeNewsletter_createServerFn_handler",
		importer: () => import("./community.functions-qFq4uoTa.mjs")
	},
	"72d8957e8d6790aa0bcd06f5285d49a32dd6fca2ccb1d1f33fa73c33a9390c90": {
		functionName: "getSiteData_createServerFn_handler",
		importer: () => import("./temple.functions-DS9-S5ii.mjs")
	},
	"7f3bd8faf821df2e129c56673194fcd6849e1cf8938225a6d74d2bc45f75eea8": {
		functionName: "grantAdmin_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"898f3aed07f078ebce84ad3a4b9af700ee6a1002e7ee68101a9b9f2e337f8a48": {
		functionName: "markNotificationsRead_createServerFn_handler",
		importer: () => import("./booking.functions-C2GxdKTQ.mjs")
	},
	"8d90df718b6b950670a8fae00bb6889afb9043ac31a934f466dfa4b6c4218f3c": {
		functionName: "getBooks_createServerFn_handler",
		importer: () => import("./temple.functions-DS9-S5ii.mjs")
	},
	"914cf93375092dbc15d00113a910b5961bab889590ca7b711696b9991df91a71": {
		functionName: "createPaymentCheckout_createServerFn_handler",
		importer: () => import("./payments.functions-PovtkFbT.mjs")
	},
	"ae5e4e0b556a82599c8d6ce5e2c7f800ce5b87b941d3d661f975ad05f4cf4201": {
		functionName: "getReceipt_createServerFn_handler",
		importer: () => import("./payments.functions-PovtkFbT.mjs")
	},
	"b1c01c4a57f5f029ed11393c4b25ab168056f23e25fb6cf9632f7b21c07c3815": {
		functionName: "getCommunity_createServerFn_handler",
		importer: () => import("./community.functions-qFq4uoTa.mjs")
	},
	"ba60d7b579517ba9bda7d09d68fa419818a13ab41cce633bd3d7424fce172fba": {
		functionName: "getPanchang_createServerFn_handler",
		importer: () => import("./temple.functions-DS9-S5ii.mjs")
	},
	"d5d1516df3b15f9b01e23ed40cda22b58728aafe46e1ea4dd526f9df75ede78c": {
		functionName: "createBooking_createServerFn_handler",
		importer: () => import("./booking.functions-C2GxdKTQ.mjs")
	},
	"d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c": {
		functionName: "claimFirstAdmin_createServerFn_handler",
		importer: () => import("./admin.functions-BPhKu1IY.mjs")
	},
	"f297149a15375fe3d3589bc6760fa1814ab6b3ed0728e6bcc05aabe2fbfdd47f": {
		functionName: "registerForEvent_createServerFn_handler",
		importer: () => import("./booking.functions-C2GxdKTQ.mjs")
	},
	"f5bb228111b3dc986131eba8cf88cebb61b23aaa5a7d002240452e9743de7d4a": {
		functionName: "getServiceBySlug_createServerFn_handler",
		importer: () => import("./temple.functions-DS9-S5ii.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
/** Content-Type for multiplexed framed responses (RawStream support) */
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
/**
* Frame types for binary multiplexing protocol.
*/
var FrameType = {
	/** Seroval JSON chunk (NDJSON line) */
	JSON: 0,
	/** Raw stream data chunk */
	CHUNK: 1,
	/** Raw stream end (EOF) */
	END: 2,
	/** Raw stream error */
	ERROR: 3
};
/** Full Content-Type header value with version parameter */
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
function isSafeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Merge target and source into a new null-proto object, filtering dangerous keys.
*/
function safeObjectMerge(target, source) {
	const result = Object.create(null);
	if (target) {
		for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
	}
	if (source && typeof source === "object") {
		for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
	}
	return result;
}
/**
* Create a null-prototype object, optionally copying from source.
*/
function createNullProtoObject(source) {
	if (!source) return Object.create(null);
	const obj = Object.create(null);
	for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
	return obj;
}
var GLOBAL_STORAGE_KEY = Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
	return startStorage.run(context, fn);
}
function getStartContext(opts) {
	const context = startStorage.getStore();
	if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
	return context;
}
var getStartOptions = () => getStartContext().startOptions;
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
	const resolvedOptions = __opts || options || {};
	if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
	const setValidator = (validator) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			validator,
			inputValidator: validator
		});
	};
	const res = {
		options: resolvedOptions,
		middleware: (middleware) => {
			const newMiddleware = [...resolvedOptions.middleware || []];
			middleware.map((m) => {
				if (TSS_SERVER_FUNCTION_FACTORY in m) {
					if (m.options.middleware) newMiddleware.push(...m.options.middleware);
				} else newMiddleware.push(m);
			});
			const res = createServerFn(void 0, {
				...resolvedOptions,
				middleware: newMiddleware
			});
			res[TSS_SERVER_FUNCTION_FACTORY] = true;
			return res;
		},
		validator: setValidator,
		inputValidator: setValidator,
		handler: (...args) => {
			const [extractedFn, serverFn] = args;
			const newOptions = {
				...resolvedOptions,
				extractedFn,
				serverFn
			};
			const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
			extractedFn.method = resolvedOptions.method;
			return Object.assign(async (opts) => {
				const result = await executeMiddleware$1(resolvedMiddleware, "client", {
					...extractedFn,
					...newOptions,
					data: opts?.data,
					headers: opts?.headers,
					signal: opts?.signal,
					fetch: opts?.fetch,
					context: createNullProtoObject()
				});
				const redirect = parseRedirect(result.error);
				if (redirect) throw redirect;
				if (result.error) throw result.error;
				return result.result;
			}, {
				...extractedFn,
				method: resolvedOptions.method,
				__executeServer: async (opts) => {
					const startContext = getStartContextServerOnly();
					const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
					return await executeMiddleware$1(resolvedMiddleware, "server", {
						...extractedFn,
						...opts,
						serverFnMeta: extractedFn.serverFnMeta,
						context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
						request: startContext.request
					}).then((d) => ({
						result: d.result,
						error: d.error,
						context: d.sendContext
					}));
				}
			});
		}
	};
	const fun = (options) => {
		return createServerFn(void 0, {
			...resolvedOptions,
			...options
		});
	};
	return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
	let flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
	if (env === "server") {
		const startContext = getStartContextServerOnly({ throwIfNotFound: false });
		if (startContext?.executedRequestMiddlewares) flattenedMiddlewares = flattenedMiddlewares.filter((m) => !startContext.executedRequestMiddlewares.has(m));
	}
	const callNextMiddleware = async (ctx) => {
		const nextMiddleware = flattenedMiddlewares.shift();
		if (!nextMiddleware) return ctx;
		try {
			let validator = "validator" in nextMiddleware.options ? nextMiddleware.options.validator : void 0;
			if (!validator && "inputValidator" in nextMiddleware.options) validator = nextMiddleware.options.inputValidator;
			if (validator && env === "server") ctx.data = await execValidator(validator, ctx.data);
			let middlewareFn = void 0;
			if (env === "client") {
				if ("client" in nextMiddleware.options) middlewareFn = nextMiddleware.options.client;
			} else if ("server" in nextMiddleware.options) middlewareFn = nextMiddleware.options.server;
			if (middlewareFn) {
				const userNext = async (userCtx = {}) => {
					const result = await callNextMiddleware({
						...ctx,
						...userCtx,
						context: safeObjectMerge(ctx.context, userCtx.context),
						sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
						headers: mergeHeaders(ctx.headers, userCtx.headers),
						_callSiteFetch: ctx._callSiteFetch,
						fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
						result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
						error: userCtx.error ?? ctx.error
					});
					if (result.error) throw result.error;
					return result;
				};
				const result = await middlewareFn({
					...ctx,
					next: userNext
				});
				if (isRedirect(result)) return {
					...ctx,
					error: result
				};
				if (result instanceof Response) return {
					...ctx,
					result
				};
				if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
				return result;
			}
			return callNextMiddleware(ctx);
		} catch (error) {
			return {
				...ctx,
				error
			};
		}
	};
	return callNextMiddleware({
		...opts,
		headers: opts.headers || {},
		sendContext: opts.sendContext || {},
		context: opts.context || createNullProtoObject(),
		_callSiteFetch: opts.fetch
	});
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
	const seen = /* @__PURE__ */ new Set();
	const flattened = [];
	const recurse = (middleware, depth) => {
		if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
		middleware.forEach((m) => {
			if (m.options.middleware) recurse(m.options.middleware, depth + 1);
			if (!seen.has(m)) {
				seen.add(m);
				flattened.push(m);
			}
		});
	};
	recurse(middlewares, 0);
	return flattened;
}
async function execValidator(validator, input) {
	if (validator == null) return {};
	if ("~standard" in validator) {
		const result = await validator["~standard"].validate(input);
		if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
		return result.value;
	}
	if ("parse" in validator) return validator.parse(input);
	if (typeof validator === "function") return validator(input);
	throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
	return {
		"~types": void 0,
		options: {
			inputValidator: options.validator ?? options.inputValidator,
			client: async ({ next, sendContext, fetch, ...ctx }) => {
				const payload = {
					...ctx,
					context: sendContext,
					fetch
				};
				return next(await options.extractedFn?.(payload));
			},
			server: async ({ next, ...ctx }) => {
				const result = await options.serverFn?.(ctx);
				return next({
					...ctx,
					result
				});
			}
		}
	};
}
function getDefaultSerovalPlugins() {
	return [...(getStartOptions()?.serializationAdapters)?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
/**
* Binary frame protocol for multiplexing JSON and raw streams over HTTP.
*
* Frame format: [type:1][streamId:4][length:4][payload:length]
* - type: 1 byte - frame type (JSON, CHUNK, END, ERROR)
* - streamId: 4 bytes big-endian uint32 - stream identifier
* - length: 4 bytes big-endian uint32 - payload length
* - payload: variable length bytes
*/
/** Cached TextEncoder for frame encoding */
var textEncoder = new TextEncoder();
/** Shared empty payload for END frames - avoids allocation per call */
var EMPTY_PAYLOAD = /* @__PURE__ */ new Uint8Array(0);
/**
* Encodes a single frame with header and payload.
*/
function encodeFrame(type, streamId, payload) {
	const frame = new Uint8Array(9 + payload.length);
	frame[0] = type;
	frame[1] = streamId >>> 24 & 255;
	frame[2] = streamId >>> 16 & 255;
	frame[3] = streamId >>> 8 & 255;
	frame[4] = streamId & 255;
	frame[5] = payload.length >>> 24 & 255;
	frame[6] = payload.length >>> 16 & 255;
	frame[7] = payload.length >>> 8 & 255;
	frame[8] = payload.length & 255;
	frame.set(payload, 9);
	return frame;
}
/**
* Encodes a JSON frame (type 0, streamId 0).
*/
function encodeJSONFrame(json) {
	return encodeFrame(FrameType.JSON, 0, textEncoder.encode(json));
}
/**
* Encodes a raw stream chunk frame.
*/
function encodeChunkFrame(streamId, chunk) {
	return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
/**
* Encodes a raw stream end frame.
*/
function encodeEndFrame(streamId) {
	return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
/**
* Encodes a raw stream error frame.
*/
function encodeErrorFrame(streamId, error) {
	const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
	return encodeFrame(FrameType.ERROR, streamId, textEncoder.encode(message));
}
/**
* Creates a multiplexed ReadableStream from JSON stream and raw streams.
*
* The JSON stream emits NDJSON lines (from seroval's toCrossJSONStream).
* Raw streams are pumped concurrently, interleaved with JSON frames.
*
* Supports late stream registration for RawStreams discovered after initial
* serialization (e.g., from resolved Promises).
*
* @param jsonStream Stream of JSON strings (each string is one NDJSON line)
* @param rawStreams Map of stream IDs to raw binary streams (known at start)
* @param lateStreamSource Optional stream of late registrations for streams discovered later
*/
function createMultiplexedStream(jsonStream, rawStreams, lateStreamSource) {
	let controller;
	let cancelled = false;
	const readers = [];
	const enqueue = (frame) => {
		if (cancelled) return false;
		try {
			controller.enqueue(frame);
			return true;
		} catch {
			return false;
		}
	};
	const errorOutput = (error) => {
		if (cancelled) return;
		cancelled = true;
		try {
			controller.error(error);
		} catch {}
		for (const reader of readers) reader.cancel().catch(() => {});
	};
	async function pumpRawStream(streamId, stream) {
		const reader = stream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) {
					enqueue(encodeEndFrame(streamId));
					return;
				}
				if (!enqueue(encodeChunkFrame(streamId, value))) return;
			}
		} catch (error) {
			enqueue(encodeErrorFrame(streamId, error));
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpJSON() {
		const reader = jsonStream.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) return;
				if (!enqueue(encodeJSONFrame(value))) return;
			}
		} catch (error) {
			errorOutput(error);
			throw error;
		} finally {
			reader.releaseLock();
		}
	}
	async function pumpLateStreams() {
		if (!lateStreamSource) return [];
		const lateStreamPumps = [];
		const reader = lateStreamSource.getReader();
		readers.push(reader);
		try {
			while (!cancelled) {
				const { done, value } = await reader.read();
				if (done) break;
				lateStreamPumps.push(pumpRawStream(value.id, value.stream));
			}
		} finally {
			reader.releaseLock();
		}
		return lateStreamPumps;
	}
	return new ReadableStream({
		async start(ctrl) {
			controller = ctrl;
			const pumps = [pumpJSON()];
			for (const [streamId, stream] of rawStreams) pumps.push(pumpRawStream(streamId, stream));
			if (lateStreamSource) pumps.push(pumpLateStreams());
			try {
				const latePumps = (await Promise.all(pumps)).find(Array.isArray);
				if (latePumps && latePumps.length > 0) await Promise.all(latePumps);
				if (!cancelled) try {
					controller.close();
				} catch {}
			} catch {}
		},
		cancel() {
			cancelled = true;
			for (const reader of readers) reader.cancel().catch(() => {});
			readers.length = 0;
		}
	});
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var handleServerAction = async ({ request, context, serverFnId }) => {
	const methodUpper = request.method.toUpperCase();
	const url = new URL(request.url);
	const action = await getServerFnById(serverFnId, { origin: "client" });
	if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
		status: 405,
		headers: { Allow: action.method }
	});
	const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
	if (!serovalPlugins) serovalPlugins = getDefaultSerovalPlugins();
	const contentType = request.headers.get("Content-Type");
	function parsePayload(payload) {
		return fromJSON(payload, { plugins: serovalPlugins });
	}
	return await (async () => {
		try {
			let res = await (async () => {
				if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
					if (methodUpper === "GET") invariant();
					const formData = await request.formData();
					const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
					formData.delete(TSS_FORMDATA_CONTEXT);
					const params = {
						context,
						data: formData,
						method: methodUpper
					};
					if (typeof serializedContext === "string") try {
						const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
						if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
					} catch (e) {}
					return await action(params);
				}
				if (methodUpper === "GET") {
					const payloadParam = url.searchParams.get("payload");
					if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
					const payload = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
					payload.context = safeObjectMerge(payload.context, context);
					payload.method = methodUpper;
					return await action(payload);
				}
				let jsonPayload;
				if (contentType?.includes("application/json")) jsonPayload = await request.json();
				const payload = jsonPayload ? parsePayload(jsonPayload) : {};
				payload.context = safeObjectMerge(payload.context, context);
				payload.method = methodUpper;
				return await action(payload);
			})();
			const unwrapped = res.result || res.error;
			if (isNotFound(res)) res = isNotFoundResponse(res);
			if (!isServerFn) return unwrapped;
			if (unwrapped instanceof Response) {
				if (isRedirect(unwrapped)) return unwrapped;
				unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
				return unwrapped;
			}
			return serializeResult(res);
			function serializeResult(res) {
				let nonStreamingBody = void 0;
				const alsResponse = getResponse();
				if (res !== void 0) {
					const rawStreams = /* @__PURE__ */ new Map();
					let initialPhase = true;
					let lateStreamWriter;
					let lateStreamReadable = void 0;
					const pendingLateStreams = [];
					const plugins = [createRawStreamRPCPlugin((id, stream) => {
						if (initialPhase) {
							rawStreams.set(id, stream);
							return;
						}
						if (lateStreamWriter) {
							lateStreamWriter.write({
								id,
								stream
							}).catch(() => {});
							return;
						}
						pendingLateStreams.push({
							id,
							stream
						});
					}), ...serovalPlugins || []];
					let done = false;
					const callbacks = {
						onParse: (value) => {
							nonStreamingBody = value;
						},
						onDone: () => {
							done = true;
						},
						onError: (error) => {
							throw error;
						}
					};
					toCrossJSONStream(res, {
						refs: /* @__PURE__ */ new Map(),
						plugins,
						onParse(value) {
							callbacks.onParse(value);
						},
						onDone() {
							callbacks.onDone();
						},
						onError: (error) => {
							callbacks.onError(error);
						}
					});
					initialPhase = false;
					if (done && rawStreams.size === 0) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": "application/json",
							[X_TSS_SERIALIZED]: "true"
						}
					});
					const { readable, writable } = new TransformStream();
					lateStreamReadable = readable;
					lateStreamWriter = writable.getWriter();
					for (const registration of pendingLateStreams) lateStreamWriter.write(registration).catch(() => {});
					pendingLateStreams.length = 0;
					const multiplexedStream = createMultiplexedStream(new ReadableStream({
						start(controller) {
							callbacks.onParse = (value) => {
								controller.enqueue(JSON.stringify(value) + "\n");
							};
							callbacks.onDone = () => {
								try {
									controller.close();
								} catch {}
								lateStreamWriter?.close().catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							callbacks.onError = (error) => {
								controller.error(error);
								lateStreamWriter?.abort(error).catch(() => {}).finally(() => {
									lateStreamWriter = void 0;
								});
							};
							if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
							if (done) callbacks.onDone();
						},
						cancel() {
							lateStreamWriter?.abort().catch(() => {});
							lateStreamWriter = void 0;
						}
					}), rawStreams, lateStreamReadable);
					return new Response(multiplexedStream, {
						status: alsResponse.status,
						statusText: alsResponse.statusText,
						headers: {
							"Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
							[X_TSS_SERIALIZED]: "true"
						}
					});
				}
				return new Response(void 0, {
					status: alsResponse.status,
					statusText: alsResponse.statusText
				});
			}
		} catch (error) {
			if (error instanceof Response) return error;
			if (isNotFound(error)) return isNotFoundResponse(error);
			console.info();
			console.info("Server Fn Error!");
			console.info();
			console.error(error);
			console.info();
			const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
				refs: /* @__PURE__ */ new Map(),
				plugins: serovalPlugins
			})));
			const response = getResponse();
			return new Response(serializedError, {
				status: response.status ?? 500,
				statusText: response.statusText,
				headers: {
					"Content-Type": "application/json",
					[X_TSS_SERIALIZED]: "true"
				}
			});
		}
	})();
};
function isNotFoundResponse(error) {
	const { headers, ...rest } = error;
	return new Response(JSON.stringify(rest), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
			...headers || {}
		}
	});
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
	"fetch",
	"font",
	"image",
	"script",
	"style",
	"track"
]);
function buildLinkParam(name, value) {
	if (value === void 0) return name;
	if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
	return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
	const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
	if (hint.as) parts.push(buildLinkParam("as", hint.as));
	if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
	if (hint.type) parts.push(buildLinkParam("type", hint.type));
	if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
	if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
	if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
	return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
	const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
	return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
	const as = getStringAttr(attrs, "as");
	return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
	const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
	const type = getStringAttr(attrs, "type");
	const integrity = getStringAttr(attrs, "integrity");
	const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
	const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
	if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
	if (type) hint.type = type;
	if (integrity) hint.integrity = integrity;
	if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
	if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
	const href = getStringAttr(attrs, "href");
	const rel = getStringAttr(attrs, "rel");
	if (!href || !rel) return void 0;
	const relTokens = rel.split(/\s+/);
	let hintRel;
	let hintAs;
	if (relTokens.includes("modulepreload")) {
		hintRel = "modulepreload";
		hintAs = "script";
	} else if (relTokens.includes("stylesheet")) {
		hintRel = "preload";
		hintAs = "style";
	} else if (relTokens.includes("preload")) {
		hintAs = getPreloadAs(attrs);
		if (!hintAs) return void 0;
		hintRel = "preload";
	} else if (relTokens.includes("preconnect")) {
		hintRel = "preconnect";
		hintAs = void 0;
	} else if (relTokens.includes("dns-prefetch")) {
		hintRel = "dns-prefetch";
		hintAs = void 0;
	}
	if (!hintRel) return void 0;
	const hint = {
		href,
		rel: hintRel
	};
	if (hintAs) hint.as = hintAs;
	addEarlyHintFetchAttrs(hint, attrs);
	return hint;
}
function collectStaticHintsFromManifest(manifest, matchedRoutes) {
	const hints = [];
	for (const route of matchedRoutes) {
		const routeManifest = manifest.routes[route.id];
		if (!routeManifest) continue;
		for (const link of routeManifest.preloads ?? []) {
			const attrs = getScriptPreloadAttrs(manifest, link);
			const hint = {
				href: attrs.href,
				rel: attrs.rel,
				as: "script"
			};
			if (attrs.crossOrigin !== void 0) hint.crossOrigin = attrs.crossOrigin;
			hints.push(hint);
		}
		for (const link of routeManifest.css ?? []) {
			const stylesheetHref = getStylesheetHref(link);
			if (manifest.inlineCss?.styles[stylesheetHref] !== void 0) continue;
			const resolvedLink = resolveManifestCssLink(link);
			const hint = {
				href: stylesheetHref,
				rel: "preload",
				as: "style"
			};
			if (resolvedLink.crossOrigin !== void 0) hint.crossOrigin = resolvedLink.crossOrigin;
			hints.push(hint);
		}
	}
	return hints;
}
function collectDynamicHintsFromMatches(matches) {
	const hints = [];
	for (const match of matches) {
		const links = match.links;
		if (!Array.isArray(links)) continue;
		for (const link of links) {
			const hint = linkAttrsToEarlyHint(link);
			if (hint) hints.push(hint);
		}
	}
	return hints;
}
function createEarlyHintsEvent(opts) {
	const nextHints = [];
	const nextLinks = [];
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.sentHints.push(hint);
		nextHints.push(hint);
		nextLinks.push(link);
	}
	if (!nextHints.length && opts.phase !== "dynamic") return void 0;
	return {
		phase: opts.phase,
		hints: nextHints,
		links: nextLinks,
		allHints: opts.sentHints.slice(),
		allLinks: Array.from(opts.sentLinks)
	};
}
function createResponseLinkHeaderEntries(opts) {
	for (const hint of opts.hints) {
		const link = serializeEarlyHint(hint);
		if (opts.sentLinks.has(link)) continue;
		opts.sentLinks.add(link);
		opts.entries.push({
			phase: opts.phase,
			hint,
			link
		});
	}
}
function getResponseLinkHeaderEntries(opts) {
	if (!opts.filter) return opts.entries.map((entry) => entry.link);
	try {
		const links = [];
		for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
		return links;
	} catch (err) {
		console.error("Error filtering response Link headers:", err);
		return [];
	}
}
function notifyEarlyHints(phase, event, onEarlyHints) {
	try {
		const result = onEarlyHints(event);
		if (result) Promise.resolve(result).catch((err) => {
			console.error(`Error sending ${phase} early hints:`, err);
		});
	} catch (err) {
		console.error(`Error sending ${phase} early hints:`, err);
	}
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
	if (typeof responseLinkHeader !== "object") return;
	return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
	for (const link of getResponseLinkHeaderEntries(opts)) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
	for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
		phase: opts.phase,
		hint: opts.event.hints[index],
		link: opts.event.links[index]
	});
}
function collectEarlyHintsPhase(opts) {
	const event = opts.onEarlyHints ? createEarlyHintsEvent({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		sentHints: opts.sentHints
	}) : void 0;
	if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
	if (!opts.responseLinkHeaderEntries) return;
	if (event) {
		collectResponseLinkHeaderEntries({
			phase: opts.phase,
			event,
			entries: opts.responseLinkHeaderEntries
		});
		return;
	}
	createResponseLinkHeaderEntries({
		phase: opts.phase,
		hints: opts.hints,
		sentLinks: opts.sentLinks,
		entries: opts.responseLinkHeaderEntries
	});
}
function createEarlyHintsCollector(opts) {
	if (!opts?.onEarlyHints && !opts?.responseLinkHeader) return;
	const sentLinks = /* @__PURE__ */ new Set();
	const sentHints = opts.onEarlyHints ? new Array() : void 0;
	const responseLinkHeaderEntries = opts.responseLinkHeader ? new Array() : void 0;
	const responseLinkHeaderFilter = getResponseLinkHeaderFilter(opts.responseLinkHeader);
	return {
		collectStatic: ({ manifest, matchedRoutes }) => {
			if (!matchedRoutes?.length) return;
			collectEarlyHintsPhase({
				phase: "static",
				hints: collectStaticHintsFromManifest(manifest, matchedRoutes),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		collectDynamic: (matches) => {
			collectEarlyHintsPhase({
				phase: "dynamic",
				hints: collectDynamicHintsFromMatches(matches),
				sentLinks,
				sentHints,
				onEarlyHints: opts.onEarlyHints,
				responseLinkHeaderEntries
			});
		},
		appendResponseHeaders: (headers) => {
			if (!responseLinkHeaderEntries?.length) return;
			appendResponseLinkHeaders({
				responseHeaders: headers,
				entries: responseLinkHeaderEntries,
				filter: responseLinkHeaderFilter
			});
		}
	};
}
function normalizeTransformAssetResult(result) {
	if (typeof result === "string") return { href: result };
	return result;
}
function escapeCssString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\a ").replace(/\r/g, "\\d ").replace(/\f/g, "\\c ");
}
async function transformInlineCssTemplate(options) {
	const { strings, urls } = options.template;
	if (strings.length !== urls.length + 1) throw new Error(`TanStack Start inlineCss template for ${options.stylesheetHref} is invalid`);
	let css = strings[0];
	for (let index = 0; index < urls.length; index++) {
		const transformed = normalizeTransformAssetResult(await options.transformFn({
			kind: "css-url",
			url: urls[index],
			stylesheetHref: options.stylesheetHref
		}));
		css += escapeCssString(transformed.href) + strings[index + 1];
	}
	return css;
}
async function transformInlineCssStyles(inlineCss, transformFn) {
	const transformedStyles = {};
	const transformedEntries = await Promise.all(Object.entries(inlineCss.styles).map(async ([stylesheetHref, css]) => {
		const template = inlineCss.templates?.[stylesheetHref];
		return [stylesheetHref, template ? await transformInlineCssTemplate({
			stylesheetHref,
			template,
			transformFn
		}) : css];
	}));
	for (const [stylesheetHref, css] of transformedEntries) transformedStyles[stylesheetHref] = css;
	return {
		styles: transformedStyles,
		...inlineCss.templates ? { templates: inlineCss.templates } : {}
	};
}
function resolveTransformAssetsCrossOrigin(config, kind) {
	if (!config) return void 0;
	if (typeof config === "string") return config;
	return config[kind];
}
function isObjectShorthand(transform) {
	return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
	if (typeof transform === "string") {
		const prefix = transform;
		return {
			type: "transform",
			transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
			cache: true
		};
	}
	if (typeof transform === "function") return {
		type: "transform",
		transformFn: transform,
		cache: true
	};
	if (isObjectShorthand(transform)) {
		const { prefix, crossOrigin } = transform;
		return {
			type: "transform",
			transformFn: ({ url, kind }) => {
				const href = `${prefix}${url}`;
				if (kind === "css-url") return { href };
				const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
				return co ? {
					href,
					crossOrigin: co
				} : { href };
			},
			cache: true
		};
	}
	if ("createTransform" in transform && transform.createTransform) return {
		type: "createTransform",
		createTransform: transform.createTransform,
		cache: transform.cache !== false
	};
	return {
		type: "transform",
		transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
		cache: transform.cache !== false
	};
}
function assignManifestLink(link, next) {
	if (typeof link === "string") return next.crossOrigin ? next : next.href;
	const nextLink = {
		...link,
		href: next.href
	};
	if (next.crossOrigin) nextLink.crossOrigin = next.crossOrigin;
	else delete nextLink.crossOrigin;
	return nextLink;
}
async function transformManifestAssets(source, transformFn, _opts) {
	const manifest = structuredClone(source);
	const inlineCssEnabled = _opts?.inlineCss !== false;
	const scriptTransforms = /* @__PURE__ */ new Map();
	const transformScript = (url) => {
		const cached = scriptTransforms.get(url);
		if (cached) return cached;
		const transformed = Promise.resolve(transformFn({
			url,
			kind: "script"
		})).then(normalizeTransformAssetResult);
		scriptTransforms.set(url, transformed);
		return transformed;
	};
	if (!inlineCssEnabled) delete manifest.inlineCss;
	else if (manifest.inlineCss) manifest.inlineCss = await transformInlineCssStyles(manifest.inlineCss, transformFn);
	for (const route of Object.values(manifest.routes)) {
		if (route.preloads?.length) route.preloads = await Promise.all(route.preloads.map(async (link) => {
			const result = await transformScript(resolveManifestAssetLink(link).href);
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.css?.length && !manifest.inlineCss) route.css = await Promise.all(route.css.map(async (link) => {
			const result = normalizeTransformAssetResult(await transformFn({
				url: resolveManifestCssLink(link).href,
				kind: "stylesheet"
			}));
			return assignManifestLink(link, {
				href: result.href,
				crossOrigin: result.crossOrigin
			});
		}));
		if (route.scripts?.length) for (const script of route.scripts) {
			const src = script.attrs?.src;
			if (typeof src !== "string") continue;
			const result = await transformScript(src);
			script.attrs = {
				...script.attrs,
				src: result.href
			};
			if (result.crossOrigin) script.attrs.crossOrigin = result.crossOrigin;
			else delete script.attrs.crossOrigin;
		}
	}
	return manifest;
}
/**
* Builds a final ServerManifest without URL transforms. Used when no
* transformAssets option is provided.
*
* Returns a new manifest object so the cached base manifest is never mutated.
*/
function buildManifest(source, opts) {
	return {
		...source.scriptFormat ? { scriptFormat: source.scriptFormat } : {},
		...opts?.inlineCss !== false && source.inlineCss ? { inlineCss: structuredClone(source.inlineCss) } : {},
		routes: { ...source.routes }
	};
}
function getStaticHandlerInlineCssDefault(handlerInlineCss) {
	if (typeof handlerInlineCss === "function") return;
	return handlerInlineCss ?? true;
}
async function resolveInlineCssForRequest(opts) {
	if (opts.requestInlineCss !== void 0) return opts.requestInlineCss;
	if (typeof opts.handlerInlineCss === "function") return await opts.handlerInlineCss({ request: opts.request });
	return opts.handlerInlineCss ?? true;
}
function createCachedBaseManifestLoader(loadBaseManifest) {
	let baseManifestPromise;
	return () => {
		if (!baseManifestPromise) baseManifestPromise = loadBaseManifest().catch((error) => {
			baseManifestPromise = void 0;
			throw error;
		});
		return baseManifestPromise;
	};
}
function createFinalManifestTransformResolver(transformAssets, opts) {
	const transformConfig = transformAssets !== void 0 ? resolveTransformAssetsConfig(transformAssets) : void 0;
	const cache = transformConfig ? transformConfig.cache : true;
	const warmup = !!transformAssets && typeof transformAssets === "object" && "warmup" in transformAssets && transformAssets.warmup === true;
	let cachedCreateTransformPromise;
	const clearCachedCreateTransform = () => {
		cachedCreateTransformPromise = void 0;
	};
	return {
		cache,
		warmup,
		clearCachedCreateTransform,
		getTransformFn: async (ctx) => {
			if (!transformConfig) return void 0;
			if (transformConfig.type !== "createTransform") return transformConfig.transformFn;
			if (!cache || !opts.cacheCreateTransform) return transformConfig.createTransform(ctx);
			if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(transformConfig.createTransform(ctx)).catch((error) => {
				clearCachedCreateTransform();
				throw error;
			});
			return cachedCreateTransformPromise;
		}
	};
}
function createFinalManifestResolver(opts) {
	const finalManifestCache = /* @__PURE__ */ new Map();
	const transformResolver = createFinalManifestTransformResolver(opts.transformAssets, { cacheCreateTransform: opts.cacheCreateTransform });
	const handlerDefaultInlineCss = getStaticHandlerInlineCssDefault(opts.inlineCss);
	const getRequestManifestOptions = async (requestOpts) => {
		const transformFn = await transformResolver.getTransformFn({
			warmup: false,
			request: requestOpts.request
		});
		const inlineCss = await resolveInlineCssForRequest({
			request: requestOpts.request,
			handlerInlineCss: opts.inlineCss,
			requestInlineCss: requestOpts.requestInlineCss
		});
		return {
			getBaseManifest: requestOpts.getBaseManifest,
			transformFn,
			cache: transformResolver.cache,
			inlineCss
		};
	};
	const resolveRequest = async (requestOpts, cache) => {
		return resolveFinalManifest({
			...await getRequestManifestOptions(requestOpts),
			finalManifestCache: cache
		});
	};
	return {
		warmup: ({ getBaseManifest }) => warmupFinalManifest({
			enabled: transformResolver.warmup,
			handlerDefaultInlineCss,
			cache: transformResolver.cache,
			finalManifestCache,
			getBaseManifest,
			getTransformFn: () => transformResolver.getTransformFn({ warmup: true }),
			onError: transformResolver.clearCachedCreateTransform
		}),
		resolveCached: (requestOpts) => resolveRequest(requestOpts, finalManifestCache),
		resolveUncached: (requestOpts) => resolveRequest(requestOpts, void 0)
	};
}
function getFinalManifestCacheKey(inlineCss) {
	return inlineCss ? "inline-css" : "linked-css";
}
function cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, promise) {
	const cachedFinalManifestPromise = promise.catch((error) => {
		if (cachedFinalManifestPromises.get(cacheKey) === cachedFinalManifestPromise) cachedFinalManifestPromises.delete(cacheKey);
		throw error;
	});
	cachedFinalManifestPromises.set(cacheKey, cachedFinalManifestPromise);
	return cachedFinalManifestPromise;
}
function getOrCreateCachedFinalManifestPromise(cachedFinalManifestPromises, cacheKey, computeFinalManifest) {
	const cachedFinalManifestPromise = cachedFinalManifestPromises.get(cacheKey);
	if (cachedFinalManifestPromise) return cachedFinalManifestPromise;
	return cacheFinalManifestPromise(cachedFinalManifestPromises, cacheKey, Promise.resolve().then(computeFinalManifest));
}
async function buildFinalManifest(opts) {
	return opts.transformFn ? await transformManifestAssets(opts.base, opts.transformFn, { inlineCss: opts.inlineCss }) : buildManifest(opts.base, { inlineCss: opts.inlineCss });
}
async function resolveFinalManifest(opts) {
	const computeFinalManifest = async () => {
		return buildFinalManifest({
			base: await opts.getBaseManifest(),
			transformFn: opts.transformFn,
			inlineCss: opts.inlineCss
		});
	};
	if (opts.finalManifestCache && (!opts.transformFn || opts.cache)) return getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(opts.inlineCss), computeFinalManifest);
	return computeFinalManifest();
}
function warmupFinalManifest(opts) {
	if (!opts.enabled || opts.handlerDefaultInlineCss === void 0 || !opts.cache) return;
	const inlineCss = opts.handlerDefaultInlineCss;
	const warmupPromise = getOrCreateCachedFinalManifestPromise(opts.finalManifestCache, getFinalManifestCacheKey(inlineCss), async () => {
		const [base, transformFn] = await Promise.all([opts.getBaseManifest(), opts.getTransformFn()]);
		return buildFinalManifest({
			base,
			transformFn,
			inlineCss
		});
	});
	if (opts.onError) warmupPromise.catch(opts.onError);
	return warmupPromise;
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
	key: "$TSS/serverfn",
	test: (v) => {
		if (typeof v !== "function") return false;
		if (!(TSS_SERVER_FUNCTION in v)) return false;
		return !!v[TSS_SERVER_FUNCTION];
	},
	toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
	fromSerializable: ({ functionId }) => {
		const fn = async (opts, signal) => {
			return (await (await getServerFnById(functionId, { origin: "client" }))(opts ?? {}, signal)).result;
		};
		return fn;
	}
});
function getStartResponseHeaders(opts) {
	return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ..._getRenderedMatches(opts.router.stores.matches.get()).map((match) => {
		return match.headers;
	}));
}
var entriesPromise;
var defaultCsrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var getCachedBaseManifest = createCachedBaseManifestLoader(() => getStartManifest());
var getProdBaseManifest = () => getCachedBaseManifest();
var getBaseManifest = getProdBaseManifest;
var createEarlyHintsForRequest = createEarlyHintsCollector;
async function loadEntries() {
	const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
		Promise.resolve().then(() => router_irsN6Xvb_exports).then((n) => n.t),
		import("./start-CKLcx1cP.mjs"),
		import("./empty-plugin-adapters-D9UWiqvJ.mjs")
	]);
	return {
		routerEntry,
		startEntry,
		pluginAdapters
	};
}
function getEntries() {
	if (!entriesPromise) entriesPromise = loadEntries();
	return entriesPromise;
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = processModule.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = processModule.env.TSS_SHELL === "true";
var IS_DEV = false;
var ERR_NO_RESPONSE = IS_DEV ? `It looks like you forgot to return a response from your server route handler. If you want to defer to the app router, make sure to have a component set in this route.` : "Internal Server Error";
var ERR_NO_DEFER = IS_DEV ? `You cannot defer to the app router if there is no component defined on this route.` : "Internal Server Error";
function throwRouteHandlerError() {
	throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
	throw new Error(ERR_NO_DEFER);
}
/**
* Check if a value is a special response (Response or Redirect)
*/
function isSpecialResponse(value) {
	return value instanceof Response || isRedirect(value);
}
/**
* Normalize middleware result to context shape
*/
function handleCtxResult(result) {
	if (isSsrResponse(result) || isSpecialResponse(result)) return { response: result };
	return result;
}
function disposeLateResponse(result, signal) {
	const response = handleCtxResult(result)?.response;
	if (isSsrResponse(response) || isSpecialResponse(response)) disposeSsrResponseDetached(response, signal.reason);
}
function isSignalAborted(signal) {
	return signal.aborted;
}
/**
* Execute a middleware chain
*/
async function executeMiddleware(middlewares, ctx, signal) {
	let index = -1;
	let streamResponse;
	let retiredStreamIdentities;
	const isResponseAlias = (candidate, response) => candidate === response || candidate instanceof Response && response.body !== null && candidate.body === response.body;
	const setResponse = (response) => {
		if (isSsrResponse(response)) {
			if (response.serverSsrCleanup === "stream") streamResponse = response;
			ctx.response = response.response;
			return;
		}
		ctx.response = response;
	};
	const disposeStreamResponse = async (reason) => {
		const response = streamResponse;
		if (!response) return;
		streamResponse = void 0;
		retiredStreamIdentities ??= /* @__PURE__ */ new WeakSet();
		retiredStreamIdentities.add(response.response);
		if (response.response.body) retiredStreamIdentities.add(response.response.body);
		const currentResponse = ctx.response;
		if (isResponseAlias(currentResponse, response.response)) ctx.response = void 0;
		await response.dispose(reason);
	};
	const disposeAbandonedResult = (result) => {
		const exposed = handleCtxResult(result)?.response;
		const response = isSsrResponse(exposed) ? exposed.response : exposed;
		if (streamResponse && isResponseAlias(response, streamResponse.response)) {
			disposeStreamResponse(signal.reason).catch(console.error);
			return;
		}
		if (response instanceof Response && retiredStreamIdentities && (retiredStreamIdentities.has(response) || response.body !== null && retiredStreamIdentities.has(response.body))) return;
		disposeLateResponse(result, signal);
	};
	const getFinalResponse = async () => {
		const response = ctx.response;
		if (!response) throwRouteHandlerError();
		if (!streamResponse) return response;
		if (response === streamResponse.response) return streamResponse;
		if (streamResponse.response.body !== null && response.body === streamResponse.response.body) return {
			...streamResponse,
			response
		};
		await disposeStreamResponse("middleware response replaced");
		return response;
	};
	let nextPromise;
	function next(nextCtx) {
		const result = runNext(nextCtx);
		nextPromise = result;
		return result;
	}
	async function runNext(nextCtx) {
		if (signal.aborted) throw signal.reason;
		if (nextCtx) {
			if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
			for (const key of Object.keys(nextCtx)) if (key === "response") setResponse(nextCtx.response);
			else if (key !== "context") ctx[key] = nextCtx[key];
		}
		index++;
		const middleware = middlewares[index];
		if (!middleware) return ctx;
		let result;
		try {
			const pending = middleware({
				...ctx,
				next
			});
			if (pending === nextPromise) {
				nextPromise = void 0;
				result = await pending;
				if (isSignalAborted(signal)) {
					disposeAbandonedResult(result);
					throw signal.reason;
				}
			} else result = await waitForRequest(pending, signal, disposeAbandonedResult);
		} catch (err) {
			if (isSignalAborted(signal)) throw signal.reason;
			if (isSpecialResponse(err)) {
				setResponse(err);
				return ctx;
			}
			throw err;
		}
		const normalized = handleCtxResult(result);
		if (normalized) {
			if (normalized.response !== void 0) setResponse(normalized.response);
			if (normalized.context) ctx.context = safeObjectMerge(ctx.context, normalized.context);
		}
		return ctx;
	}
	try {
		await runNext();
		const response = await waitForRequest(getFinalResponse(), signal, disposeAbandonedResult);
		if (signal.aborted) {
			disposeAbandonedResult(response);
			throw signal.reason;
		}
		return {
			ctx,
			response
		};
	} catch (err) {
		const disposal = disposeStreamResponse(signal.aborted ? signal.reason : err);
		if (signal.aborted) disposal.catch(console.error);
		else await disposal;
		throw err;
	}
}
/**
* Wrap a route handler as middleware
*/
function handlerToMiddleware(handler, mayDefer = false) {
	if (mayDefer) return handler;
	return async (ctx) => {
		const response = await handler({
			...ctx,
			next: throwIfMayNotDefer
		});
		if (!response) throwRouteHandlerError();
		return response;
	};
}
/**
* Creates the TanStack Start request handler.
*
* @example Backwards-compatible usage (handler callback only):
* ```ts
* export default createStartHandler(defaultStreamHandler)
* ```
*
* @example With CDN URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: 'https://cdn.example.com',
* })
* ```
*
* @example With per-request URL rewriting:
* ```ts
* export default createStartHandler({
*   handler: defaultStreamHandler,
*   transformAssets: {
*     transform: ({ url }) => {
*       const cdnBase = getRequest().headers.get('x-cdn-base') || ''
*       return { href: `${cdnBase}${url}` }
*     },
*     cache: false,
*   },
* })
* ```
*/
function createStartHandler(cbOrOptions) {
	const handlerOptions = typeof cbOrOptions === "function" ? {} : cbOrOptions;
	const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
	const finalManifestResolver = createFinalManifestResolver({
		...handlerOptions,
		cacheCreateTransform: true
	});
	const resolveManifestForRequest = finalManifestResolver.resolveCached;
	finalManifestResolver.warmup({ getBaseManifest: () => getBaseManifest(void 0) });
	const startRequestResolver = async (request, requestOpts) => {
		let router = null;
		let responseOwnsCleanup = false;
		try {
			request.signal.throwIfAborted();
			const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
			const href = url.pathname + url.search + url.hash;
			const origin = getOrigin(request);
			if (handledProtocolRelativeURL) return Response.redirect(url, 308);
			const entries = await waitForRequest(getEntries(), request.signal);
			const hasStartInstance = !!entries.startEntry.startInstance;
			const startOptions = await waitForRequest(entries.startEntry.startInstance?.getOptions(), request.signal) || {};
			const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
			const serializationAdapters = [
				...startOptions.serializationAdapters || [],
				...hasPluginAdapters ? pluginSerializationAdapters : [],
				ServerFunctionSerializationAdapter
			];
			const requestStartOptions = {
				...startOptions,
				requestMiddleware: hasStartInstance ? startOptions.requestMiddleware : [defaultCsrfMiddleware],
				serializationAdapters
			};
			const flattenedRequestMiddlewares = requestStartOptions.requestMiddleware ? flattenMiddlewares(requestStartOptions.requestMiddleware) : [];
			const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
			const getRouter = async () => {
				if (router) return router;
				router = await waitForRequest(entries.routerEntry.getRouter(), request.signal);
				let isShell = IS_SHELL_ENV;
				if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
				const history = createMemoryHistory({ initialEntries: [href] });
				router.update({
					history,
					isShell,
					isPrerendering: IS_PRERENDERING,
					origin: router.options.origin ?? origin,
					defaultSsr: requestStartOptions.defaultSsr,
					serializationAdapters: [...requestStartOptions.serializationAdapters, ...router.options.serializationAdapters || []],
					basepath: ROUTER_BASEPATH
				});
				return router;
			};
			if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
				const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
				if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
				const serverFnHandler = async ({ context }) => {
					return runWithStartContext({
						getRouter,
						startOptions: requestStartOptions,
						contextAfterGlobalMiddlewares: context,
						request,
						executedRequestMiddlewares,
						handlerType: "serverFn"
					}, () => handleServerAction({
						request,
						context: requestOpts?.context,
						serverFnId
					}));
				};
				const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), serverFnHandler], {
					request,
					pathname: url.pathname,
					handlerType: "serverFn",
					context: createNullProtoObject(requestOpts?.context)
				}, request.signal);
				const result = await handleRedirectResponse(middlewareResponse, request, getRouter, request.signal);
				bindSsrResponseToRequest(router ?? void 0, result, request.signal);
				request.signal.throwIfAborted();
				responseOwnsCleanup = result.serverSsrCleanup === "stream";
				return result.response;
			}
			const executeRouter = async (serverContext, matchedRoutes) => {
				const acceptParts = (request.headers.get("Accept") || "*/*").split(",");
				if (!["*/*", "text/html"].some((mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType)))) return normalizeSsrResponse(Response.json({ error: "Only HTML requests are supported here" }, { status: 500 }));
				const manifest = await waitForRequest(resolveManifestForRequest({
					request,
					requestInlineCss: requestOpts?.inlineCss,
					getBaseManifest: () => getBaseManifest(matchedRoutes)
				}), request.signal);
				const earlyHints = createEarlyHintsForRequest({
					onEarlyHints: requestOpts?.onEarlyHints,
					responseLinkHeader: requestOpts?.responseLinkHeader
				});
				earlyHints?.collectStatic({
					manifest,
					matchedRoutes
				});
				const routerInstance = await getRouter();
				attachRouterServerSsrUtils({
					router: routerInstance,
					manifest,
					getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets
				});
				routerInstance.options.additionalContext = { serverContext };
				await routerInstance.load({ _signal: request.signal });
				request.signal.throwIfAborted();
				if (routerInstance._serverResult?.type === "redirect") return normalizeSsrResponse(routerInstance._serverResult.redirect);
				earlyHints?.collectDynamic(_getRenderedMatches(routerInstance.stores.matches.get()));
				const ctx = getStartContext({ throwIfNotFound: false });
				await waitForRequest(routerInstance.serverSsr.dehydrate({ requestAssets: ctx?.requestAssets }), request.signal);
				request.signal.throwIfAborted();
				const responseHeaders = getStartResponseHeaders({ router: routerInstance });
				earlyHints?.appendResponseHeaders(responseHeaders);
				request.signal.throwIfAborted();
				return normalizeSsrResponse(await waitForRequest(cb({
					request,
					router: routerInstance,
					responseHeaders
				}), request.signal, (late) => disposeLateResponse(late, request.signal)));
			};
			const requestHandlerMiddleware = async ({ context }) => {
				return runWithStartContext({
					getRouter,
					startOptions: requestStartOptions,
					contextAfterGlobalMiddlewares: context,
					request,
					executedRequestMiddlewares,
					handlerType: "router"
				}, async () => {
					try {
						return await handleServerRoutes({
							getRouter,
							request,
							url,
							executeRouter,
							context,
							executedRequestMiddlewares
						});
					} catch (err) {
						if (err instanceof Response) return err;
						throw err;
					}
				});
			};
			const { response: middlewareResponse } = await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), requestHandlerMiddleware], {
				request,
				pathname: url.pathname,
				handlerType: "router",
				context: createNullProtoObject(requestOpts?.context)
			}, request.signal);
			const response = await handleRedirectResponse(middlewareResponse, request, getRouter, request.signal);
			bindSsrResponseToRequest(router ?? void 0, response, request.signal);
			request.signal.throwIfAborted();
			responseOwnsCleanup = response.serverSsrCleanup === "stream";
			return response.response;
		} finally {
			if (router?.serverSsr && !responseOwnsCleanup) router.serverSsr.cleanup();
			router = null;
		}
	};
	return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter, signal) {
	signal.throwIfAborted();
	const ssrResponse = normalizeSsrResponse(response);
	if (!isRedirect(ssrResponse.response)) return ssrResponse;
	if (isResolvedRedirect(ssrResponse.response)) {
		if (request.headers.get("x-tsr-serverFn") === "true") return waitForRequest(replaceSsrResponse(ssrResponse, Response.json({
			...ssrResponse.response.options,
			isSerializedRedirect: true
		}, { headers: ssrResponse.response.headers }), "redirect response replaced"), signal);
		return ssrResponse;
	}
	const opts = ssrResponse.response.options;
	if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
	if ([
		"params",
		"search",
		"hash"
	].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
	signal.throwIfAborted();
	const router = await waitForRequest(getRouter(), signal);
	signal.throwIfAborted();
	const redirect = router.resolveRedirect(ssrResponse.response);
	if (request.headers.get("x-tsr-serverFn") === "true") return waitForRequest(replaceSsrResponse(ssrResponse, Response.json({
		...ssrResponse.response.options,
		isSerializedRedirect: true
	}, { headers: ssrResponse.response.headers }), "redirect response replaced"), signal);
	return waitForRequest(replaceSsrResponse(ssrResponse, redirect, "redirect response replaced"), signal);
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
	const router = await getRouter();
	const pathname = executeRewriteInput(router.rewrite, url).pathname;
	const [matchedRoutes, rawParams, foundRoute] = router.getMatchedRoutes(pathname);
	const isExactMatch = foundRoute && rawParams["**"] === void 0;
	const routeMiddlewares = [];
	for (const route of matchedRoutes) {
		const serverMiddleware = route.options.server?.middleware;
		if (serverMiddleware) {
			const flattened = flattenMiddlewares(serverMiddleware);
			for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
		}
	}
	const server = foundRoute?.options.server;
	let isHeadFallback = false;
	if (server?.handlers && isExactMatch) {
		const handlers = typeof server.handlers === "function" ? server.handlers({ createHandlers: (d) => d }) : server.handlers;
		const requestMethod = request.method.toUpperCase();
		const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
		isHeadFallback = requestMethod === "HEAD" && handler !== void 0 && !handlers["HEAD"];
		if (handler) {
			const mayDefer = !!foundRoute.options.component;
			if (typeof handler === "function") routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
			else {
				if (handler.middleware?.length) {
					const handlerMiddlewares = flattenMiddlewares(handler.middleware);
					for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
				}
				if (handler.handler) routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
			}
		}
	}
	routeMiddlewares.push(((ctx) => executeRouter(ctx.context, matchedRoutes)));
	const { ctx, response } = await executeMiddleware(routeMiddlewares, {
		request,
		context,
		params: rawParams,
		pathname,
		handlerType: "router"
	}, request.signal);
	if (isHeadFallback) {
		if (!ctx.response) throwRouteHandlerError();
		return waitForRequest(stripSsrResponseBody(await handleRedirectResponse(response, request, getRouter, request.signal), "HEAD body stripped"), request.signal);
	}
	return normalizeSsrResponse(response);
}
var server_exports = /* @__PURE__ */ __exportAll({
	createServerEntry: () => createServerEntry,
	default: () => server_default
});
var fetch$1 = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
	return { async fetch(...args) {
		return await entry.fetch(...args);
	} };
}
var server_default = createServerEntry({ fetch: fetch$1 });
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/queries-BRGPrPxK.js
/**
* Public content API. Every read is scoped to the temple configured for this
* deployment (TEMPLE_SLUG), so the same codebase serves any temple.
*/
var getSiteData = createServerFn({ method: "GET" }).handler(createSsrRpc("72d8957e8d6790aa0bcd06f5285d49a32dd6fca2ccb1d1f33fa73c33a9390c90"));
var getServiceBySlug = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1) }).parse(input)).handler(createSsrRpc("f5bb228111b3dc986131eba8cf88cebb61b23aaa5a7d002240452e9743de7d4a"));
var getEventBySlug = createServerFn({ method: "GET" }).inputValidator((input) => objectType({ slug: stringType().min(1) }).parse(input)).handler(createSsrRpc("5cb16491917ea8b575f71b091116354822abf5deb496dc36b4d6c8f381532695"));
var getBooks = createServerFn({ method: "GET" }).handler(createSsrRpc("8d90df718b6b950670a8fae00bb6889afb9043ac31a934f466dfa4b6c4218f3c"));
var getPriestDirectory = createServerFn({ method: "GET" }).handler(createSsrRpc("689f0deed877e52244f2a47094664945725467a3a3495a8f6eda091e3e100c25"));
/** Panchang for the temple's configured coordinates. Serialised for display. */
var getPanchang = createServerFn({ method: "GET" }).inputValidator((input) => objectType({
	year: numberType().int().optional(),
	month: numberType().int().min(1).max(12).optional()
}).parse(input ?? {})).handler(createSsrRpc("ba60d7b579517ba9bda7d09d68fa419818a13ab41cce633bd3d7424fce172fba"));
/** Tables that are scoped through a parent row rather than a temple_id column. */
var tableSchema = enumType([
	"temples",
	"temple_schedules",
	"service_categories",
	"services",
	"events",
	"announcements",
	"board_members",
	"donors",
	"priests",
	"deities",
	"books",
	"event_items",
	"event_photos"
]);
var valuesSchema = recordType(stringType(), unknownType());
var getAdminData = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("0f1837f395f4bb48539777c2bbb6472ccf9a55c7f793455b67f68354476c518e"));
var saveRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	table: tableSchema,
	id: stringType().uuid().optional(),
	values: valuesSchema
}).parse(input)).handler(createSsrRpc("4b6e7e6681041490dc067e5a74efeeaa2c3dacb936f370cf20cace5f206f6a8d"));
var deleteRecord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	table: tableSchema,
	id: stringType().uuid()
}).parse(input)).handler(createSsrRpc("56e0c992f75cb6547c2002a531f942e92547cc300b3d83a4e7b7e9b61fb46703"));
/** Audit trail of who changed events, priests, donors and deities. */
var getAuditLog = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("2f695832197dfa0cbc14c4031bc614cf181ed185713317040ffc624ee7876dd0"));
/** Newsletter subscribers, volunteers and temple administrators. */
var getAdminPeople = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("4f4fe79369cdbaab809e1634b08eb4f24cf905460298401ad068975fa0940060"));
/** Grant temple administrator access to an existing account, by email. */
var grantAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ email: stringType().trim().email().max(255) }).parse(input)).handler(createSsrRpc("7f3bd8faf821df2e129c56673194fcd6849e1cf8938225a6d74d2bc45f75eea8"));
/** Remove temple administrator access from another account. */
var revokeAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({ roleId: stringType().uuid() }).parse(input)).handler(createSsrRpc("06e0572fac90316a37f1b88d6cb83786d8a44f92579a42e2a91a7f7f3f158af7"));
/**
* Bootstrap: the first signed-in devotee can claim administrator access while
* the temple has no administrator at all. Once one exists this always fails.
*/
var claimFirstAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d9425d3c7a250d7701d286efd0414683dc977e4fa309b10da0ac77fcbe4e9e2c"));
var siteQuery = queryOptions({
	queryKey: ["site"],
	queryFn: () => getSiteData(),
	staleTime: 6e4
});
var priestsQuery = queryOptions({
	queryKey: ["priests"],
	queryFn: () => getPriestDirectory(),
	staleTime: 6e4
});
var booksQuery = queryOptions({
	queryKey: ["books"],
	queryFn: () => getBooks(),
	staleTime: 6e4
});
var serviceQuery = (slug) => queryOptions({
	queryKey: ["service", slug],
	queryFn: () => getServiceBySlug({ data: { slug } }),
	staleTime: 6e4
});
var eventQuery = (slug) => queryOptions({
	queryKey: ["event", slug],
	queryFn: () => getEventBySlug({ data: { slug } }),
	staleTime: 6e4
});
var panchangQuery = (year, month) => queryOptions({
	queryKey: [
		"panchang",
		year ?? "now",
		month ?? "now"
	],
	queryFn: () => getPanchang({ data: {
		...year !== void 0 ? { year } : {},
		...month !== void 0 ? { month } : {}
	} }),
	staleTime: 3e5
});
var adminQuery = queryOptions({
	queryKey: ["admin"],
	queryFn: () => getAdminData(),
	staleTime: 1e4
});
var auditQuery = queryOptions({
	queryKey: ["admin", "audit"],
	queryFn: () => getAuditLog(),
	staleTime: 1e4
});
var adminPeopleQuery = queryOptions({
	queryKey: ["admin", "people"],
	queryFn: () => getAdminPeople(),
	staleTime: 1e4
});
//#endregion
export { Route$14 as A, volunteerForEvent as B, DataRow as C, Prose as D, PageHeader as E, SectionHeading as F, requireSupabaseAuth as H, __exportAll as I, communityQuery as L, Route$21 as M, Route$29 as N, Route$1 as O, Section as P, logo_exports as R, Button as S, GoldRule as T, cn as U, createSsrRpc as V, createServerFn as _, claimFirstAdmin as a, server_default as b, grantAdmin as c, revokeAdmin as d, saveRecord as f, createServerEntry as g, TSS_SERVER_FUNCTION as h, booksQuery as i, Route$16 as j, Route$11 as k, panchangQuery as l, siteQuery as m, adminQuery as n, deleteRecord as o, serviceQuery as p, auditQuery as r, eventQuery as s, adminPeopleQuery as t, priestsQuery as u, getRequest as v, EmptyState as w, server_exports as x, getServerFnById as y, subscribeNewsletter as z };
