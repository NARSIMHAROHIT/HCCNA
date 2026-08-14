import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { communityQuery } from "./donors";

export const Route = createFileRoute("/board")({
  loader: ({ context }) => context.queryClient.ensureQueryData(communityQuery),
  head: () => ({
    meta: [
      { title: "Board of Trustees & Committee — HCCNA" },
      {
        name: "description",
        content:
          "Meet the executive committee and board of trustees who serve the Hindu Cultural Center of North Alabama.",
      },
      { property: "og:title", content: "Board of Trustees & Committee" },
      { property: "og:description", content: "The volunteers who serve our temple community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BoardPage,
});

function BoardPage() {
  const { data } = useSuspenseQuery(communityQuery);

  return (
    <>
      <PageHeader
        eyebrow="Seva leadership"
        title="Board & committee"
        description="Elected volunteers who steward the temple's worship, finances and community programs."
      />
      <Section>
        {data.board.length === 0 ? (
          <EmptyState title="Board listing coming soon" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.board.map((m) => (
              <article key={m.id} className="surface-panel p-6">
                <p className="eyebrow">{m.position ?? "Member"}</p>
                <h2 className="mt-1 font-display text-xl">{m.full_name}</h2>
                {m.term ? <p className="text-sm text-muted-foreground">Term: {m.term}</p> : null}
                {m.bio ? <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p> : null}
                {m.email || m.phone ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {[m.email, m.phone].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
