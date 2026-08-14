import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CrudSection, type FieldDef } from "@/components/admin/CrudSection";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/community")({
  component: AdminCommunity,
});

const BOARD_FIELDS: FieldDef[] = [
  { name: "full_name", label: "Full name" },
  { name: "position", label: "Position" },
  { name: "term", label: "Term (e.g. 2025–2026)" },
  { name: "email", label: "Email" },
  { name: "phone", label: "Phone" },
  { name: "photo_url", label: "Photo URL" },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "is_active", label: "Currently serving", type: "checkbox" },
  { name: "bio", label: "Bio", type: "textarea" },
];

const DONOR_FIELDS: FieldDef[] = [
  { name: "donor_name", label: "Donor name" },
  { name: "tier", label: "Tier (e.g. Patron, Benefactor)" },
  { name: "category", label: "Category (e.g. Temple construction)" },
  { name: "amount_cents", label: "Amount (USD)", type: "money" },
  { name: "year", label: "Year", type: "number" },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "is_anonymous", label: "Show as anonymous", type: "checkbox" },
  { name: "is_published", label: "Show on donor wall", type: "checkbox" },
  { name: "message", label: "Message", type: "textarea" },
];

const PRIEST_FIELDS: FieldDef[] = [
  { name: "full_name", label: "Full name" },
  { name: "title", label: "Title" },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "photo_url", label: "Photo URL" },
  { name: "working_since", label: "Working at the temple since", type: "date" },
  { name: "working_days", label: "Working days (comma separated)", type: "list", full: true },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "is_active", label: "Active", type: "checkbox" },
  { name: "qualifications", label: "Qualifications", type: "textarea" },
  { name: "biography", label: "Biography", type: "textarea" },
];

function AdminCommunity() {
  const { data } = useQuery(adminQuery);
  if (!data?.isAdmin) return null;

  return (
    <div className="space-y-6">
      <CrudSection
        table="board_members"
        title="Board & executive committee"
        singular="member"
        rows={data.board as never}
        primaryField="full_name"
        secondaryField={(row) => String(row["position"] ?? "")}
        fields={BOARD_FIELDS}
      />

      <CrudSection
        table="donors"
        title="Donor wall"
        description="Recognise sponsors and major donors on the public donors page."
        singular="donor"
        rows={data.donors as never}
        primaryField="donor_name"
        secondaryField={(row) => [row["tier"], row["category"], row["year"]].filter(Boolean).join(" · ")}
        fields={DONOR_FIELDS}
      />

      <CrudSection
        table="priests"
        title="Priests"
        singular="priest"
        rows={data.priests as never}
        primaryField="full_name"
        secondaryField={(row) => String(row["title"] ?? "")}
        fields={PRIEST_FIELDS}
      />
    </div>
  );
}
