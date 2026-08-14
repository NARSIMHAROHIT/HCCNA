import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "plain",
}: {
  children: ReactNode;
  className?: string;
  tone?: "plain" | "muted" | "accent";
}) {
  return (
    <section
      className={cn(
        "px-4 py-14 sm:px-6 md:py-20",
        tone === "muted" && "bg-muted/60",
        tone === "accent" && "bg-accent/40",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 md:mb-12",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h2 className="text-3xl md:text-4xl">{title}</h2>
        {description ? <p className="mt-3 text-base text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function GoldRule({ className }: { className?: string }) {
  return <div className={cn("gold-rule h-px w-full", className)} aria-hidden />;
}

export function Prose({ html, className }: { html: string | null | undefined; className?: string }) {
  if (!html) return null;
  return (
    <div
      className={cn(
        "space-y-4 text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground",
        className,
      )}
      // Content comes from the temple's own CMS records, authored by temple admins.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function DataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
}) {
  return (
    <header className="temple-gradient border-b border-border/70 px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto w-full max-w-6xl">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="max-w-3xl text-4xl md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p>
        ) : null}
      </div>
    </header>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string | undefined;
}) {
  return (
    <div className="surface-panel px-6 py-12 text-center">
      <p className="font-display text-lg">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
