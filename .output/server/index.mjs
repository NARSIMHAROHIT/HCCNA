globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/ClientOnly-BPmJm2HG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115-/EqHbRJ7HTjtAjLJBpT2EB64m9M\"",
		"mtime": "2026-08-15T21:50:39.762Z",
		"size": 277,
		"path": "../public/assets/ClientOnly-BPmJm2HG.js"
	},
	"/assets/CrudSection-DKZXAulo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1df9-rPCcXTI5hWWn3LN2kCVLffN1Vkw\"",
		"mtime": "2026-08-15T21:50:39.762Z",
		"size": 7673,
		"path": "../public/assets/CrudSection-DKZXAulo.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"28fca-coFpgRdmitdvvBKi9DF1gw7J2KM\"",
		"mtime": "2026-08-15T21:50:40.473Z",
		"size": 167882,
		"path": "../public/favicon.ico"
	},
	"/assets/admin-BMIZULxE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a64-vxZDDlVLboO/eCy/qdsGmwtw5us\"",
		"mtime": "2026-08-15T21:50:39.762Z",
		"size": 2660,
		"path": "../public/assets/admin-BMIZULxE.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-15T21:50:40.472Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/admin.community-DutgU7O0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90e-FaM5fh//dbdMvv9YP6H2H8NYFrI\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 2318,
		"path": "../public/assets/admin.community-DutgU7O0.js"
	},
	"/assets/about-CQ-yXYWY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"916-7kS2sTjy1LoaXp90c6uFMOzVw9Q\"",
		"mtime": "2026-08-15T21:50:39.762Z",
		"size": 2326,
		"path": "../public/assets/about-CQ-yXYWY.js"
	},
	"/assets/admin.payments-WIZegors.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5d-io9csuexMYSM1PmybO7SxVVJsYo\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 3421,
		"path": "../public/assets/admin.payments-WIZegors.js"
	},
	"/assets/admin.people-pmX772FC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11ea-iVLOXjqTJfhw9SdHlIg6Rjl3ZPg\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 4586,
		"path": "../public/assets/admin.people-pmX772FC.js"
	},
	"/assets/admin.events-CJQcONoF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c55-PmPBih/5MRdaELf2LVfMFXDsF9o\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 3157,
		"path": "../public/assets/admin.events-CJQcONoF.js"
	},
	"/assets/admin.poojas-CPzenH0n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"980-kI/3N41FJ8+SD9Y48E5vDKIpKZM\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 2432,
		"path": "../public/assets/admin.poojas-CPzenH0n.js"
	},
	"/assets/admin.temple-Pbra-1x0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b0-QwPTmnkx8zzrqfYgkCV54jVdGQM\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 2480,
		"path": "../public/assets/admin.temple-Pbra-1x0.js"
	},
	"/assets/admin.timings-mI3nSUou.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-bTD8YOrFblOHy3HgXtsY/gwqomY\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 1168,
		"path": "../public/assets/admin.timings-mI3nSUou.js"
	},
	"/assets/admin.index-B1l-BJVE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"843-5G/KoJhlp1zj6IDz4E94O6cb3X4\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 2115,
		"path": "../public/assets/admin.index-B1l-BJVE.js"
	},
	"/assets/auth-sI4c_Gj1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f01-ZnGoLo7R0qtxGiLy1ev2i2spe6o\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 7937,
		"path": "../public/assets/auth-sI4c_Gj1.js"
	},
	"/assets/admin.audit-B2Qa8Lt3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f7-bIBrLse26HB4rFm/MYwbpAB0Jwk\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 2551,
		"path": "../public/assets/admin.audit-B2Qa8Lt3.js"
	},
	"/assets/auth.callback-CCkn_FFj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"251-FHiJpRx6AUkwSTEIWrj7lO8p7yc\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 593,
		"path": "../public/assets/auth.callback-CCkn_FFj.js"
	},
	"/assets/board-DQhcgGKz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"461-K4zbHNdrdgnYaNsHbfBlN1Wpv/4\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 1121,
		"path": "../public/assets/board-DQhcgGKz.js"
	},
	"/assets/booking.functions-DBgOz7nb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc2-P6zAT8jFdokysoednu5spEMuK1s\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 3522,
		"path": "../public/assets/booking.functions-DBgOz7nb.js"
	},
	"/assets/book._slug-C8G-NZv4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130d-QLDx+Qt7gNaPgeY01up2WeDfXAo\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 4877,
		"path": "../public/assets/book._slug-C8G-NZv4.js"
	},
	"/assets/calendar-pvgBNtKA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ff-jKeI9+QTAy4NRK6KkvDERZC6bN4\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 5631,
		"path": "../public/assets/calendar-pvgBNtKA.js"
	},
	"/assets/cards-DvgwNESp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1594-rtIDaZhPtekwzp9OywxXGflGcFU\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 5524,
		"path": "../public/assets/cards-DvgwNESp.js"
	},
	"/assets/checkbox-CQERS9W_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137e-RbqpEtxQ2mYiW3X6aWEQjFSjsyo\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 4990,
		"path": "../public/assets/checkbox-CQERS9W_.js"
	},
	"/assets/auth-middleware-JDjVgB0Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c-E5N3ct+04FLjw+DnBCmxYLSbRrU\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 332,
		"path": "../public/assets/auth-middleware-JDjVgB0Q.js"
	},
	"/assets/badge-RkulPdFU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"325-/Qnt01q9tBuzi/Tu/vFaEYyzyrA\"",
		"mtime": "2026-08-15T21:50:39.763Z",
		"size": 805,
		"path": "../public/assets/badge-RkulPdFU.js"
	},
	"/assets/contact-6t4jqmiS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c7-T6FfYk+pyXuz7e+0XQmv0NiLqdI\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 1991,
		"path": "../public/assets/contact-6t4jqmiS.js"
	},
	"/assets/dashboard-ZqvGji3w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e99-JJJ3OUqolR7NxryF9sFFJicwYng\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 3737,
		"path": "../public/assets/dashboard-ZqvGji3w.js"
	},
	"/assets/donate-Bh49Ij1H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1027-QbqXpJBf+1Y0SZV1C8rhCsFhvcc\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 4135,
		"path": "../public/assets/donate-Bh49Ij1H.js"
	},
	"/assets/donors-DZUa8rnP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72c-IXEjkCK+z+XQgZyrIk1PiBNs5uI\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 1836,
		"path": "../public/assets/donors-DZUa8rnP.js"
	},
	"/assets/events._slug-Anyl8SX1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a60-50fYwFodksUJBO5QsJZfKlY/vGk\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 6752,
		"path": "../public/assets/events._slug-Anyl8SX1.js"
	},
	"/assets/input-C3R99wb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26d-2wTQtSBRFD0WVU6SuEuPUFo5d+g\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 621,
		"path": "../public/assets/input-C3R99wb1.js"
	},
	"/assets/jsx-runtime-B-hcVAMW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216d-pcqlp1Bv4Kt7yFmWJlJC8xMXx/k\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 8557,
		"path": "../public/assets/jsx-runtime-B-hcVAMW.js"
	},
	"/assets/label-u0zi130k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-vORu6qjshdYrKFUQpOatEihtgfY\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 686,
		"path": "../public/assets/label-u0zi130k.js"
	},
	"/assets/library-DoPfUpnG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"591-cj4rE0m+c/q9z2m7IpdEye+B8BU\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 1425,
		"path": "../public/assets/library-DoPfUpnG.js"
	},
	"/assets/link-BrRgpClW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f49-NFHR9Keb8aPHc12lquP4eAUcGQ8\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 16201,
		"path": "../public/assets/link-BrRgpClW.js"
	},
	"/assets/logo-BIGLHuYX.jpg": {
		"type": "image/jpeg",
		"etag": "\"6151-sCWZRaRrTwm1ilMogeW7ot5Ezm8\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 24913,
		"path": "../public/assets/logo-BIGLHuYX.jpg"
	},
	"/assets/matchContext-DyXrH4xk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-YhWGcXqMNvQOQvgCVZpGcwhQ5/4\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 142,
		"path": "../public/assets/matchContext-DyXrH4xk.js"
	},
	"/assets/mutation-BQnwFUvL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d36-EcMG6fE72SU8dOd4OfbFekd3rks\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 3382,
		"path": "../public/assets/mutation-BQnwFUvL.js"
	},
	"/assets/not-found-i5RsCZif.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76-Trmr7GZIBZuvfg4uM18tBiRtOXg\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 118,
		"path": "../public/assets/not-found-i5RsCZif.js"
	},
	"/assets/pay._slug-B55bQ5ZW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec6-alrhTMBQ/XGeCqdtUNkXVQVZEMU\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 3782,
		"path": "../public/assets/pay._slug-B55bQ5ZW.js"
	},
	"/assets/payments.functions-DbanQZv4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-KKQiC4y1WsrFaAxuT9lrTYHBEoE\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 279,
		"path": "../public/assets/payments.functions-DbanQZv4.js"
	},
	"/assets/priests-CgMlDAny.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85c-kqWEwlmyaOFrKl/Xq8Vg9Q7X2c0\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 2140,
		"path": "../public/assets/priests-CgMlDAny.js"
	},
	"/assets/profile-Dwy9FOpI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e0-gc89jPtoVStI5fHbfD959XVL+NQ\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 1760,
		"path": "../public/assets/profile-Dwy9FOpI.js"
	},
	"/assets/queryOptions-Dfvzj6n2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-swOrbCYhZ0gnyks4Amdj937R/Ts\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 38,
		"path": "../public/assets/queryOptions-Dfvzj6n2.js"
	},
	"/assets/receipt-DZiXjMGW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2f-mFaSTYz23RLMYtp/tTRup67P2+s\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 3119,
		"path": "../public/assets/receipt-DZiXjMGW.js"
	},
	"/assets/redirect-Dza75jpa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"232-fweth2xW3tiuHz8hyNhHXS/d3qI\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 562,
		"path": "../public/assets/redirect-Dza75jpa.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-08-15T21:50:39.765Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/events.index-Duw3zKUZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"666-rH5IdAzJIivTtddBDSLUfkkbWdg\"",
		"mtime": "2026-08-15T21:50:39.764Z",
		"size": 1638,
		"path": "../public/assets/events.index-Duw3zKUZ.js"
	},
	"/assets/route-BtapGOJK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-XOsdaXvE57p04fN1pgVjSis3Eho\"",
		"mtime": "2026-08-15T21:50:39.766Z",
		"size": 142,
		"path": "../public/assets/route-BtapGOJK.js"
	},
	"/assets/index-b7K2n4dL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9af64-Q8wVO595HQ/4veTAIl+C561nW7w\"",
		"mtime": "2026-08-15T21:50:39.762Z",
		"size": 634724,
		"path": "../public/assets/index-b7K2n4dL.js"
	},
	"/assets/routes-Mr4rD7tj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5db6-g4bUDTgdbHvLUaCFBkX1mvEvfhk\"",
		"mtime": "2026-08-15T21:50:39.766Z",
		"size": 23990,
		"path": "../public/assets/routes-Mr4rD7tj.js"
	},
	"/assets/services._slug-jZqNOxrO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d78-ZGie6ZbqWVnfoxif+f8abIJy0m4\"",
		"mtime": "2026-08-15T21:50:39.766Z",
		"size": 3448,
		"path": "../public/assets/services._slug-jZqNOxrO.js"
	},
	"/assets/services.index-bWTJZcTu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"586-buwwme+WtTM57ikui2b5VKYk8js\"",
		"mtime": "2026-08-15T21:50:39.766Z",
		"size": 1414,
		"path": "../public/assets/services.index-bWTJZcTu.js"
	},
	"/assets/styles-CBfKybkm.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1563f-eEOtdTSRjUFW0OVIQSCDjO7kSvA\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 87615,
		"path": "../public/assets/styles-CBfKybkm.css"
	},
	"/assets/textarea-B-iM0-8M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"207-JSPelI+OYukLjPwLlAQBvX+GdSg\"",
		"mtime": "2026-08-15T21:50:39.766Z",
		"size": 519,
		"path": "../public/assets/textarea-B-iM0-8M.js"
	},
	"/assets/timezone-C2bJl7UY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a-WPhkGjDFwgbISntettun/pj4uWM\"",
		"mtime": "2026-08-15T21:50:39.766Z",
		"size": 314,
		"path": "../public/assets/timezone-C2bJl7UY.js"
	},
	"/assets/timings-BqdKo2vD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c1-fP7CJ6sw/N9hs4yhboGGVC3sp1o\"",
		"mtime": "2026-08-15T21:50:39.766Z",
		"size": 2497,
		"path": "../public/assets/timings-BqdKo2vD.js"
	},
	"/assets/useBaseQuery-Bo-PjOWw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f214-q5+nVw/fTVDykHOahokZTJxBQOI\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 61972,
		"path": "../public/assets/useBaseQuery-Bo-PjOWw.js"
	},
	"/assets/useQuery-l7oMldR9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60-FULo3ht/A447fVXwUIbzIu+nks0\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 96,
		"path": "../public/assets/useQuery-l7oMldR9.js"
	},
	"/assets/useRouter-BGpAXxmD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-+ISDMDd0jCDVZNcQqLKhSYvsP+8\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 151,
		"path": "../public/assets/useRouter-BGpAXxmD.js"
	},
	"/assets/useStore-CkfBVHB2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"761-xLC08uZkoz4xe9Efj2z2wpdFyH4\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 1889,
		"path": "../public/assets/useStore-CkfBVHB2.js"
	},
	"/assets/utils-BILtoX7V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cad-Kenb+C6Rj1fctKIlGu2IfrGxB6c\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 3245,
		"path": "../public/assets/utils-BILtoX7V.js"
	},
	"/assets/temple-hero-Be2RZu1Z.jpg": {
		"type": "image/jpeg",
		"etag": "\"20f25-UNKRyxvKSSE4TPdSbC5fMini2FA\"",
		"mtime": "2026-08-15T21:50:39.768Z",
		"size": 134949,
		"path": "../public/assets/temple-hero-Be2RZu1Z.jpg"
	},
	"/assets/temple-hero-2-DTp26VZs.jpg": {
		"type": "image/jpeg",
		"etag": "\"b58fc-iZvk+OC3DUb0FURB7hAIFxiCv50\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 743676,
		"path": "../public/assets/temple-hero-2-DTp26VZs.jpg"
	},
	"/assets/utils-DojpP95n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7e-rehYKtt6GcJPoEspFNv2VomMQ30\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 27262,
		"path": "../public/assets/utils-DojpP95n.js"
	},
	"/assets/temple-hero-1-Bs0qSYel.jpg": {
		"type": "image/jpeg",
		"etag": "\"f61d6-g7rq28zEthN4mxBzbUesNWqvdG0\"",
		"mtime": "2026-08-15T21:50:39.767Z",
		"size": 1008086,
		"path": "../public/assets/temple-hero-1-Bs0qSYel.jpg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_pWBnq1 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_pWBnq1
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
