import { n as adminQuery } from "./queries-BRGPrPxK.mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as CrudSection } from "./CrudSection-Wn7twfrB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.timings-D5uU4O3O.js
var import_jsx_runtime = require_jsx_runtime();
var DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
var FIELDS = [
	{
		name: "label",
		label: "Label (e.g. Darshan hours)"
	},
	{
		name: "day_of_week",
		label: "Day of week",
		type: "select",
		options: DAYS.map((d, i) => ({
			value: String(i),
			label: d
		}))
	},
	{
		name: "special_date",
		label: "Special date (overrides day)",
		type: "date"
	},
	{
		name: "opens_at",
		label: "Opens at",
		type: "time"
	},
	{
		name: "closes_at",
		label: "Closes at",
		type: "time"
	},
	{
		name: "is_closed",
		label: "Closed all day",
		type: "checkbox"
	},
	{
		name: "note",
		label: "Note",
		type: "textarea"
	}
];
function AdminTimings() {
	const { data } = useQuery(adminQuery);
	if (!data?.isAdmin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudSection, {
		table: "temple_schedules",
		title: "Temple timings",
		description: "Weekly darshan hours and special-date exceptions shown on the Timings page.",
		singular: "timing",
		rows: data.schedules,
		primaryField: "label",
		secondaryField: (row) => [row["day_of_week"] === null ? String(row["special_date"] ?? "") : DAYS[Number(row["day_of_week"])], row["is_closed"] ? "Closed" : `${row["opens_at"] ?? "—"} – ${row["closes_at"] ?? "—"}`].filter(Boolean).join(" · "),
		fields: FIELDS
	});
}
//#endregion
export { AdminTimings as component };
