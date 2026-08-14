import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { booksQuery } from "@/lib/queries";

export const Route = createFileRoute("/library")({
  loader: ({ context }) => context.queryClient.ensureQueryData(booksQuery),
  head: () => ({
    meta: [
      { title: "Digital Library — Scriptures & Bhajans | HCCNA" },
      {
        name: "description",
        content: "Read scriptures, stotras, bhajan collections and study material shared by our temple.",
      },
      { property: "og:title", content: "Digital Library" },
      { property: "og:description", content: "Scriptures, stotras and study material from our temple." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Library,
});

function Library() {
  const { data } = useSuspenseQuery(booksQuery);
  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Digital library"
        description="Scriptures, stotras and cultural resources for devotees of every age."
      />
      <Section>
        {data.books.length === 0 ? (
          <EmptyState title="The library is being catalogued" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.books.map((b) => (
              <article key={b.id} className="surface-panel flex h-full flex-col p-5">
                <h2 className="text-lg leading-snug">{b.title}</h2>
                {b.author ? <p className="mt-1 text-sm text-muted-foreground">{b.author}</p> : null}
                {b.description ? (
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{b.description}</p>
                ) : (
                  <div className="flex-1" />
                )}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {b.category ? <Badge variant="secondary">{b.category}</Badge> : null}
                  {b.language ? <Badge variant="secondary">{b.language}</Badge> : null}
                </div>
                {b.file_url || b.external_url ? (
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <a href={(b.file_url ?? b.external_url)!} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
