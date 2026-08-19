import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { EmptyState, PageHeader, Section } from "@/components/site/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cancelMyBooking, getMyDashboard } from "@/lib/booking.functions";
import { cancelMyHallBooking, getMyHallBookings } from "@/lib/hall.functions";
import { formatMoney as formatHallMoney } from "@/lib/hall-pricing";
import { formatInTimezone, formatMoney } from "@/lib/timezone";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "My Temple Account — HCCNA" }, { name: "robots", content: "noindex" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const fetchDashboard = useServerFn(getMyDashboard);
  const cancel = useServerFn(cancelMyBooking);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });

  const fetchHallBookings = useServerFn(getMyHallBookings);
  const cancelHall = useServerFn(cancelMyHallBooking);
  const { data: hallBookings } = useQuery({
    queryKey: ["dashboard", "hall-bookings"],
    queryFn: () => fetchHallBookings(),
  });

  const cancelHallMutation = useMutation({
    mutationFn: (id: string) => cancelHall({ data: { id } }),
    onSuccess: () => {
      toast.success("Hall booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not cancel"),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancel({ data: { id } }),
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      router.invalidate();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not cancel"),
  });

  const upcoming = (data?.bookings ?? []).filter(
    (b) => b.status !== "cancelled" && new Date(b.starts_at).getTime() > Date.now(),
  );
  const past = (data?.bookings ?? []).filter(
    (b) => b.status === "cancelled" || new Date(b.starts_at).getTime() <= Date.now(),
  );

  return (
    <>
      <PageHeader
        eyebrow="Devotee portal"
        title={data?.profile?.full_name ? `Namaste, ${data.profile.full_name}` : "My account"}
        description="Your bookings, event registrations and temple notifications."
      />
      <Section>
        <div className="mb-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/services">Book a pooja</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/halls">Book the hall</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/profile">Edit profile</Link>
          </Button>
        </div>

        <h2 className="mb-4 text-2xl">Upcoming bookings</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : upcoming.length === 0 ? (
          <EmptyState title="No upcoming bookings" description="Choose a seva to get started." />
        ) : (
          <div className="space-y-4">
            {upcoming.map((b) => (
              <article key={b.id} className="surface-panel flex flex-wrap items-center gap-4 p-5">
                <div className="min-w-56 flex-1">
                  <p className="font-display text-lg">{b.services?.name ?? "Service"}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatInTimezone(b.starts_at, "UTC", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Ref {b.reference}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{b.status}</Badge>
                  <p className="mt-2 text-sm font-semibold">{formatMoney(b.amount_cents)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(b.id)}
                >
                  Cancel
                </Button>
              </article>
            ))}
          </div>
        )}

        {past.length ? (
          <>
            <h2 className="mb-4 mt-12 text-2xl">History</h2>
            <div className="surface-panel divide-y divide-border/70 p-5">
              {past.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">{b.services?.name ?? "Service"}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatInTimezone(b.starts_at, "UTC", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      · Ref {b.reference}
                    </p>
                  </div>
                  <Badge variant="secondary">{b.status}</Badge>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {hallBookings?.length ? (
          <>
            <h2 className="mb-4 mt-12 text-2xl">Hall bookings</h2>
            <div className="space-y-4">
              {hallBookings.map((b) => (
                <article
                  key={b.id}
                  className="surface-panel flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg">{b.halls?.name ?? "Hall"}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.event_title ? `${b.event_title} — ` : ""}
                      {b.event_type} · {b.guest_count} guests
                    </p>
                    <p className="mt-1 text-sm">
                      {formatInTimezone(b.starts_at, "UTC", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ref {b.reference} · {formatHallMoney(b.total_cents, "USD")} ·{" "}
                      {b.payment_status}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={b.status === "confirmed" ? "default" : "secondary"}>
                      {b.status}
                    </Badge>
                    {b.status !== "cancelled" && b.status !== "completed" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cancelHallMutation.isPending}
                        onClick={() => cancelHallMutation.mutate(b.id)}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {data?.notifications.length ? (
          <>
            <h2 className="mb-4 mt-12 text-2xl">Notifications</h2>
            <div className="surface-panel divide-y divide-border/70 p-5">
              {data.notifications.map((n) => (
                <div key={n.id} className="py-3">
                  <p className="font-medium">{n.title}</p>
                  {n.body ? <p className="text-sm text-muted-foreground">{n.body}</p> : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Section>
    </>
  );
}
