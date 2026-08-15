import { r as __toESM } from "../_runtime.mjs";
import { j as Route$16 } from "./queries-BRGPrPxK.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./server-Cc0YOX7k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-CmrLV48r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Callback() {
	const { redirect } = Route$16.useSearch();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const target = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";
		let cancelled = false;
		supabase.auth.getSession().then(({ data }) => {
			if (cancelled) return;
			navigate({
				to: data.session ? target : "/auth",
				replace: true
			});
		});
		return () => {
			cancelled = true;
		};
	}, [navigate, redirect]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[50vh] items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Completing sign-in…"
		})
	});
}
//#endregion
export { Callback as component };
