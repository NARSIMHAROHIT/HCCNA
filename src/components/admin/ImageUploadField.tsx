import { ImageUp, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "temple-media";
const MAX_BYTES = 25 * 1024 * 1024;

/**
 * An image field that accepts either a pasted URL or a file from the admin's
 * computer. Uploads go straight to Supabase Storage from the browser using the
 * signed-in admin's token, so storage RLS is the authorisation boundary.
 */
export function ImageUploadField({
  value,
  onChange,
  folder = "uploads",
  id,
  kind = "image",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  id?: string;
  /** "document" accepts PDFs and shows a filename instead of a thumbnail. */
  kind?: "image" | "document";
}) {
  const isDocument = kind === "document";
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function upload(file: File) {
    const acceptable = isDocument
      ? file.type === "application/pdf"
      : file.type.startsWith("image/");
    if (!acceptable) {
      toast.error(
        isDocument
          ? "Please choose a PDF file."
          : "Please choose an image file (JPG, PNG, WebP or GIF).",
      );
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(
        `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please choose one under 25 MB.`,
      );
      return;
    }

    setBusy(true);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeName = file.name
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);
      // A random prefix keeps two photos with the same name from colliding.
      const key = `${folder}/${crypto.randomUUID()}-${safeName || "photo"}.${extension}`;

      const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
      onChange(data.publicUrl);
      toast.success(isDocument ? "File uploaded." : "Photo uploaded.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(
        /row-level security|not authorized|violates/i.test(message)
          ? "You need temple administrator access to upload photos."
          : `Upload failed: ${message}`,
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          placeholder={
            isDocument ? "Paste a link, or upload a PDF" : "Paste an image URL, or upload a file"
          }
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <ImageUp className="size-4" aria-hidden />
          )}
          {busy ? "Uploading…" : "Upload"}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={isDocument ? "application/pdf" : "image/*"}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {value && isDocument ? (
        <p className="truncate text-xs text-muted-foreground">
          Current file:{" "}
          <a href={value} target="_blank" rel="noreferrer" className="text-primary underline">
            {value.split("/").pop()}
          </a>
        </p>
      ) : null}

      {value && !isDocument ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt="Selected"
            className="h-24 w-auto rounded-md border border-border object-cover"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border border-border bg-background shadow-sm"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
