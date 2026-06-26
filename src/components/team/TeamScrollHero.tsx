"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { teamOrbit } from "@/lib/content";

// Total scroll length of the pinned section. Larger = slower, more deliberate.
const SCROLL_VH = 360;

// Scroll story beats — button clicks snap to each end point for guided pacing.
const SCROLL_BEATS = [
  { end: 0.16, hint: "Scroll" },
  { end: 0.3, hint: "Keep scrolling" },
  { end: 0.48, hint: "Watch it unfold" },
  { end: 0.66, hint: "Our heritage" },
  { end: 0.92, hint: "Meet the team" },
] as const;

// Horizontal lanes (vw) the bubbles rise through — biased to the sides so the
// centred headline stays readable.
const BUBBLE_X = [12, 84, 26, 90, 8, 72];

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Maps progress p within [a,b] to an eased 0..1.
function track(p: number, a: number, b: number) {
  return smoothstep(clamp((p - a) / (b - a)));
}

function currentBeatIndex(p: number) {
  const idx = SCROLL_BEATS.findIndex((beat) => p < beat.end);
  return idx === -1 ? SCROLL_BEATS.length : idx;
}

export function TeamScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  const activeBeat = currentBeatIndex(p);
  const scrollHint =
    SCROLL_BEATS[Math.min(activeBeat, SCROLL_BEATS.length - 1)]?.hint ??
    "Continue";
  const controlsOpacity =
    p < 0.78 ? 1 : p < 0.94 ? 1 - (p - 0.78) / 0.16 : 0;

  const handleScrollDown = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollable = container.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const nextBeat = SCROLL_BEATS.find((beat) => p < beat.end - 0.015);
    const targetProgress = nextBeat ? nextBeat.end + 0.01 : 1;
    const targetY = container.offsetTop + scrollable * targetProgress;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const scrollable = container.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          setP(0);
          return;
        }
        const scrolled = clamp(-rect.top / scrollable);
        setP(scrolled);
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

  // Beat 1 — first scroll: gold dot grows to mid size.
  const BEAT1_END = 0.16;
  // Beat 2 — second scroll: solid gold fills to full cover.
  const BEAT2_END = 0.30;

  const beat1 = track(p, 0.02, BEAT1_END);
  const beat2 = track(p, BEAT1_END, BEAT2_END);

  const inSolidGoldPhase = p < BEAT2_END;
  const solidGoldDiam = p < BEAT1_END
    ? lerp(1.4, 72, beat1)
    : lerp(72, 120, beat2);

  // Beat 3: ring expands while white centre keeps pace with the outer diameter.
  const goldOuterGrow = track(p, BEAT2_END, 0.48);
  const ringOuterDiam = inSolidGoldPhase
    ? solidGoldDiam
    : lerp(120, 170, goldOuterGrow);

  const goldGrowProgress = track(p, 0.02, BEAT2_END);
  const whiteInnerRatio = inSolidGoldPhase
    ? lerp(0, 0.82, goldGrowProgress)
    : 0.82;
  const outerDiam = inSolidGoldPhase ? solidGoldDiam : ringOuterDiam;
  const whiteDiam =
    outerDiam > 0.01 && whiteInnerRatio > 0.001
      ? outerDiam * whiteInnerRatio
      : 0;
  const bandWidthVh = Math.max(0.05, ringOuterDiam - whiteDiam);
  const strokeInViewBox = (bandWidthVh / ringOuterDiam) * 100;
  const ringRadius = Math.max(0.1, 50 - strokeInViewBox / 2);
  const showGoldRing =
    ringOuterDiam > 0.5 && bandWidthVh > 0.05 && strokeInViewBox > 0.05;

  // First text stays visible — gold sits behind copy; only the white centre masks it.
  const phase1Hide = track(p, 0.68, 0.78);

  // Phase 2 — secondary line (bottom-right), fades in then out.
  const phase2 = track(p, 0.12, 0.28) * (1 - track(p, 0.56, 0.7));

  // Decorative quote glyph — visible through both gold beats.
  const quote = track(p, 0.1, 0.18) * (1 - track(p, 0.52, 0.66));

  // 3. Inner reveal — emerges from the centre of the white dot once it's
  // largest, scaling up from a point.
  const reveal = track(p, 0.52, 0.66);

  return (
    <div
      ref={containerRef}
      className="relative bg-cream"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Gold ring — always behind text so copy stays readable through the band */}
        {showGoldRing && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[8] -translate-x-1/2 -translate-y-1/2"
            width={`${ringOuterDiam}vh`}
            height={`${ringOuterDiam}vh`}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={ringRadius}
              fill="none"
              className="stroke-accent"
              strokeWidth={strokeInViewBox}
            />
          </svg>
        )}

        {/* Opening statement — above gold ring; white centre masks where they overlap */}
        <div
          className="absolute left-6 top-1/2 z-[20] max-w-[44rem] -translate-y-1/2 lg:left-12"
          style={{ opacity: 1 - phase1Hide }}
        >
          <p className="section-label mb-6 text-warm-gray">(Our Team)</p>
          <h1 className="heading-display text-balance text-3xl leading-[1.1] text-charcoal sm:text-4xl md:text-5xl lg:text-6xl">
            We take the standard brief apart — and rebuild it around the core of
            your project.
          </h1>
        </div>

        {/* Decorative quote glyph — above gold ring */}
        <span
          className="absolute right-8 top-[34%] z-[20] select-none font-serif text-6xl leading-none text-accent lg:right-16 lg:text-7xl"
          style={{ opacity: quote }}
          aria-hidden="true"
        >
          &rdquo;
        </span>

        {/* Secondary line — above gold ring */}
        <div
          className="absolute bottom-[12%] right-6 z-[20] max-w-sm text-right lg:right-12"
          style={{ opacity: phase2 }}
        >
          <p className="text-lg leading-relaxed text-charcoal/80 lg:text-xl">
            That&apos;s why no two builds look alike. Each one is owned
            end-to-end — from first drawing to final handover.
          </p>
        </div>

        {/* White centre — above text; only this layer overlaps copy */}
        {whiteDiam > 0.01 && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-[25] rounded-full bg-cream"
            style={{
              width: `${whiteDiam}vh`,
              height: `${whiteDiam}vh`,
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Inner reveal: headline + CTA emerging from the centre of the dot */}
        <div
          className="absolute left-1/2 top-1/2 z-[30] w-[min(90vw,40rem)] px-6 text-center"
          style={{
            opacity: reveal,
            transform: `translate(-50%, -50%) scale(${lerp(0.35, 1, reveal)})`,
          }}
        >
          <h2 className="heading-display text-3xl leading-[1.1] text-charcoal sm:text-4xl lg:text-5xl">
            Rooted in Kolkata. Delivering across India. For 45 years.
          </h2>
          <Link
            href="/#contact"
            className="pointer-events-auto mt-8 inline-block bg-charcoal px-8 py-4 text-xs tracking-[0.15em] text-cream uppercase transition-all hover:bg-accent-dark hover:text-cream"
          >
            Build your project
          </Link>
        </div>

        {/* Project bubbles that float up and disappear above.
            They only begin once the reveal text has emerged. */}
        {/* Scroll controls — beat-aligned advance button */}
        <div
          className="absolute bottom-6 left-1/2 z-[40] -translate-x-1/2 transition-opacity duration-500 sm:bottom-8"
          style={{
            opacity: controlsOpacity,
            pointerEvents: controlsOpacity > 0.05 ? "auto" : "none",
          }}
        >
          <button
            type="button"
            onClick={handleScrollDown}
            aria-label={`${scrollHint}. Advance to the next part of the team story.`}
            className="group mx-auto flex flex-col items-center gap-2.5"
          >
            <span className="text-xs font-bold tracking-[0.28em] text-charcoal uppercase transition-colors group-hover:text-charcoal/70">
              {scrollHint}
            </span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2"
            >
              <svg
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                aria-hidden="true"
                className="text-accent transition-colors group-hover:text-accent-dark"
              >
                <path
                  d="M1 1.5 7 6.5 13 1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="h-10 w-px bg-accent/25">
                <div className="scroll-indicator-line h-full w-full bg-accent/80" />
              </div>
            </motion.span>
          </button>
        </div>

        {teamOrbit.map((item, i) => {
          // Each bubble drifts up the screen on its own staggered window.
          const start = 0.72 + i * 0.04;
          const lin = clamp((p - start) / 0.26);
          if (lin <= 0 || lin >= 1) return null;

          const y = lerp(118, -28, lin); // vh: below screen -> above screen
          const drift = Math.sin(lin * Math.PI * 1.4) * 4; // gentle sideways sway
          const opacity =
            Math.min(1, lin / 0.14) * Math.min(1, (1 - lin) / 0.22);
          const size = lerp(16, 20, Math.sin(lin * Math.PI)); // subtle swell

          return (
            <div
              key={item.label}
              className="absolute z-[30]"
              style={{
                left: `calc(${BUBBLE_X[i]}vw + ${drift}vh)`,
                top: `${y}vh`,
                width: `${size}vh`,
                height: `${size}vh`,
                transform: "translate(-50%, -50%)",
                opacity,
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full shadow-[0_24px_50px_-22px_rgba(26,24,20,0.55)] ring-2 ring-cream">
                <img
                  src={item.image}
                  alt={item.label}
                  className="h-full w-full object-cover"
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-charcoal/25" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
                  {item.label.split(/\s+/).map((word, wi) => (
                    <span
                      key={wi}
                      className="text-[0.75rem] font-medium leading-tight tracking-wide text-cream sm:text-[0.8rem]"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
