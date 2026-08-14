import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";

import { GoldRule } from "@/components/site/primitives";
import { siteQuery } from "@/lib/queries";

export function Footer() {
  const { data } = useSuspenseQuery(siteQuery);
  const t = data.temple;

  return (
    <footer className="mt-auto border-t border-border/70 bg-muted/50">
      <GoldRule />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-xl">{t.name}</p>
          {t.tagline ? <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.tagline}</p> : null}
          <address className="mt-5 space-y-2 text-sm not-italic text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                {t.address_line1}
                <br />
                {[t.city, t.state, t.postal_code].filter(Boolean).join(", ")}
              </span>
            </p>
            {t.phone ? (
              <p className="flex items-center gap-2">
                <Phone className="size-4" aria-hidden />
                <a className="hover:text-foreground" href={`tel:${t.phone}`}>
                  {t.phone}
                </a>
              </p>
            ) : null}
            {t.email ? (
              <p className="flex items-center gap-2">
                <Mail className="size-4" aria-hidden />
                <a className="hover:text-foreground" href={`mailto:${t.email}`}>
                  {t.email}
                </a>
              </p>
            ) : null}
          </address>
        </div>

        <nav aria-label="Worship" className="text-sm">
          <p className="mb-3 font-semibold">Worship</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/timings" className="hover:text-foreground">
                Temple timings
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-foreground">
                Poojas &amp; services
              </Link>
            </li>
            <li>
              <Link to="/priests" className="hover:text-foreground">
                Our priests
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="hover:text-foreground">
                Hindu calendar
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Community" className="text-sm">
          <p className="mb-3 font-semibold">Community</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/events" className="hover:text-foreground">
                Events &amp; festivals
              </Link>
            </li>
            <li>
              <Link to="/library" className="hover:text-foreground">
                Digital library
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-foreground">
                Donate
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-foreground">
                My account
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/70 px-4 py-5 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.name}. All rights reserved.
          </p>
          {t.is_demo ? <p>Demo content — replace with your temple&apos;s own information.</p> : null}
        </div>
        
      </div>
    </footer>
  );
}
