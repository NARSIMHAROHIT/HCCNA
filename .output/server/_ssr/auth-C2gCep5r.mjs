import { r as __toESM } from "../_runtime.mjs";
import { E as PageHeader, N as Route$29, P as Section, S as Button } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./server-Cc0YOX7k.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-C2gCep5r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		...opts,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function safeRedirect(value) {
	if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
	return value;
}
function AuthPage() {
	const search = Route$29.useSearch();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const next = safeRedirect(search.redirect);
	async function onSubmit(e) {
		e.preventDefault();
		if (mode === "signup" && password !== confirm) {
			toast.error("The two passwords do not match.");
			return;
		}
		setBusy(true);
		try {
			if (mode === "signup") {
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: { full_name: fullName },
						emailRedirectTo: `${window.location.origin}${next}`
					}
				});
				if (error) {
					if (/already|registered|exists/i.test(error.message)) {
						setMode("signin");
						setConfirm("");
						toast.error("An account with this email already exists. Please sign in instead.");
						return;
					}
					throw error;
				}
				if (data.user && data.user.identities && data.user.identities.length === 0) {
					setMode("signin");
					setConfirm("");
					toast.error("An account with this email already exists. Please sign in instead.");
					return;
				}
				toast.success("Account created. You can start booking now.");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) {
					if (/invalid login credentials/i.test(error.message)) {
						toast.error("Wrong email or password. Please try again.");
						return;
					}
					if (/confirm/i.test(error.message)) {
						toast.error("Please confirm your email address first — check your inbox.");
						return;
					}
					throw error;
				}
			}
			navigate({
				to: next,
				replace: true
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Sign in failed");
		} finally {
			setBusy(false);
		}
	}
	async function onGoogle() {
		const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(next)}` });
		if (result.error) {
			toast.error("Google sign-in failed. Please try again.");
			return;
		}
		if (result.redirected) return;
		navigate({
			to: next,
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Devotee portal",
		title: mode === "signin" ? "Sign in" : "Create your account",
		description: "Book poojas, track your bookings and receive reminders from the temple."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "surface-panel p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "w-full",
					onClick: onGoogle,
					children: "Continue with Google"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
						" or ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit,
					children: [
						mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "fullName",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "fullName",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								required: true,
								minLength: 2
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								autoComplete: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									children: "Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									autoComplete: mode === "signin" ? "current-password" : "new-password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									required: true,
									minLength: 8
								}),
								mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "At least 8 characters."
								}) : null
							]
						}),
						mode === "signup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "confirm",
								children: "Confirm password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "confirm",
								type: "password",
								autoComplete: "new-password",
								value: confirm,
								onChange: (e) => setConfirm(e.target.value),
								required: true,
								minLength: 8
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: mode === "signin" ? "Sign in" : "Create account"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 w-full text-sm text-muted-foreground hover:text-foreground",
					onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
					children: mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"
				})
			]
		})
	}) })] });
}
//#endregion
export { AuthPage as component };
