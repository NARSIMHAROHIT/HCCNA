import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { PageHeader, Section } from "@/components/site/primitives";
import { siteQuery } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Directions — HCCNA" },
      {
        name: "description",
        content:
          "Temple address, phone, email and directions for the Hindu Cultural Center of North Alabama.",
      },
      { property: "og:title", content: "Contact & Directions" },
      {
        property: "og:description",
        content: "Address, phone, email and directions to our temple.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data } = useSuspenseQuery(siteQuery);
  const t = data.temple;
  // The postal address may be a P.O. Box, which Google cannot place on a map.
  // `map_address` (Admin -> Temple details) is the physical location; fall back
  // to the postal address when it has not been set.
  const mapQuery = encodeURIComponent(
    t.map_address?.trim() ||
      [t.address_line1, t.city, t.state, t.postal_code].filter(Boolean).join(", "),
  );

  return (
    <>
      <PageHeader
        eyebrow="Visit us"
        title="Contact & directions"
        description="We welcome devotees and visitors of all backgrounds. Please remove footwear before entering the sanctum."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="surface-panel p-6">
            <h2 className="text-xl">Temple office</h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-muted-foreground">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {t.address_line1}
                  <br />
                  {[t.city, t.state, t.postal_code].filter(Boolean).join(", ")}
                </span>
              </p>
              {t.phone ? (
                <p className="flex items-center gap-2">
                  <Phone className="size-4" aria-hidden />
                  <a className="hover:text-foreground" href={`tel:${t.phone}`}>
                    {t.phone}
                  </a>
                </p>
              ) : null}
              {t.email ? (
                <p className="flex items-center gap-2">
                  <Mail className="size-4" aria-hidden />
                  <a className="hover:text-foreground" href={`mailto:${t.email}`}>
                    {t.email}
                  </a>
                </p>
              ) : null}
            </address>
            <a
              className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
          <div className="surface-panel overflow-hidden p-0">
            <iframe
              title="Temple location map"
              className="h-full min-h-72 w-full"
              loading="lazy"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
