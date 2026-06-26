"use client";

import { useEffect, useRef, useState } from "react";
import { beliefs, coreAdvantages, approachPoints } from "@/lib/content";
import { ScrollAdvanceControl } from "@/components/ui/ScrollAdvanceControl";

// Cycling project imagery for the left panel (Reaktor-style split section).
const BELIEF_IMAGES = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=80",
];

// Each bubble carries one Build Design point. 9 points → a 3×3 matrix.
const POINTS = [...coreAdvantages, ...approachPoints];
const COLS = 3;
const ROWS = Math.ceil(POINTS.length / COLS);

const STATEMENTS = beliefs.slice(0, ROWS);

// Bubble reveal choreography (scroll-driven, row by row).
const REVEAL_START = 0.05;
const STAGGER = 0.072;
const REVEAL_WIN = 0.13;

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

export function Beliefs() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  const scrollBeats = Array.from({ length: ROWS }, (_, i) => ({
    end: (i + 1) / ROWS,
    hint:
      i === 0 ? "Scroll" : i === ROWS - 1 ? "Consult your project" : "Keep scrolling",
  }));

  const activeBeat = scrollBeats.findIndex((beat) => p < beat.end);
  const scrollHint =
    activeBeat === -1
      ? "Consult your project"
      : (scrollBeats[activeBeat]?.hint ?? "Continue");
  const controlsOpacity =
    p < 0.78 ? 1 : p < 0.94 ? 1 - (p - 0.78) / 0.16 : 0;

  const handleScrollDown = () => {
    const container = ref.current;
    if (!container) return;

    const scrollable = container.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const nextBeat = scrollBeats.find((beat) => p < beat.end - 0.015);
    const targetProgress = nextBeat ? nextBeat.end + 0.01 : 1;
    const targetY = container.offsetTop + scrollable * targetProgress;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          setP(0);
          return;
        }
        setP(clamp(-rect.top / scrollable));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Per-bubble reveal (0 → 1) with a stagger so the first appears, rest follow.
  const reveal = (i: number) =>
    smoothstep((p - (REVEAL_START + i * STAGGER)) / REVEAL_WIN);

  const active = Math.min(ROWS - 1, Math.floor(p * ROWS * 0.999));

  return (
    <section
      id="beliefs"
      ref={ref}
      className="relative bg-showcase-bg"
      style={{ height: "360vh" }}
    >
      <div className="beliefs-sticky-viewport services-sticky-viewport relative sticky top-0 grid grid-cols-1 overflow-hidden lg:grid-cols-2 lg:grid-rows-none">
        {/* Left — cycling imagery with the active statement + row counter */}
        <div
          id="beliefs-image-panel"
          className="beliefs-image-panel relative min-h-[14.5rem] overflow-hidden lg:h-full lg:min-h-0"
        >
          {BELIEF_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-out"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-charcoal/10" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-charcoal/60 to-transparent lg:h-32"
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:gap-6 sm:p-8 lg:p-12">
            <div className="relative h-[3.2em] max-w-[82%] overflow-hidden sm:h-[3.6em] sm:max-w-[78%]">
              {STATEMENTS.map((it, i) => (
                <p
                  key={it.number}
                  className="heading-display absolute bottom-0 left-0 text-[clamp(1.1rem,4.5vw,2.25rem)] leading-tight text-cream sm:text-[clamp(1.35rem,2.6vw,2.25rem)]"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `translateY(${i === active ? 0 : 28}px)`,
                    transition:
                      "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  {it.description}
                </p>
              ))}
            </div>
            <span className="shrink-0 font-sans text-base font-light tracking-wide text-cream/90 sm:text-lg">
              {active + 1}/{ROWS}
            </span>
          </div>

          <ScrollAdvanceControl
            hint={scrollHint}
            onAdvance={handleScrollDown}
            opacity={controlsOpacity}
            variant="light"
            className="absolute right-4 top-[38%] z-30 [&_button]:mx-0 [&_button]:items-end lg:bottom-8 lg:left-1/2 lg:top-auto lg:right-auto lg:-translate-x-1/2 lg:[&_button]:mx-auto lg:[&_button]:items-center"
            ariaLabel={`${scrollHint}. Advance through why Build Design matters.`}
          />
        </div>

        {/* Bubble matrix — same 3×3 grid + drift on all breakpoints */}
        <div className="belief-bubble-panel relative flex min-h-0 flex-col bg-showcase-bg lg:h-full">
          <div className="belief-bubble-stage flex min-h-0 flex-1 items-center justify-center px-4 pb-16 pt-6 lg:items-stretch lg:p-0">
            <div
              className="belief-bubble-grid mx-auto grid aspect-square w-full max-w-[min(100%,calc(100dvh-16rem))] lg:aspect-auto lg:h-full lg:max-w-none"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
              }}
            >
            {POINTS.map((point, i) => {
              const t = reveal(i);
              return (
                <div
                  key={point}
                  className="relative flex items-center justify-center overflow-visible"
                >
                  <div
                    className="belief-bubble-shell relative flex aspect-square w-[112%] items-center justify-center will-change-transform lg:w-[150%]"
                    style={{
                      opacity: t <= 0 ? 0 : Math.max(0.72, t),
                      transform: `translate(${(1 - t) * 22}px, ${
                        (1 - t) * (i < COLS ? 16 : 40)
                      }px) scale(${0.7 + 0.3 * t})`,
                    }}
                  >
                    <div
                      className="belief-bubble-drift absolute inset-0 flex items-center justify-center"
                      style={{
                        animationDelay: `${(i % COLS) * 0.5 + Math.floor(i / COLS) * 0.9}s`,
                      }}
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-showcase-border/75 bg-charcoal/[0.04]" />
                      <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-showcase-border/50" />
                      <p className="relative z-10 max-w-[58%] text-center font-sans text-[clamp(0.55rem,2.4vw,0.9rem)] font-medium leading-snug text-showcase-title lg:text-[clamp(0.6rem,0.95vw,0.9rem)]">
                        {point}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
