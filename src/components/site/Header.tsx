import { useSuspenseQuery } from "@tanstack/react-query";
import { ClientOnly, Link, useNavigate } from "@tanstack/react-router";
import { Menu, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { siteQuery } from "@/lib/queries";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/timings", label: "Timings" },
  { to: "/services", label: "Poojas & Services" },
  { to: "/priests", label: "Priests" },
  { to: "/events", label: "Events" },
  { to: "/halls", label: "Hall Rental" },
  { to: "/calendar", label: "Calendar" },
  { to: "/donors", label: "Donors" },
  { to: "/board", label: "Board" },
  { to: "/library", label: "Library" },
  { to: "/contact", label: "Contact" },
] as const;

/**
 * Plain sign-in link. Used as the server-rendered fallback as well, so the way
 * into the devotee portal exists even before (or without) hydration.
 */
function SignInButton() {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to="/auth">
        <UserRound className="size-4" aria-hidden />
        Sign in
      </Link>
    </Button>
  );
}

function AccountArea() {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  // While the session is being read, still show the sign-in link rather than a
  // blank space — a signed-in devotee sees it swap to "My account" a moment later.
  if (loading || !user) {
    return <SignInButton />;
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link to="/dashboard">My account</Link>
      </Button>

      <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
        <Link to="/admin">Admin</Link>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: "/", replace: true });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}

export function Header() {
  const { data } = useSuspenseQuery(siteQuery);
  const [open, setOpen] = useState(false);
  const temple = data.temple;

  return (
    <header className="relative z-40 border-b border-border/70 bg-background/95 backdrop-blur">
      {/* TEMPLE NAME */}
      <div className="border-b border-border/60 px-4 py-5 text-center sm:px-6 md:py-6">
        <Link to="/" className="inline-block">
          <div className="flex items-center justify-center gap-5">
            <img
              src="/logo.jpg"
              alt="Hindu Cultural Center logo"
              className="h-20 w-20 object-contain md:h-28 md:w-28"
            />

            <div className="text-center">
              <h1 className="font-display text-3xl leading-tight md:text-5xl">{temple.name}</h1>

              <p className="font-display text-lg leading-tight md:text-lg">
                A sarvajan mandir for worship, learning and gathering
              </p>

              <p className="mt-2 font-display text-lg leading-tight md:text-sm">प्रज्ञानं ब्रह्म</p>

              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                {[temple.city, temple.state].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-3 text-primary">
            <span className="h-px flex-1 bg-primary/40" />

            <span aria-hidden className="text-2xl">
              ॐ
            </span>

            <span className="h-px flex-1 bg-primary/40" />
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-4 px-4 py-3 sm:px-6">
        <nav aria-label="Main" className="hidden items-center justify-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-2.5 py-2 text-sm text-muted-foreground transition hover:bg-accent/60 hover:text-foreground"
              activeProps={{
                className: "bg-accent/70 text-foreground font-semibold",
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/donate">Donate</Link>
          </Button>

          <ClientOnly fallback={<SignInButton />}>
            <AccountArea />
          </ClientOnly>

          {/* MOBILE MENU */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[85vw] sm:w-80">
              <SheetTitle className="font-display text-xl">{temple.name}</SheetTitle>

              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base text-foreground transition hover:bg-accent/60"
                    activeProps={{
                      className: "bg-accent/70 font-semibold",
                    }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  to="/donate"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-md bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground"
                >
                  Donate
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
