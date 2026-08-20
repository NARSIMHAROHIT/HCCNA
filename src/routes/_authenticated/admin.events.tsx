import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CrudSection, type FieldDef } from "@/components/admin/CrudSection";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: AdminEvents,
});

const EVENT_FIELDS: FieldDef[] = [
  { name: "title", label: "Event title" },
  { name: "slug", label: "URL slug" },
  { name: "starts_at", label: "Starts at", type: "datetime" },
  { name: "ends_at", label: "Ends at", type: "datetime" },
  { name: "category", label: "Category" },
  { name: "deity", label: "Deity" },
  { name: "location", label: "Location" },
  { name: "fee_cents", label: "Fee (USD)", type: "money" },
  { name: "image_url", label: "Event image", type: "image", folder: "events", full: true },
  { name: "registration_required", label: "Registration required", type: "checkbox" },
  { name: "is_annual", label: "Yearly / annual event", type: "checkbox" },
  { name: "volunteers_needed", label: "Volunteers needed", type: "checkbox" },
  { name: "sponsor_name", label: "Sponsor name" },
  { name: "sponsor_contact", label: "Sponsor contact" },
  { name: "sponsorship_amount_cents", label: "Sponsorship amount (USD)", type: "money" },
  { name: "sponsor_note", label: "Sponsorship note", full: true },
  { name: "description", label: "Description", type: "textarea" },
];

const ANNOUNCEMENT_FIELDS: FieldDef[] = [
  { name: "title", label: "Notice title" },
  { name: "starts_at", label: "Show from", type: "datetime" },
  { name: "ends_at", label: "Show until", type: "datetime" },
  { name: "link_url", label: "Link URL", full: true },
  { name: "is_published", label: "Published", type: "checkbox" },
  { name: "body", label: "Message", type: "textarea" },
];

const ITEM_FIELDS: FieldDef[] = [
  { name: "event_id", label: "Event", type: "select" },
  { name: "name", label: "Item name" },
  { name: "quantity", label: "Quantity" },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "note", label: "Note", type: "textarea" },
];

const PHOTO_FIELDS: FieldDef[] = [
  { name: "image_url", label: "Photograph", type: "image", folder: "gallery", full: true },
  { name: "title", label: "Title" },
  { name: "year", label: "Year", type: "number" },
  { name: "taken_on", label: "Taken on", type: "date" },
  { name: "event_id", label: "Event (optional)", type: "select" },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "caption", label: "Caption", type: "textarea" },
];

function AdminEvents() {
  const { data } = useQuery(adminQuery);
  if (!data?.isAdmin) return null;

  const eventOptions = data.events.map((e) => ({ value: e.id, label: e.title }));
  const withOptions = (fields: FieldDef[]) =>
    fields.map((f) => (f.name === "event_id" ? { ...f, options: eventOptions } : f));
  const eventTitle = (id: unknown) => data.events.find((e) => e.id === id)?.title ?? "—";

  return (
    <div className="space-y-6">
      <CrudSection
        table="events"
        title="Events & festivals"
        singular="event"
        rows={data.events as never}
        primaryField="title"
        secondaryField={(row) => new Date(String(row["starts_at"])).toLocaleString()}
        fields={EVENT_FIELDS}
      />

      <CrudSection
        table="announcements"
        title="Announcements"
        description="Short notices displayed on the home page."
        singular="notice"
        rows={data.announcements as never}
        primaryField="title"
        secondaryField={(row) => (row["is_published"] ? "Published" : "Draft")}
        fields={ANNOUNCEMENT_FIELDS}
      />

      <CrudSection
        table="event_items"
        title="Pooja / event items"
        description="Items devotees are asked to bring for a specific pooja or event."
        singular="item"
        rows={data.eventItems as never}
        primaryField="name"
        secondaryField={(row) =>
          [eventTitle(row["event_id"]), row["quantity"]].filter(Boolean).join(" · ")
        }
        fields={withOptions(ITEM_FIELDS)}
      />

      <CrudSection
        table="event_photos"
        title="Past event photo gallery"
        description="Photographs from earlier festivals and events at the temple."
        singular="photo"
        rows={data.eventPhotos as never}
        primaryField="title"
        secondaryField={(row) =>
          [row["year"], eventTitle(row["event_id"])].filter(Boolean).join(" · ")
        }
        fields={withOptions(PHOTO_FIELDS)}
      />
    </div>
  );
}
