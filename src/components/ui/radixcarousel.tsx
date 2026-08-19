import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type ImageModule = { default: string };

/**
 * Every image in src/assets is a slide.
 *
 * NOTE: the original glob only matched `.jpg`/`.png`, so the deity photographs
 * (which are `.jpeg`) never appeared. Keep every extension we actually ship here.
 */
const modules = import.meta.glob<ImageModule>("../../assets/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
});

/** Pretty captions for the file names we ship. Anything unlisted falls back to a tidied file name. */
const CAPTIONS: Record<string, string> = {
  ganesha: "Sri Ganesha",
  lordshiva: "Sri Shiva",
  durga: "Sri Durga",
  kali: "Sri Kali",
  laxmi: "Sri Lakshmi",
  sarswathi: "Sri Saraswati",
  hanuman: "Sri Hanuman",
  saibaba: "Sri Shirdi Sai Baba",
  sitarama: "Sri Sita Rama",
  radhakrishna: "Sri Radha Krishna",
  srinathji: "Sri Srinathji",
  venkateshwara: "Sri Venkateshwara",
  subrahamanya: "Sri Subrahmanya",
  sathayanaryana: "Sri Satyanarayana",
  "temple-hero": "Hindu Cultural Center of North Alabama",
  "temple-hero-1": "Hindu Cultural Center of North Alabama",
  "temple-hero-2": "Hindu Cultural Center of North Alabama",
};

/** Slides render in this order; anything not listed follows, alphabetically. */
const ORDER = [
  "temple-hero",
  "temple-hero-1",
  "temple-hero-2",
  "ganesha",
  "lordshiva",
  "venkateshwara",
  "sitarama",
  "radhakrishna",
  "srinathji",
  "durga",
  "laxmi",
  "sarswathi",
  "kali",
  "hanuman",
  "subrahamanya",
  "sathayanaryana",
  "saibaba",
];

function keyOf(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.[^.]+$/, "").toLowerCase();
}

function captionFor(key: string): string {
  const known = CAPTIONS[key];
  if (known) return known;
  return key
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

type Slide = { src: string; caption: string; key: string };

const SLIDES: Slide[] = Object.entries(modules)
  .map(([path, mod]) => {
    const key = keyOf(path);
    return { src: mod.default, caption: captionFor(key), key };
  })
  .sort((a, b) => {
    const ai = ORDER.indexOf(a.key);
    const bi = ORDER.indexOf(b.key);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.key.localeCompare(b.key);
  });

/** Each photograph is on screen for four seconds. */
const SLIDE_MS = 4000;

export default function RadixCarousel({ className }: { className?: string }) {
  const slides = useMemo(() => SLIDES, []);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const reducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!playing || hovered || count < 2 || reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [playing, hovered, count, reducedMotion]);

  if (count === 0) return null;

  return (
    <div
      aria-label="Temple and deity photographs"
      aria-roledescription="carousel"
      className={cn(
        "surface-panel relative isolate aspect-[4/5] w-full overflow-hidden sm:aspect-[3/4] lg:aspect-[4/5]",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + 1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index - 1);
        }
      }}
    >
      {slides.map((slide, i) => (
        <figure
          key={slide.key}
          className={cn(
            "absolute inset-0 m-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={i === index ? undefined : true}
        >
          <img
            src={slide.src}
            alt={slide.caption}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="h-full w-full select-none object-cover object-center"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-4 pt-14 text-center">
            <span className="font-display text-lg text-white drop-shadow md:text-xl">
              {slide.caption}
            </span>
          </figcaption>
        </figure>
      ))}

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous photograph"
            className="absolute left-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/85 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next photograph"
            className="absolute right-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/85 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full border border-border/70 bg-background/85 text-muted-foreground shadow-sm backdrop-blur-sm transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {playing ? (
              <Pause className="size-3.5" aria-hidden />
            ) : (
              <Play className="size-3.5" aria-hidden />
            )}
          </button>

          {/* Slim progress dots — no photo thumbnails. */}
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${slide.caption}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
