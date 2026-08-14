import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as adminQuery } from "./queries-CH7ElXGN.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as CrudSection } from "./CrudSection--F1t5A44.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.events-s0Wmq_Kf.js
var import_jsx_runtime = require_jsx_runtime();
var EVENT_FIELDS = [
	{
		name: "title",
		label: "Event title"
	},
	{
		name: "slug",
		label: "URL slug"
	},
	{
		name: "starts_at",
		label: "Starts at",
		type: "datetime"
	},
	{
		name: "ends_at",
		label: "Ends at",
		type: "datetime"
	},
	{
		name: "category",
		label: "Category"
	},
	{
		name: "deity",
		label: "Deity"
	},
	{
		name: "location",
		label: "Location"
	},
	{
		name: "fee_cents",
		label: "Fee (USD)",
		type: "money"
	},
	{
		name: "image_url",
		label: "Image URL",
		full: true
	},
	{
		name: "registration_required",
		label: "Registration required",
		type: "checkbox"
	},
	{
		name: "is_annual",
		label: "Yearly / annual event",
		type: "checkbox"
	},
	{
		name: "volunteers_needed",
		label: "Volunteers needed",
		type: "checkbox"
	},
	{
		name: "sponsor_name",
		label: "Sponsor name"
	},
	{
		name: "sponsor_contact",
		label: "Sponsor contact"
	},
	{
		name: "sponsorship_amount_cents",
		label: "Sponsorship amount (USD)",
		type: "money"
	},
	{
		name: "sponsor_note",
		label: "Sponsorship note",
		full: true
	},
	{
		name: "description",
		label: "Description",
		type: "textarea"
	}
];
var ANNOUNCEMENT_FIELDS = [
	{
		name: "title",
		label: "Notice title"
	},
	{
		name: "starts_at",
		label: "Show from",
		type: "datetime"
	},
	{
		name: "ends_at",
		label: "Show until",
		type: "datetime"
	},
	{
		name: "link_url",
		label: "Link URL",
		full: true
	},
	{
		name: "is_published",
		label: "Published",
		type: "checkbox"
	},
	{
		name: "body",
		label: "Message",
		type: "textarea"
	}
];
var ITEM_FIELDS = [
	{
		name: "event_id",
		label: "Event",
		type: "select"
	},
	{
		name: "name",
		label: "Item name"
	},
	{
		name: "quantity",
		label: "Quantity"
	},
	{
		name: "display_order",
		label: "Display order",
		type: "number"
	},
	{
		name: "note",
		label: "Note",
		type: "textarea"
	}
];
var PHOTO_FIELDS = [
	{
		name: "image_url",
		label: "Photo URL",
		full: true
	},
	{
		name: "title",
		label: "Title"
	},
	{
		name: "year",
		label: "Year",
		type: "number"
	},
	{
		name: "taken_on",
		label: "Taken on",
		type: "date"
	},
	{
		name: "event_id",
		label: "Event (optional)",
		type: "select"
	},
	{
		name: "display_order",
		label: "Display order",
		type: "number"
	},
	{
		name: "caption",
		label: "Caption",
		type: "textarea"
	}
];
function AdminEvents() {
	const { data } = useQuery(adminQuery);
	if (!data?.isAdmin) return null;
	const eventOptions = data.events.map((e) => ({
		value: e.id,
		label: e.title
	}));
	const withOptions = (fields) => fields.map((f) => f.name === "event_id" ? {
		...f,
		options: eventOptions
	} : f);
	const eventTitle = (id) => data.events.find((e) => e.id === id)?.title ?? "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudSection, {
				table: "events",
				title: "Events & festivals",
				singular: "event",
				rows: data.events,
				primaryField: "title",
				secondaryField: (row) => new Date(String(row["starts_at"])).toLocaleString(),
				fields: EVENT_FIELDS
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudSection, {
				table: "announcements",
				title: "Announcements",
				description: "Short notices displayed on the home page.",
				singular: "notice",
				rows: data.announcements,
				primaryField: "title",
				secondaryField: (row) => row["is_published"] ? "Published" : "Draft",
				fields: ANNOUNCEMENT_FIELDS
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudSection, {
				table: "event_items",
				title: "Pooja / event items",
				description: "Items devotees are asked to bring for a specific pooja or event.",
				singular: "item",
				rows: data.eventItems,
				primaryField: "name",
				secondaryField: (row) => [eventTitle(row["event_id"]), row["quantity"]].filter(Boolean).join(" · "),
				fields: withOptions(ITEM_FIELDS)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudSection, {
				table: "event_photos",
				title: "Past event photo gallery",
				description: "Photographs from earlier festivals and events at the temple.",
				singular: "photo",
				rows: data.eventPhotos,
				primaryField: "title",
				secondaryField: (row) => [row["year"], eventTitle(row["event_id"])].filter(Boolean).join(" · "),
				fields: withOptions(PHOTO_FIELDS)
			})
		]
	});
}
//#endregion
export { AdminEvents as component };
