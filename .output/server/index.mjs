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
	"/assets/admin-BHkNiOra.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a64-RnXocxo5krwyTpgFIdxMrrK3Ei4\"",
		"mtime": "2026-08-14T19:28:19.039Z",
		"size": 2660,
		"path": "../public/assets/admin-BHkNiOra.js"
	},
	"/assets/admin.index-CcPfl-aO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"843-FFrgWzDjCT/o33QAUSA7Ko5/sto\"",
		"mtime": "2026-08-14T19:28:19.045Z",
		"size": 2115,
		"path": "../public/assets/admin.index-CcPfl-aO.js"
	},
	"/assets/about-DUVWdNmF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"916-oGooKyf8Ib2ebuF5lajwBTKBpsM\"",
		"mtime": "2026-08-14T19:28:19.037Z",
		"size": 2326,
		"path": "../public/assets/about-DUVWdNmF.js"
	},
	"/assets/admin.events-BM0R2Rhr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c55-BTP490kayEFMLHmX1xZClAVwbLs\"",
		"mtime": "2026-08-14T19:28:19.045Z",
		"size": 3157,
		"path": "../public/assets/admin.events-BM0R2Rhr.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"28fca-coFpgRdmitdvvBKi9DF1gw7J2KM\"",
		"mtime": "2026-08-14T16:30:03.022Z",
		"size": 167882,
		"path": "../public/favicon.ico"
	},
	"/assets/admin.audit-DkdAJl5O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9f7-d7MpuE5L4XiWZIQRfL6jXPtz2vo\"",
		"mtime": "2026-08-14T19:28:19.041Z",
		"size": 2551,
		"path": "../public/assets/admin.audit-DkdAJl5O.js"
	},
	"/assets/admin.people-D9O2ACDB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11ea-bWKRta06DwTg+BebW/IxbZRXnIQ\"",
		"mtime": "2026-08-14T19:28:19.050Z",
		"size": 4586,
		"path": "../public/assets/admin.people-D9O2ACDB.js"
	},
	"/assets/admin.payments-bjz5YH-S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5d-PsHESja6dMJazBxagbDCGzlj3j4\"",
		"mtime": "2026-08-14T19:28:19.050Z",
		"size": 3421,
		"path": "../public/assets/admin.payments-bjz5YH-S.js"
	},
	"/assets/admin.poojas-CHBGK8Fg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"980-JoowI0Ry40Fszbce8y6OuhkSoNs\"",
		"mtime": "2026-08-14T19:28:19.057Z",
		"size": 2432,
		"path": "../public/assets/admin.poojas-CHBGK8Fg.js"
	},
	"/assets/admin.community-BQGe11zD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90e-vmVaCNQZIVOhg7Bxwx7ycrcsK0s\"",
		"mtime": "2026-08-14T19:28:19.045Z",
		"size": 2318,
		"path": "../public/assets/admin.community-BQGe11zD.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-14T16:30:03.027Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/auth-middleware-JDjVgB0Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14c-E5N3ct+04FLjw+DnBCmxYLSbRrU\"",
		"mtime": "2026-08-14T19:28:19.061Z",
		"size": 332,
		"path": "../public/assets/auth-middleware-JDjVgB0Q.js"
	},
	"/assets/admin.temple-D3VFJpOe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b0-9vOYlcAzRUOdvs9Tfs+yyfEGo04\"",
		"mtime": "2026-08-14T19:28:19.060Z",
		"size": 2480,
		"path": "../public/assets/admin.temple-D3VFJpOe.js"
	},
	"/assets/admin.timings-OGWTuZ-l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-R0+UT9BF4KHzrz7pwgfTZkCz1eM\"",
		"mtime": "2026-08-14T19:28:19.061Z",
		"size": 1168,
		"path": "../public/assets/admin.timings-OGWTuZ-l.js"
	},
	"/assets/auth.callback-B0gdKpuj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24c-9wm0eNjZfvL+uxufTQyPUlCsMPQ\"",
		"mtime": "2026-08-14T19:28:19.061Z",
		"size": 588,
		"path": "../public/assets/auth.callback-B0gdKpuj.js"
	},
	"/assets/board-Cp0sakk5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"461-RFhWBf3XoR373EkyHps/J6PUREQ\"",
		"mtime": "2026-08-14T19:28:19.061Z",
		"size": 1121,
		"path": "../public/assets/board-Cp0sakk5.js"
	},
	"/assets/auth-DMQx6xVr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f01-B/rzO0VVcUpbHPK4p90EwuEWRHg\"",
		"mtime": "2026-08-14T19:28:19.061Z",
		"size": 7937,
		"path": "../public/assets/auth-DMQx6xVr.js"
	},
	"/assets/calendar-Dn9uAnyP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15ff-Mynu4swYMWP3/izeJaWX1wzH6gs\"",
		"mtime": "2026-08-14T19:28:19.070Z",
		"size": 5631,
		"path": "../public/assets/calendar-Dn9uAnyP.js"
	},
	"/assets/booking.functions-C2syldxv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d9e-hAAgAOI70vSXGI3bkcUq67q8Qiw\"",
		"mtime": "2026-08-14T19:28:19.070Z",
		"size": 3486,
		"path": "../public/assets/booking.functions-C2syldxv.js"
	},
	"/assets/cards-D3k2Ojoo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1593-C+FQQcNwtBf/VNCU3Fhl26UQUEM\"",
		"mtime": "2026-08-14T19:28:19.076Z",
		"size": 5523,
		"path": "../public/assets/cards-D3k2Ojoo.js"
	},
	"/assets/book._slug-Bynkku_E.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"130d-q7FABFVyYYa1wmAoV4wDIZODPAA\"",
		"mtime": "2026-08-14T19:28:19.070Z",
		"size": 4877,
		"path": "../public/assets/book._slug-Bynkku_E.js"
	},
	"/assets/badge-BFyg29-9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"325-l5SnpXLiMwQIsWXCfgrwF+NPGNI\"",
		"mtime": "2026-08-14T19:28:19.061Z",
		"size": 805,
		"path": "../public/assets/badge-BFyg29-9.js"
	},
	"/assets/ClientOnly-C6GwTPUC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"357b-ngfG2WzcsVUMzyM3ElkJXecpzMM\"",
		"mtime": "2026-08-14T19:28:19.027Z",
		"size": 13691,
		"path": "../public/assets/ClientOnly-C6GwTPUC.js"
	},
	"/assets/checkbox-D9NUVct6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137e-PmxvWj/+Wju6OCZzhejxGHDIy9E\"",
		"mtime": "2026-08-14T19:28:19.076Z",
		"size": 4990,
		"path": "../public/assets/checkbox-D9NUVct6.js"
	},
	"/assets/contact-BkKgEVZ8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7c6-G3HvcVvp1iJAXeXi9dZgzetDffM\"",
		"mtime": "2026-08-14T19:28:19.082Z",
		"size": 1990,
		"path": "../public/assets/contact-BkKgEVZ8.js"
	},
	"/assets/CrudSection-Djwyd01x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1df9-i6NUG5qHOQPQtlh6/n2tJbmtV8A\"",
		"mtime": "2026-08-14T19:28:19.034Z",
		"size": 7673,
		"path": "../public/assets/CrudSection-Djwyd01x.js"
	},
	"/assets/dashboard-DHAwmL3d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e99-6bJOHBG9ll6QuH3Korw6luM+7LE\"",
		"mtime": "2026-08-14T19:28:19.082Z",
		"size": 3737,
		"path": "../public/assets/dashboard-DHAwmL3d.js"
	},
	"/assets/donors-CZUs6Bwy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72c-hBDGEY2IIwR2c7ASQfDq79iubfQ\"",
		"mtime": "2026-08-14T19:28:19.087Z",
		"size": 1836,
		"path": "../public/assets/donors-CZUs6Bwy.js"
	},
	"/assets/donate-DV8HhC92.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1027-HXAhjO5Eo6M6jAKQwTGPsgdj4Lw\"",
		"mtime": "2026-08-14T19:28:19.082Z",
		"size": 4135,
		"path": "../public/assets/donate-DV8HhC92.js"
	},
	"/assets/events._slug-DtQpi5_w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a65-zqPFY+bqtsh4CuyMNTxFXH7jeDI\"",
		"mtime": "2026-08-14T19:28:19.090Z",
		"size": 6757,
		"path": "../public/assets/events._slug-DtQpi5_w.js"
	},
	"/assets/jsx-runtime-B4O0D1CJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2396-JkOJhrmw+WC/eO2XXbb6Jxdq2v0\"",
		"mtime": "2026-08-14T19:28:19.096Z",
		"size": 9110,
		"path": "../public/assets/jsx-runtime-B4O0D1CJ.js"
	},
	"/assets/label-Bo7h-5WZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ae-NUbLan3FWhtavONxmhWyKr4Gj04\"",
		"mtime": "2026-08-14T19:28:19.100Z",
		"size": 686,
		"path": "../public/assets/label-Bo7h-5WZ.js"
	},
	"/assets/matchContext-D9505_Ay.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-GbkzsM7LS8MjXGLNDK7Q+bsAamA\"",
		"mtime": "2026-08-14T19:28:19.102Z",
		"size": 142,
		"path": "../public/assets/matchContext-D9505_Ay.js"
	},
	"/assets/library-BbtCAl2y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"591-pUb/eCo1Qi3oPvQBSXef+UTx1pk\"",
		"mtime": "2026-08-14T19:28:19.102Z",
		"size": 1425,
		"path": "../public/assets/library-BbtCAl2y.js"
	},
	"/assets/input-c2Fd9up5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26d-+VH91gP3EwbxmbWcfKrenR5q8JU\"",
		"mtime": "2026-08-14T19:28:19.092Z",
		"size": 621,
		"path": "../public/assets/input-c2Fd9up5.js"
	},
	"/assets/events.index-C6A1WAh9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"666-g3k1TkqxLFf4uODIKHw4gTZEy0I\"",
		"mtime": "2026-08-14T19:28:19.092Z",
		"size": 1638,
		"path": "../public/assets/events.index-C6A1WAh9.js"
	},
	"/assets/link-DKSY9OH8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1166-1CRUcOOjZK9C5NQAZIM/LJgnWK8\"",
		"mtime": "2026-08-14T19:28:19.102Z",
		"size": 4454,
		"path": "../public/assets/link-DKSY9OH8.js"
	},
	"/assets/mutation-qGWI3pOr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d36-13R/CarRybY1I7KeAUtT3KtlLLM\"",
		"mtime": "2026-08-14T19:28:19.102Z",
		"size": 3382,
		"path": "../public/assets/mutation-qGWI3pOr.js"
	},
	"/assets/qss-B4cMWIbE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1fb-kpj54gmFnkItM+/8hrCMxcASZYU\"",
		"mtime": "2026-08-14T19:28:19.112Z",
		"size": 507,
		"path": "../public/assets/qss-B4cMWIbE.js"
	},
	"/assets/pay._slug-CDSu5_M9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec6-wLPKys09+UpuK+kQrQoojvtB/z4\"",
		"mtime": "2026-08-14T19:28:19.102Z",
		"size": 3782,
		"path": "../public/assets/pay._slug-CDSu5_M9.js"
	},
	"/assets/payments.functions-DbLRUi--.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-064Z7AAdY32tY1e8IPjuVhWWNO4\"",
		"mtime": "2026-08-14T19:28:19.112Z",
		"size": 279,
		"path": "../public/assets/payments.functions-DbLRUi--.js"
	},
	"/assets/profile-ONiKQ0O_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e0-kHgM9JUT/u0iXmQLMjAqPEZAl1E\"",
		"mtime": "2026-08-14T19:28:19.112Z",
		"size": 1760,
		"path": "../public/assets/profile-ONiKQ0O_.js"
	},
	"/assets/react-dom-DtLOucPT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dde-BTWxfEvBGX7Kd5m/qvdLYn6mbXE\"",
		"mtime": "2026-08-14T19:28:19.120Z",
		"size": 3550,
		"path": "../public/assets/react-dom-DtLOucPT.js"
	},
	"/assets/queryOptions-Dfvzj6n2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-swOrbCYhZ0gnyks4Amdj937R/Ts\"",
		"mtime": "2026-08-14T19:28:19.120Z",
		"size": 38,
		"path": "../public/assets/queryOptions-Dfvzj6n2.js"
	},
	"/assets/receipt-DR5vrXQt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c34-Noa/Zgv+Enzj9sK2dyxeOAJ86Ck\"",
		"mtime": "2026-08-14T19:28:19.126Z",
		"size": 3124,
		"path": "../public/assets/receipt-DR5vrXQt.js"
	},
	"/assets/priests-BAG26Uza.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85c-C4Jul1oLxYYc3zRra5QYuPDinNE\"",
		"mtime": "2026-08-14T19:28:19.112Z",
		"size": 2140,
		"path": "../public/assets/priests-BAG26Uza.js"
	},
	"/assets/root-DLTE-HSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20-vSYConOtSP6ciwr9zKsPixNwWmc\"",
		"mtime": "2026-08-14T19:28:19.130Z",
		"size": 32,
		"path": "../public/assets/root-DLTE-HSj.js"
	},
	"/assets/routes-DbK-esjT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5dab-bctWV961kTA0QmG/rtWCX6Rnyps\"",
		"mtime": "2026-08-14T19:28:19.130Z",
		"size": 23979,
		"path": "../public/assets/routes-DbK-esjT.js"
	},
	"/assets/route-bX-M1iQ4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e-k8oieIsl892RAnUXLdZfLgGYCI0\"",
		"mtime": "2026-08-14T19:28:19.130Z",
		"size": 142,
		"path": "../public/assets/route-bX-M1iQ4.js"
	},
	"/assets/index-pjkoNHHm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9b13b-ZmEhwXNtapmgG7qtCUPrtCHMqQs\"",
		"mtime": "2026-08-14T19:28:18.996Z",
		"size": 635195,
		"path": "../public/assets/index-pjkoNHHm.js"
	},
	"/assets/services.index-DAzTevmn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"586-B5lryj39rQzy78B+mmaMmvUuR7I\"",
		"mtime": "2026-08-14T19:28:19.136Z",
		"size": 1414,
		"path": "../public/assets/services.index-DAzTevmn.js"
	},
	"/assets/services._slug-B1Nt0T36.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d78-PKnuty0TdPfktlfM4O99DOkjSMU\"",
		"mtime": "2026-08-14T19:28:19.136Z",
		"size": 3448,
		"path": "../public/assets/services._slug-B1Nt0T36.js"
	},
	"/assets/textarea-Dok8eR3W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"207-BYXFaEyK1rXGbTLqWVsbtBsgDzs\"",
		"mtime": "2026-08-14T19:28:19.136Z",
		"size": 519,
		"path": "../public/assets/textarea-Dok8eR3W.js"
	},
	"/assets/temple-hero-Be2RZu1Z.jpg": {
		"type": "image/jpeg",
		"etag": "\"20f25-UNKRyxvKSSE4TPdSbC5fMini2FA\"",
		"mtime": "2026-08-14T19:28:19.160Z",
		"size": 134949,
		"path": "../public/assets/temple-hero-Be2RZu1Z.jpg"
	},
	"/assets/styles-DEqRi4aV.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15559-qcuVQqagCOctqXCtjBwmgwhmQGA\"",
		"mtime": "2026-08-14T19:28:19.160Z",
		"size": 87385,
		"path": "../public/assets/styles-DEqRi4aV.css"
	},
	"/assets/timezone-C2bJl7UY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a-WPhkGjDFwgbISntettun/pj4uWM\"",
		"mtime": "2026-08-14T19:28:19.140Z",
		"size": 314,
		"path": "../public/assets/timezone-C2bJl7UY.js"
	},
	"/assets/timings-D_fDxert.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9c1-Jhe4JTVktKPwMzO09yahzJnv3AY\"",
		"mtime": "2026-08-14T19:28:19.140Z",
		"size": 2497,
		"path": "../public/assets/timings-D_fDxert.js"
	},
	"/assets/useRouter-DAvBUBjP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-dAE92KOqhZGsCk9XQYTFs2Yet9w\"",
		"mtime": "2026-08-14T19:28:19.150Z",
		"size": 151,
		"path": "../public/assets/useRouter-DAvBUBjP.js"
	},
	"/assets/useQuery-B3REq6qS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60-socEGpZRnoSaYiOQdck/TBHXU9Q\"",
		"mtime": "2026-08-14T19:28:19.150Z",
		"size": 96,
		"path": "../public/assets/useQuery-B3REq6qS.js"
	},
	"/assets/useBaseQuery-BJPl1b_M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f06d-WtfznebF/z+VCZ+FSZPLpysf7eQ\"",
		"mtime": "2026-08-14T19:28:19.144Z",
		"size": 61549,
		"path": "../public/assets/useBaseQuery-BJPl1b_M.js"
	},
	"/assets/useStore-DtwDjW1x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"152c-rnUuPKa2w6vHhf5xMbJXrUUSRDs\"",
		"mtime": "2026-08-14T19:28:19.152Z",
		"size": 5420,
		"path": "../public/assets/useStore-DtwDjW1x.js"
	},
	"/assets/utils-DojpP95n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7e-rehYKtt6GcJPoEspFNv2VomMQ30\"",
		"mtime": "2026-08-14T19:28:19.157Z",
		"size": 27262,
		"path": "../public/assets/utils-DojpP95n.js"
	},
	"/assets/temple-hero-2-DTp26VZs.jpg": {
		"type": "image/jpeg",
		"etag": "\"b58fc-iZvk+OC3DUb0FURB7hAIFxiCv50\"",
		"mtime": "2026-08-14T19:28:19.160Z",
		"size": 743676,
		"path": "../public/assets/temple-hero-2-DTp26VZs.jpg"
	},
	"/assets/temple-hero-1-Bs0qSYel.jpg": {
		"type": "image/jpeg",
		"etag": "\"f61d6-g7rq28zEthN4mxBzbUesNWqvdG0\"",
		"mtime": "2026-08-14T19:28:19.160Z",
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
var _lazy_Dl0C2G = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_Dl0C2G
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
