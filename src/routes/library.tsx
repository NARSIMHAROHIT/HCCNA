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
        content:
          "Read scriptures, stotras, bhajan collections and study material shared by our temple.",
      },
      { property: "og:title", content: "Digital Library" },
      {
        property: "og:description",
        content: "Scriptures, stotras and study material from our temple.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Library,
});

type BookRow = { id: string; category: string | null } & Record<string, unknown>;

/** Group books under their category heading, keeping the admin's display order. */
function groupByCategory<T extends BookRow>(books: T[]): [string, T[]][] {
  const groups: [string, T[]][] = [];
  for (const book of books) {
    const key = book.category ?? "Other resources";
    const existing = groups.find(([name]) => name === key);
    if (existing) existing[1].push(book);
    else groups.push([key, [book]]);
  }
  return groups;
}

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
          <div className="space-y-12">
            {groupByCategory(data.books).map(([category, books]) => (
              <div key={category}>
                <h2 className="text-2xl">{category}</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {books.map((b) => (
                    <article key={b.id} className="surface-panel flex h-full flex-col p-5">
                      <h3 className="font-display text-lg leading-snug">{b.title}</h3>
                      {b.author ? (
                        <p className="mt-1 text-sm text-muted-foreground">{b.author}</p>
                      ) : null}
                      {b.description ? (
                        <p className="mt-3 flex-1 text-sm text-muted-foreground">{b.description}</p>
                      ) : (
                        <div className="flex-1" />
                      )}
                      {b.language ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          <Badge variant="secondary">{b.language}</Badge>
                        </div>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {b.file_url ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={b.file_url} target="_blank" rel="noreferrer">
                              Download PDF
                            </a>
                          </Button>
                        ) : null}
                        {b.external_url ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={b.external_url} target="_blank" rel="noreferrer">
                              Read online
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
