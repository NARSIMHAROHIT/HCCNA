import { r as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { l as panchangQuery } from "./queries-CH7ElXGN.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, p as Section, t as Button } from "./router-FwX4_uf4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-C1Fj_lWq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function CalendarPage() {
	const initial = useSuspenseQuery(panchangQuery()).data;
	const today = /* @__PURE__ */ new Date();
	const todayISO = [
		today.getFullYear(),
		String(today.getMonth() + 1).padStart(2, "0"),
		String(today.getDate()).padStart(2, "0")
	].join("-");
	const [cursor, setCursor] = (0, import_react.useState)({
		year: initial.year,
		month: initial.month
	});
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(todayISO);
	const [searchDate, setSearchDate] = (0, import_react.useState)(todayISO);
	const { data } = useSuspenseQuery(panchangQuery(cursor.year, cursor.month));
	const selectedDay = data.days.find((d) => d.date === selectedDate) ?? null;
	const shift = (delta) => {
		const next = cursor.month + delta;
		if (next < 1) setCursor({
			year: cursor.year - 1,
			month: 12
		});
		else if (next > 12) setCursor({
			year: cursor.year + 1,
			month: 1
		});
		else setCursor({
			year: cursor.year,
			month: next
		});
	};
	const jumpToDate = (dateValue) => {
		if (!dateValue) return;
		const [year, month, day] = dateValue.split("-").map(Number);
		if (!year || !month || !day) return;
		setSelectedDate(dateValue);
		setSearchDate(dateValue);
		setCursor({
			year,
			month
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Panchang",
		title: "Hindu calendar",
		description: `Computed for ${data.location.label} (${data.location.timezone}) using the temple's own coordinates.`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border bg-card/40 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col gap-2 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						htmlFor: "search-date",
						children: "Search date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "search-date",
						type: "date",
						value: searchDate,
						onChange: (event) => setSearchDate(event.target.value),
						className: "h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none ring-0 transition focus:border-primary"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "default",
						size: "sm",
						onClick: () => jumpToDate(searchDate),
						children: "Search"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => jumpToDate(todayISO),
						children: "Today"
					})]
				})]
			}), selectedDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "Selected date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "mt-1 text-2xl font-display",
						children: [
							selectedDay.weekdayName,
							", ",
							selectedDay.day,
							" ",
							MONTHS[Number(selectedDay.date.slice(5, 7)) - 1],
							" ",
							selectedDay.date.slice(0, 4)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							selectedDay.tithiName,
							" (",
							selectedDay.paksha,
							") • ",
							selectedDay.nakshatraName
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-background/70 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-wide",
								children: "Sunrise"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium text-foreground",
								children: selectedDay.sunrise
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-background/70 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-wide",
								children: "Sunset"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium text-foreground",
								children: selectedDay.sunset
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-background/70 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-wide",
								children: "Rahu Kalam"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium text-foreground",
								children: selectedDay.rahuKalam
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-background/70 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-wide",
								children: "Yoga"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium text-foreground",
								children: selectedDay.yogaName
							})]
						})
					]
				})]
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => shift(-1),
					children: "Previous"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl",
					children: [
						MONTHS[data.month - 1],
						" ",
						data.year
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => shift(1),
					children: "Next"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: data.days.map((d) => {
				const isToday = d.date === todayISO;
				const isSelected = d.date === selectedDate;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					onClick: () => {
						setSelectedDate(d.date);
						setSearchDate(d.date);
					},
					className: [
						"surface-panel cursor-pointer p-4 transition-colors",
						isToday ? "border-2 border-primary shadow-[0_0_0_1px_rgba(59,130,246,0.1)]" : "",
						isSelected ? "ring-2 ring-primary/70" : ""
					].filter(Boolean).join(" "),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl",
								children: d.day
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: d.weekdayName
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 space-y-1 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Tithi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "text-right font-medium text-foreground",
										children: [
											d.tithiName,
											" (",
											d.paksha,
											")"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Nakshatra" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-right font-medium text-foreground",
										children: d.nakshatraName
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Sunrise" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-right font-medium text-foreground",
										children: d.sunrise
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Rahu Kalam" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-right font-medium text-foreground",
										children: d.rahuKalam
									})]
								})
							]
						}),
						d.observances.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 rounded bg-accent/60 px-2 py-1 text-xs text-accent-foreground",
							children: d.observances.join(" • ")
						}) : null
					]
				}, d.date);
			})
		})
	] })] });
}
//#endregion
export { CalendarPage as component };
