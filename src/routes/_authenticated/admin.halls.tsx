import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { CrudSection, type FieldDef } from "@/components/admin/CrudSection";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveRecord } from "@/lib/admin.functions";
import { formatMoney } from "@/lib/hall-pricing";
import { adminQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/halls")({
  component: AdminHalls,
});

const HALL_FIELDS: FieldDef[] = [
  { name: "name", label: "Hall name" },
  { name: "slug", label: "URL slug (e.g. community-hall)" },
  { name: "capacity", label: "Seated capacity", type: "number" },
  { name: "area_sqft", label: "Area (sq ft)", type: "number" },
  { name: "hourly_rate_cents", label: "Hourly rate (USD)", type: "money" },
  { name: "half_day_rate_cents", label: "Half-day rate, up to 5 hrs (USD)", type: "money" },
  { name: "full_day_rate_cents", label: "Full-day rate, up to 12 hrs (USD)", type: "money" },
  { name: "cleaning_fee_cents", label: "Cleaning fee (USD)", type: "money" },
  { name: "deposit_cents", label: "Refundable deposit (USD)", type: "money" },
  { name: "min_hours", label: "Minimum hours", type: "number" },
  { name: "max_hours", label: "Maximum hours", type: "number" },
  { name: "opens_at", label: "Available from", type: "time" },
  { name: "closes_at", label: "Available until", type: "time" },
  { name: "min_notice_days", label: "Minimum notice (days)", type: "number" },
  { name: "max_advance_days", label: "Book up to (days ahead)", type: "number" },
  { name: "buffer_minutes", label: "Buffer between bookings (minutes)", type: "number" },
  { name: "display_order", label: "Display order", type: "number" },
  { name: "is_active", label: "Accepting bookings", type: "checkbox" },
  { name: "image_url", label: "Photo URL", full: true },
  { name: "amenities", label: "Amenities (comma separated)", type: "list", full: true },
  { name: "short_description", label: "Short description", type: "textarea" },
  { name: "description", label: "Full description", type: "textarea" },
  { name: "rules", label: "Rental terms & house rules", type: "textarea" },
];

const STATUSES = ["requested", "held", "confirmed", "completed", "cancelled"] as const;

interface HallBookingRow {
  id: string;
  reference: string;
  event_type: string;
  event_title: string | null;
  starts_at: string;
  ends_at: string;
  guest_count: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  payment_status: string;
  total_cents: number;
  deposit_cents: number;
  notes: string | null;
  setup_notes: string | null;
  needs_kitchen: boolean;
  needs_av: boolean;
  needs_tables: boolean;
  halls: { name: string; slug: string } | null;
}

function AdminHalls() {
  const { data } = useQuery(adminQuery);
  if (!data?.isAdmin) return null;

  const bookings = (data.hallBookings ?? []) as unknown as HallBookingRow[];
  const currency = data.temple.currency;

  return (
    <div className="space-y-6">
      <CrudSection
        table="halls"
        title="Halls"
        description="Rates, capacity and booking rules for each rentable space. The cheapest applicable rate is charged automatically."
        singular="hall"
        rows={data.halls as never}
        primaryField="name"
        secondaryField={(row) =>
          [
            `${row["capacity"]} guests`,
            row["is_active"] ? "Accepting bookings" : "Not bookable",
          ].join(" · ")
        }
        fields={HALL_FIELDS}
      />

      <section className="surface-panel p-6">
        <h2 className="font-display text-xl">Hall booking requests</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm a request once the deposit clears. Cancelling frees the date for someone else.
        </p>

        {bookings.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">No hall requests yet.</p>
        ) : (
          <ul className="mt-5 divide-y divide-border/70">
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} currency={currency} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BookingRow({ booking, currency }: { booking: HallBookingRow; currency: string }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const starts = new Date(booking.starts_at);
  const ends = new Date(booking.ends_at);

  const needs = [
    booking.needs_tables ? "tables & chairs" : null,
    booking.needs_kitchen ? "kitchen" : null,
    booking.needs_av ? "sound/projector" : null,
  ].filter(Boolean);

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold">
            {booking.reference} · {booking.halls?.name ?? "Hall"}
            <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs font-normal capitalize text-muted-foreground">
              {booking.payment_status}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {booking.event_title ? `${booking.event_title} — ` : ""}
            {booking.event_type} · {booking.guest_count} guests
          </p>
          <p className="mt-1 text-sm">
            {starts.toLocaleString()} → {ends.toLocaleTimeString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {booking.contact_name} · {booking.contact_phone} · {booking.contact_email}
          </p>
          {needs.length ? (
            <p className="mt-1 text-xs text-muted-foreground">Needs: {needs.join(", ")}</p>
          ) : null}
          {booking.setup_notes ? (
            <p className="mt-1 text-xs italic text-muted-foreground">
              Setup: {booking.setup_notes}
            </p>
          ) : null}
          {booking.notes ? (
            <p className="mt-1 text-xs italic text-muted-foreground">Notes: {booking.notes}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="font-display text-lg text-primary">
            {formatMoney(booking.total_cents, currency)}
          </span>
          <Select
            value={booking.status}
            disabled={busy}
            onValueChange={async (status) => {
              setBusy(true);
              try {
                await saveRecord({
                  data: { table: "hall_bookings", id: booking.id, values: { status } },
                });
                await qc.invalidateQueries({ queryKey: ["admin"] });
                toast.success(`${booking.reference} is now ${status}`);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not update the booking");
              } finally {
                setBusy(false);
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            disabled={busy || booking.payment_status === "paid"}
            onClick={async () => {
              setBusy(true);
              try {
                await saveRecord({
                  data: {
                    table: "hall_bookings",
                    id: booking.id,
                    values: { payment_status: "paid" },
                  },
                });
                await qc.invalidateQueries({ queryKey: ["admin"] });
                toast.success("Marked as paid");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not update");
              } finally {
                setBusy(false);
              }
            }}
          >
            Mark paid
          </Button>
        </div>
      </div>
    </li>
  );
}
