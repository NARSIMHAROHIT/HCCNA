import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { PageHeader, Prose, Section } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serviceQuery } from "@/lib/queries";
import { formatMoney } from "@/lib/timezone";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.service.name} — Book Online | HCCNA`;
    const description =
      loaderData.service.short_description ??
      `Book ${loaderData.service.name} with our temple priests at a time that suits you.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(serviceQuery(slug));
  if (!data) return null;
  const { service, temple, priests, deities } = data;

  return (
    <>
      <PageHeader
        eyebrow="Seva"
        title={service.name}
        {...(service.short_description ? { description: service.short_description } : {})}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            {deities.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {deities.map((d) => (
                  <figure key={d.id} className="surface-panel overflow-hidden">
                    <img
                      src={d.image_url ?? ""}
                      alt={d.name}
                      className="h-64 w-full object-cover"
                    />
                    <figcaption className="p-3">
                      <p className="font-display text-lg">{d.name}</p>
                      {d.description ? (
                        <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
                      ) : null}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
            {service.description ? <Prose html={service.description} /> : null}
            {service.preparation_instructions ? (
              <div className="surface-panel p-5">
                <h2 className="text-xl">How to prepare</h2>
                <p className="mt-2 text-sm text-muted-foreground">{service.preparation_instructions}</p>
              </div>
            ) : null}
            {service.required_materials ? (
              <div className="surface-panel p-5">
                <h2 className="text-xl">Materials</h2>
                <p className="mt-2 text-sm text-muted-foreground">{service.required_materials}</p>
              </div>
            ) : null}
            {priests.length ? (
              <div>
                <h2 className="text-xl">Priests who perform this seva</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {priests.map((p) => (
                    <Badge key={p!.id} variant="secondary">
                      {p!.full_name}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="surface-panel h-fit p-6">
            <p className="font-display text-3xl text-primary">
              {service.price_cents > 0 ? formatMoney(service.price_cents, temple.currency) : "By donation"}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium">{service.duration_minutes} minutes</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium capitalize">{service.location_type}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Minimum notice</dt>
                <dd className="font-medium">{service.min_notice_hours} hours</dd>
              </div>
            </dl>
            <Button asChild className="mt-6 w-full" size="lg">
              <Link to="/pay/$slug" params={{ slug: service.slug }}>
                Sponsor & pay online
              </Link>
            </Button>
            <Button asChild variant="outline" className="mt-3 w-full" size="lg">
              <Link to="/book/$slug" params={{ slug: service.slug }}>
                Choose a time
              </Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Card payments are processed securely by Stripe and a receipt is issued instantly. Times
              shown in {temple.timezone}.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
