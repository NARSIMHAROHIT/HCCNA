import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CrudSection, type FieldDef } from "@/components/admin/CrudSection";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/poojas")({
  component: AdminPoojas,
});

function AdminPoojas() {
  const { data } = useQuery(adminQuery);
  if (!data?.isAdmin) return null;

  const categoryOptions = data.categories.map((c) => ({ value: c.id, label: c.name }));

  const serviceFields: FieldDef[] = [
    { name: "name", label: "Pooja / seva name" },
    { name: "slug", label: "URL slug" },
    { name: "category_id", label: "Deity / category", type: "select", options: categoryOptions },
    { name: "price_cents", label: "Price (USD, 0 = any amount)", type: "money" },
    { name: "duration_minutes", label: "Duration (minutes)", type: "number" },
    { name: "min_notice_hours", label: "Minimum notice (hours)", type: "number" },
    { name: "display_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Listed on the website", type: "checkbox" },
    { name: "short_description", label: "Short description", full: true },
    { name: "description", label: "Full description", type: "textarea" },
    { name: "preparation_instructions", label: "Preparation instructions", type: "textarea" },
    { name: "required_materials", label: "Materials devotees should bring", type: "textarea" },
  ];

  const categoryFields: FieldDef[] = [
    { name: "name", label: "Category name (e.g. Lord Jagannath)" },
    { name: "slug", label: "URL slug" },
    { name: "display_order", label: "Display order", type: "number" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  const money = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  return (
    <div className="space-y-6">
      <CrudSection
        table="services"
        title="Poojas, sevas & sponsorships"
        description="Prices here drive the public list and the secure checkout amount."
        singular="pooja"
        rows={data.services as never}
        primaryField="name"
        secondaryField={(row) =>
          [
            data.categories.find((c) => c.id === row["category_id"])?.name,
            money(Number(row["price_cents"] ?? 0)),
            row["is_active"] ? null : "Hidden",
          ]
            .filter(Boolean)
            .join(" · ")
        }
        fields={serviceFields}
      />

      <CrudSection
        table="service_categories"
        title="Deities & categories"
        singular="category"
        rows={data.categories as never}
        primaryField="name"
        secondaryField={(row) => String(row["slug"] ?? "")}
        fields={categoryFields}
      />

      <CrudSection
        table="deities"
        title="Deities & their pictures"
        description="Pictures shown on pooja pages when the pooja mentions that deity."
        singular="deity"
        rows={data.deities as never}
        primaryField="name"
        secondaryField={(row) => (row["image_url"] ? "Picture added" : "No picture yet")}
        fields={[
          { name: "name", label: "Deity name" },
          { name: "image_url", label: "Picture URL", full: true },
          { name: "display_order", label: "Display order", type: "number" },
          { name: "description", label: "Description", type: "textarea" },
        ]}
      />
    </div>
  );
}
