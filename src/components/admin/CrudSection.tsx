import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteRecord, saveRecord } from "@/lib/admin.functions";

import { ImageUploadField } from "./ImageUploadField";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "money"
  | "checkbox"
  | "date"
  | "datetime"
  | "time"
  | "list"
  | "select"
  | "image"
  | "file";

export type FieldDef = {
  name: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  full?: boolean;
  /** Storage folder for `type: "image"` fields, e.g. "events". */
  folder?: string;
};

type Row = Record<string, unknown> & { id: string };

function toInput(value: unknown, type: FieldType): string | boolean {
  if (type === "checkbox") return Boolean(value);
  if (value === null || value === undefined) return "";
  if (type === "list") return Array.isArray(value) ? value.join(", ") : String(value);
  if (type === "money") return String(Number(value) / 100);
  if (type === "datetime") {
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return String(value);
}

function fromInput(raw: string | boolean, type: FieldType): unknown {
  if (type === "checkbox") return Boolean(raw);
  const value = String(raw);
  if (type === "list") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  if (value === "") return null;
  if (type === "money") return Math.round(Number(value) * 100);
  if (type === "number") return Number(value);
  if (type === "datetime") return new Date(value).toISOString();
  return value;
}

export function CrudSection({
  table,
  title,
  description,
  rows,
  fields,
  primaryField,
  secondaryField,
  singular,
  allowCreate = true,
  allowDelete = true,
}: {
  table: string;
  title: string;
  description?: string;
  rows: Row[];
  fields: FieldDef[];
  primaryField: string;
  secondaryField?: (row: Row) => string;
  singular: string;
  allowCreate?: boolean;
  allowDelete?: boolean;
}) {
  const [editing, setEditing] = useState<Row | "new" | null>(null);

  return (
    <section className="surface-panel p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {allowCreate ? (
          <Button size="sm" onClick={() => setEditing("new")}>
            <Plus className="size-4" aria-hidden /> Add {singular}
          </Button>
        ) : null}
      </div>

      <ul className="mt-5 divide-y divide-border/70">
        {rows.length === 0 ? (
          <li className="py-4 text-sm text-muted-foreground">Nothing here yet.</li>
        ) : null}
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{String(row[primaryField] ?? "—")}</p>
              {secondaryField ? (
                <p className="truncate text-xs text-muted-foreground">{secondaryField(row)}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                size="icon"
                variant="outline"
                aria-label="Edit"
                onClick={() => setEditing(row)}
              >
                <Pencil className="size-4" aria-hidden />
              </Button>
              {allowDelete ? <DeleteButton table={table} id={row.id} /> : null}
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <RecordDialog
          table={table}
          singular={singular}
          fields={fields}
          row={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </section>
  );
}

function DeleteButton({ table, id }: { table: string; id: string }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Delete"
      disabled={busy}
      onClick={async () => {
        if (!window.confirm("Delete this entry? This cannot be undone.")) return;
        setBusy(true);
        try {
          await deleteRecord({ data: { table: table as never, id } });
          await qc.invalidateQueries({ queryKey: ["admin"] });
          toast.success("Deleted");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Could not delete");
        } finally {
          setBusy(false);
        }
      }}
    >
      <Trash2 className="size-4" aria-hidden />
    </Button>
  );
}

export function RecordDialog({
  table,
  singular,
  fields,
  row,
  onClose,
}: {
  table: string;
  singular: string;
  fields: FieldDef[];
  row: Row | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [state, setState] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, toInput(row?.[f.name], f.type ?? "text")])),
  );
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const values = Object.fromEntries(
        fields.map((f) => [f.name, fromInput(state[f.name] ?? "", f.type ?? "text")]),
      );
      await saveRecord({
        data: { table: table as never, ...(row ? { id: row.id } : {}), values },
      });
      await qc.invalidateQueries({ queryKey: ["admin"] });
      await qc.invalidateQueries({ queryKey: ["site"] });
      toast.success("Saved");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {row ? `Edit ${singular}` : `Add ${singular}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const type = f.type ?? "text";
            const id = `${table}-${f.name}`;
            return (
              <div
                key={f.name}
                className={f.full || type === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2"}
              >
                {type === "checkbox" ? (
                  <label className="flex items-center gap-3 pt-6 text-sm">
                    <Checkbox
                      id={id}
                      checked={Boolean(state[f.name])}
                      onCheckedChange={(v) => setState((s) => ({ ...s, [f.name]: Boolean(v) }))}
                    />
                    {f.label}
                  </label>
                ) : (
                  <>
                    <Label htmlFor={id}>{f.label}</Label>
                    {type === "image" || type === "file" ? (
                      <ImageUploadField
                        id={id}
                        kind={type === "file" ? "document" : "image"}
                        value={String(state[f.name] ?? "")}
                        onChange={(url) => setState((st) => ({ ...st, [f.name]: url }))}
                        {...(f.folder ? { folder: f.folder } : {})}
                      />
                    ) : type === "textarea" ? (
                      <Textarea
                        id={id}
                        rows={4}
                        value={String(state[f.name] ?? "")}
                        onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
                      />
                    ) : type === "select" ? (
                      <select
                        id={id}
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={String(state[f.name] ?? "")}
                        onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
                      >
                        <option value="">—</option>
                        {(f.options ?? []).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={id}
                        type={
                          type === "number" || type === "money"
                            ? "number"
                            : type === "date"
                              ? "date"
                              : type === "time"
                                ? "time"
                                : type === "datetime"
                                  ? "datetime-local"
                                  : "text"
                        }
                        step={type === "money" ? "0.01" : undefined}
                        placeholder={f.placeholder ?? ""}
                        value={String(state[f.name] ?? "")}
                        onChange={(e) => setState((s) => ({ ...s, [f.name]: e.target.value }))}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
