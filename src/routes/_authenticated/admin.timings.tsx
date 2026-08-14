import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CrudSection, type FieldDef } from "@/components/admin/CrudSection";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/timings")({
  component: AdminTimings,
});

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const FIELDS: FieldDef[] = [
  { name: "label", label: "Label (e.g. Darshan hours)" },
  {
    name: "day_of_week",
    label: "Day of week",
    type: "select",
    options: DAYS.map((d, i) => ({ value: String(i), label: d })),
  },
  { name: "special_date", label: "Special date (overrides day)", type: "date" },
  { name: "opens_at", label: "Opens at", type: "time" },
  { name: "closes_at", label: "Closes at", type: "time" },
  { name: "is_closed", label: "Closed all day", type: "checkbox" },
  { name: "note", label: "Note", type: "textarea" },
];

function AdminTimings() {
  const { data } = useQuery(adminQuery);
  if (!data?.isAdmin) return null;

  return (
    <CrudSection
      table="temple_schedules"
      title="Temple timings"
      description="Weekly darshan hours and special-date exceptions shown on the Timings page."
      singular="timing"
      rows={data.schedules as never}
      primaryField="label"
      secondaryField={(row) =>
        [
          row["day_of_week"] === null ? String(row["special_date"] ?? "") : DAYS[Number(row["day_of_week"])],
          row["is_closed"] ? "Closed" : `${row["opens_at"] ?? "—"} – ${row["closes_at"] ?? "—"}`,
        ]
          .filter(Boolean)
          .join(" · ")
      }
      fields={FIELDS}
    />
  );
}
