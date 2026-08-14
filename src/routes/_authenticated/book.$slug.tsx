import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBooking, getServiceAvailability } from "@/lib/booking.functions";
import { formatMoney } from "@/lib/timezone";

export const Route = createFileRoute("/_authenticated/book/$slug")({
  head: () => ({ meta: [{ title: "Book a Pooja — HCCNA" }, { name: "robots", content: "noindex" }] }),
  component: BookPage,
});

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function BookPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const availability = useServerFn(getServiceAvailability);
  const book = useServerFn(createBooking);

  const [date, setDate] = useState(todayIso());
  const [selected, setSelected] = useState<{ startsAt: string; priestId: string; label: string } | null>(null);
  const [form, setForm] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    gotra: "",
    nakshatra: "",
    address: "",
    notes: "",
  });

  const { data, isFetching } = useQuery({
    queryKey: ["availability", slug, date],
    queryFn: () => availability({ data: { serviceSlug: slug, date } }),
  });

  const service = data?.service ?? null;
  const locationType = service?.location_type === "home" ? "home" : "temple";

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error("Please choose a time slot.");
      return book({
        data: {
          serviceSlug: slug,
          startsAt: selected.startsAt,
          priestId: selected.priestId,
          locationType,
          contactName: form.contactName,
          contactPhone: form.contactPhone,
          contactEmail: form.contactEmail,
          ...(form.gotra ? { gotra: form.gotra } : {}),
          ...(form.nakshatra ? { nakshatra: form.nakshatra } : {}),
          ...(form.address ? { address: form.address } : {}),
          ...(form.notes ? { notes: form.notes } : {}),
        },
      });
    },
    onSuccess: (result) => {
      toast.success(`Booking confirmed — reference ${result.reference}`);
      navigate({ to: "/dashboard" });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Booking failed"),
  });

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title={service?.name ?? "Book a service"}
        {...(service
          ? {
              description: `${service.duration_minutes} minutes · ${
                service.price_cents > 0 ? formatMoney(service.price_cents) : "By donation"
              }`,
            }
          : {})}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel h-fit p-6">
            <Label htmlFor="date">Choose a date</Label>
            <Input
              id="date"
              type="date"
              className="mt-2"
              min={todayIso()}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelected(null);
              }}
            />
            <p className="mt-5 text-sm font-semibold">Available times</p>
            {isFetching ? (
              <p className="mt-2 text-sm text-muted-foreground">Checking availability…</p>
            ) : (data?.slots.length ?? 0) === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No slots on this date. Please try another day.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {data!.slots.map((s) => (
                  <button
                    key={`${s.startsAt}-${s.priestId}`}
                    type="button"
                    onClick={() => setSelected({ startsAt: s.startsAt, priestId: s.priestId, label: s.label })}
                    className={`rounded-md border px-3 py-2 text-sm transition ${
                      selected?.startsAt === s.startsAt && selected?.priestId === s.priestId
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent/60"
                    }`}
                  >
                    {s.label}
                    <span className="ml-2 text-xs opacity-80">{s.priestName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="surface-panel space-y-5 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <p className="text-sm text-muted-foreground">
              {selected ? `Selected time: ${selected.label}` : "Select a time slot to continue."}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactName">Your name</Label>
                <Input
                  id="contactName"
                  required
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  required
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gotra">Gotra (optional)</Label>
                <Input
                  id="gotra"
                  value={form.gotra}
                  onChange={(e) => setForm({ ...form, gotra: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nakshatra">Nakshatra (optional)</Label>
                <Input
                  id="nakshatra"
                  value={form.nakshatra}
                  onChange={(e) => setForm({ ...form, nakshatra: e.target.value })}
                />
              </div>
            </div>
            {locationType === "home" ? (
              <div className="space-y-2">
                <Label htmlFor="address">Service address</Label>
                <Textarea
                  id="address"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for the priest (optional)</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <Button type="submit" size="lg" disabled={!selected || mutation.isPending}>
              Confirm booking
            </Button>
          </form>
        </div>
      </Section>
    </>
  );
}
