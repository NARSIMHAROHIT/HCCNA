import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { RecordDialog, type FieldDef } from "@/components/admin/CrudSection";
import { Button } from "@/components/ui/button";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/temple")({
  component: AdminTemple,
});

const FIELDS: FieldDef[] = [
  { name: "name", label: "Temple name" },
  { name: "short_name", label: "Short name" },
  { name: "tagline", label: "Tagline", full: true },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "website", label: "Website" },
  { name: "address_line1", label: "Address line 1" },
  { name: "address_line2", label: "Address line 2" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "postal_code", label: "Postal code" },
  { name: "country", label: "Country" },
  { name: "facebook_url", label: "Facebook URL" },
  { name: "instagram_url", label: "Instagram URL" },
  { name: "youtube_url", label: "YouTube URL" },
  { name: "whatsapp_url", label: "WhatsApp URL" },
  { name: "hero_image_url", label: "Hero image URL", full: true },
  { name: "about_html", label: "About (HTML allowed)", type: "textarea" },
  { name: "history_html", label: "History (HTML allowed)", type: "textarea" },
  { name: "mission_html", label: "Mission (HTML allowed)", type: "textarea" },
  { name: "seo_title", label: "SEO title", full: true },
  { name: "seo_description", label: "SEO description", type: "textarea" },
];

function AdminTemple() {
  const { data } = useQuery(adminQuery);
  const [open, setOpen] = useState(false);
  if (!data?.isAdmin) return null;
  const t = data.temple;

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl">Temple information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Shown across the website header, footer, about and contact pages.
            </p>
          </div>
          <Button size="sm" onClick={() => setOpen(true)}>
            Edit details
          </Button>
        </div>

        <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {[
            ["Name", t.name],
            ["Tagline", t.tagline],
            ["Phone", t.phone],
            ["Email", t.email],
            ["Address", [t.address_line1, t.city, t.state, t.postal_code].filter(Boolean).join(", ")],
            ["Website", t.website],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex justify-between gap-4 border-b border-border/60 py-2">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-right text-sm font-semibold">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      {open ? (
        <RecordDialog
          table="temples"
          singular="temple details"
          fields={FIELDS}
          row={t as never}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
