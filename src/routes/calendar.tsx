import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader, Section } from "@/components/site/primitives";
import { Button } from "@/components/ui/button";
import { panchangQuery } from "@/lib/queries";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const Route = createFileRoute("/calendar")({
  loader: ({ context }) => context.queryClient.ensureQueryData(panchangQuery()),
  head: () => ({
    meta: [
      { title: "Hindu Calendar & Panchang — HCCNA" },
      {
        name: "description",
        content:
          "Location-aware Hindu calendar for North Alabama with daily tithi, nakshatra, yoga, sunrise, sunset and Rahu Kalam.",
      },
      { property: "og:title", content: "Hindu Calendar & Panchang" },
      { property: "og:description", content: "Daily tithi, nakshatra, sunrise and Rahu Kalam for our location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const initial = useSuspenseQuery(panchangQuery()).data;
  const today = new Date();
  const todayISO = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const [cursor, setCursor] = useState({ year: initial.year, month: initial.month });
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [searchDate, setSearchDate] = useState(todayISO);
  const { data } = useSuspenseQuery(panchangQuery(cursor.year, cursor.month));
  const selectedDay = data.days.find((d) => d.date === selectedDate) ?? null;

  const shift = (delta: number) => {
    const next = cursor.month + delta;
    if (next < 1) setCursor({ year: cursor.year - 1, month: 12 });
    else if (next > 12) setCursor({ year: cursor.year + 1, month: 1 });
    else setCursor({ year: cursor.year, month: next });
  };

  const jumpToDate = (dateValue: string) => {
    if (!dateValue) return;
    const [year, month, day] = dateValue.split("-").map(Number);
    if (!year || !month || !day) return;

    setSelectedDate(dateValue);
    setSearchDate(dateValue);
    setCursor({ year, month });
  };

  return (
    <>
      <PageHeader
        eyebrow="Panchang"
        title="Hindu calendar"
        description={`Computed for ${data.location.label} (${data.location.timezone}) using the temple's own coordinates.`}
      />
      
      <Section>
        <div className="mb-6 rounded-xl border bg-card/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <label className="text-sm font-medium text-foreground" htmlFor="search-date">
                Search date
              </label>
              <input
                id="search-date"
                type="date"
                value={searchDate}
                onChange={(event) => setSearchDate(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none ring-0 transition focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" onClick={() => jumpToDate(searchDate)}>
                Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => jumpToDate(todayISO)}
              >
                Today
              </Button>
            </div>
          </div>

          {selectedDay ? (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Selected date</p>
                  <h3 className="mt-1 text-2xl font-display">
                    {selectedDay.weekdayName}, {selectedDay.day} {MONTHS[Number(selectedDay.date.slice(5, 7)) - 1]} {selectedDay.date.slice(0, 4)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedDay.tithiName} ({selectedDay.paksha}) • {selectedDay.nakshatraName}
                </p>
              </div>

              <dl className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md bg-background/70 p-3">
                  <dt className="text-xs uppercase tracking-wide">Sunrise</dt>
                  <dd className="mt-1 font-medium text-foreground">{selectedDay.sunrise}</dd>
                </div>
                <div className="rounded-md bg-background/70 p-3">
                  <dt className="text-xs uppercase tracking-wide">Sunset</dt>
                  <dd className="mt-1 font-medium text-foreground">{selectedDay.sunset}</dd>
                </div>
                <div className="rounded-md bg-background/70 p-3">
                  <dt className="text-xs uppercase tracking-wide">Rahu Kalam</dt>
                  <dd className="mt-1 font-medium text-foreground">{selectedDay.rahuKalam}</dd>
                </div>
                <div className="rounded-md bg-background/70 p-3">
                  <dt className="text-xs uppercase tracking-wide">Yoga</dt>
                  <dd className="mt-1 font-medium text-foreground">{selectedDay.yogaName}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <Button variant="outline" size="sm" onClick={() => shift(-1)}>
            Previous
          </Button>
          <h2 className="text-2xl">
            {MONTHS[data.month - 1]} {data.year}
          </h2>
          <Button variant="outline" size="sm" onClick={() => shift(1)}>
            Next
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.days.map((d) => {
            const isToday = d.date === todayISO;
            const isSelected = d.date === selectedDate;

            return (
              <article
                key={d.date}
                onClick={() => {
                  setSelectedDate(d.date);
                  setSearchDate(d.date);
                }}
                className={[
                  "surface-panel cursor-pointer p-4 transition-colors",
                  isToday ? "border-2 border-primary shadow-[0_0_0_1px_rgba(59,130,246,0.1)]" : "",
                  isSelected ? "ring-2 ring-primary/70" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-xl">{d.day}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{d.weekdayName}</p>
                </div>
                <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between gap-3">
                    <dt>Tithi</dt>
                    <dd className="text-right font-medium text-foreground">
                      {d.tithiName} ({d.paksha})
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Nakshatra</dt>
                    <dd className="text-right font-medium text-foreground">{d.nakshatraName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Sunrise</dt>
                    <dd className="text-right font-medium text-foreground">{d.sunrise}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Rahu Kalam</dt>
                    <dd className="text-right font-medium text-foreground">{d.rahuKalam}</dd>
                  </div>
                </dl>
                {d.observances.length ? (
                  <p className="mt-3 rounded bg-accent/60 px-2 py-1 text-xs text-accent-foreground">
                    {d.observances.join(" • ")}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
