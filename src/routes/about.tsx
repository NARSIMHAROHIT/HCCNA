import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, Prose, Section, SectionHeading } from "@/components/site/primitives";
import { siteQuery } from "@/lib/queries";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Our Temple — Hindu Cultural Center of North Alabama" },
      {
        name: "description",
        content:
          "Our history, mission, and the deities worshipped at the Hindu Cultural Center of North Alabama.",
      },
      { property: "og:title", content: "About Our Temple" },
      { property: "og:description", content: "History, mission and deities of our temple." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const { data } = useSuspenseQuery(siteQuery);
  const t = data.temple;

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={`About ${t.short_name ?? t.name}`}
        {...(t.tagline ? { description: t.tagline } : {})}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            {t.about_html ? (
              <div>
                <h2 className="mb-4 text-2xl">Our story</h2>
                <Prose html={t.about_html} />
              </div>
            ) : null}
            {t.mission_html ? (
              <div>
                <h2 className="mb-4 text-2xl">Our mission</h2>
                <Prose html={t.mission_html} />
              </div>
            ) : null}
          </div>

          <aside className="surface-panel h-fit p-6">
            <h2 className="text-xl">Temple details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Address</dt>
                <dd className="font-medium">
                  {t.address_line1}
                  <br />
                  {[t.city, t.state, t.postal_code].filter(Boolean).join(", ")}
                </dd>
              </div>
              {t.phone ? (
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium">{t.phone}</dd>
                </div>
              ) : null}
              {t.email ? (
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium break-all">{t.email}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted-foreground">Timezone</dt>
                <dd className="font-medium">{t.timezone}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      {data.deities.length ? (
        <Section tone="muted">
          <SectionHeading
            eyebrow="Sanctum"
            title="Deities worshipped here"
            description="Daily abhishekam, alankaram and archana are offered to each deity in the temple."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.deities.map((d) => (
              <article key={d.id} className="surface-panel p-5">
                <h3 className="text-lg">{d.name}</h3>
                {d.description ? <p className="mt-3 text-sm text-muted-foreground">{d.description}</p> : null}
              </article>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
