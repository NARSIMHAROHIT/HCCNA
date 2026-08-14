import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { auditQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AdminAudit,
});

const ENTITY_LABEL: Record<string, string> = {
  events: "Event",
  priests: "Priest",
  donors: "Donor",
  deities: "Deity",
};

const ACTION_LABEL: Record<string, string> = {
  insert: "created",
  update: "edited",
  delete: "deleted",
};

function preview(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value.length > 60 ? `${value.slice(0, 60)}…` : value;
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "object") return JSON.stringify(value).slice(0, 60);
  return String(value);
}

function AdminAudit() {
  const { data, isLoading } = useQuery(auditQuery);

  if (isLoading) return <p className="text-muted-foreground">Loading the audit trail…</p>;
  if (!data?.isAdmin) return null;

  const actorName = (id: string | null) => {
    if (!id) return "System";
    const actor = data.actors.find((a) => a.id === id);
    return actor?.full_name || actor?.email || "Unknown user";
  };

  const tracked = data.entries.filter((e) => e.entity && ENTITY_LABEL[e.entity]);

  return (
    <section className="surface-panel p-6">
      <h2 className="font-display text-xl">Audit log</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Every change to events, priests, donors and deities — who made it, when, and what changed.
      </p>

      <ul className="mt-6 space-y-4">
        {tracked.length === 0 ? (
          <li className="text-sm text-muted-foreground">No recorded changes yet.</li>
        ) : null}
        {tracked.map((entry) => {
          const changes = (entry.changes ?? {}) as Record<
            string,
            { from?: unknown; to?: unknown } | unknown
          >;
          const fields =
            entry.action === "update"
              ? Object.entries(changes as Record<string, { from?: unknown; to?: unknown }>)
              : [];
          const label = (entry.metadata as { label?: string } | null)?.label;
          return (
            <li key={entry.id} className="rounded-lg border border-border/70 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">
                  {actorName(entry.actor_id)} {ACTION_LABEL[entry.action] ?? entry.action}{" "}
                  {ENTITY_LABEL[entry.entity ?? ""] ?? entry.entity}
                  {label ? ` — ${label}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </div>
              {fields.length ? (
                <table className="mt-3 w-full text-xs">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="w-1/4 pb-1 text-left font-medium">Field</th>
                      <th className="pb-1 text-left font-medium">Before</th>
                      <th className="pb-1 text-left font-medium">After</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {fields.map(([field, diff]) => (
                      <tr key={field}>
                        <td className="py-1.5 pr-3 font-medium">{field.replace(/_/g, " ")}</td>
                        <td className="py-1.5 pr-3 text-muted-foreground">{preview(diff?.from)}</td>
                        <td className="py-1.5">{preview(diff?.to)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
