import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-public.server-Bswr2KGX.js
/**
* Publishable-key Supabase client for server-side reads of PUBLIC content.
* Respects RLS as the anonymous role — never use it for private data.
* Must be constructed inside a server function/route handler (env is per-request).
*/
function createPublicServerClient() {
	const url = processModule.env["SUPABASE_URL"];
	const key = processModule.env["SUPABASE_PUBLISHABLE_KEY"];
	return createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const headers = new Headers(init?.headers);
			if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
			headers.set("apikey", key);
			return fetch(input, {
				...init,
				headers
			});
		} }
	});
}
/** The temple this deployment serves. Configured per-deployment, never hard-coded content. */
function activeTempleSlug() {
	return processModule.env["TEMPLE_SLUG"] ?? "hccna";
}
//#endregion
export { activeTempleSlug, createPublicServerClient };
