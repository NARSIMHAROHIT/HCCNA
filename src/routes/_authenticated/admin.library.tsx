import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CrudSection, type FieldDef } from "@/components/admin/CrudSection";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/library")({
  component: AdminLibrary,
});

const BOOK_FIELDS: FieldDef[] = [
  { name: "title", label: "Title" },
  { name: "author", label: "Author" },
  { name: "category", label: "Category (e.g. Scripture, Philosophy, Children)" },
  { name: "language", label: "Language" },
  { name: "publication_info", label: "Publisher / edition" },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "cover_url", label: "Cover image", type: "image", folder: "books", full: true },
  {
    name: "file_url",
    label: "PDF (upload or paste a link)",
    type: "file",
    folder: "library",
    full: true,
  },
  { name: "external_url", label: "Link to read online (optional)", full: true },
  { name: "description", label: "Description", type: "textarea" },
];

function AdminLibrary() {
  const { data } = useQuery(adminQuery);
  if (!data?.isAdmin) return null;

  return (
    <div className="space-y-6">
      <CrudSection
        table="books"
        title="Library"
        description="Books and scriptures listed on the public Library page. Upload a cover image, and add a download or read-online link if the text is available."
        singular="book"
        rows={data.books as never}
        primaryField="title"
        secondaryField={(row) =>
          [row["author"], row["category"], row["language"]].filter(Boolean).join(" · ")
        }
        fields={BOOK_FIELDS}
      />
    </div>
  );
}
