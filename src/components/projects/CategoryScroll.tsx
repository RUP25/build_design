"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { ScrollAdvanceControl } from "@/components/ui/ScrollAdvanceControl";

type CategoryScrollProps = {
  label: string;
  title: string;
  description: string;
  projects: Project[];
  reverse?: boolean;
  sectionId?: string;
  exitHint?: string;
};

const SLATS = 12;

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

// A blind/curtain reveal: the `next` image appears as horizontal slats that
// each grow from a thin line into a full strip, staggered top-to-bottom.
function SlatReveal({
  base,
  next,
  baseAlt,
  nextAlt,
  t,
}: {
  base: string;
  next: string;
  baseAlt: string;
  nextAlt: string;
  t: number;
}) {
  const stripPct = 100 / SLATS;
  // Portion of the timeline each slat can lag behind the first one.
  const maxStagger = 0.45;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base (current) image fully visible underneath */}
      <img
        src={base}
        alt={baseAlt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Next image revealed slat by slat */}
      {Array.from({ length: SLATS }).map((_, i) => {
        const start = (i / SLATS) * maxStagger;
        const reveal = smoothstep((t - start) / (1 - maxStagger));
        return (
          <div
            key={i}
            className="absolute left-0 right-0 overflow-hidden"
            style={{
              top: `${i * stripPct}%`,
              height: `${stripPct}%`,
              transform: `scaleY(${reveal})`,
              transformOrigin: "center",
            }}
          >
            <img
              src={next}
              alt={nextAlt}
              loading="lazy"
              className="absolute left-0 w-full object-cover"
              style={{ top: `${-i * 100}%`, height: `${SLATS * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function CategoryScroll({
  label,
  title,
  description,
  projects,
  reverse = false,
  sectionId,
  exitHint = "Continue",
}: CategoryScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollBeats = projects.map((_, i) => ({
    end: (i + 1) / projects.length,
    hint:
      i === 0
        ? "Scroll"
        : i === projects.length - 1
          ? exitHint
          : "Keep scrolling",
  }));

  const activeBeat = scrollBeats.findIndex((beat) => scrollProgress < beat.end);
  const scrollHint =
    activeBeat === -1
      ? exitHint
      : (scrollBeats[activeBeat]?.hint ?? "Continue");
  const controlsOpacity =
    scrollProgress < 0.78
      ? 1
      : scrollProgress < 0.94
        ? 1 - (scrollProgress - 0.78) / 0.16
        : 0;

  const handleScrollDown = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollable = container.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const nextBeat = scrollBeats.find(
      (beat) => scrollProgress < beat.end - 0.015,
    );
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
          setProgress(0);
          setScrollProgress(0);
          return;
        }
        const scrolled = clamp(-rect.top / scrollable);
        setScrollProgress(scrolled);
        setProgress(scrolled * (projects.length - 1));
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
  }, [projects.length]);

  const lastIndex = projects.length - 1;
  const currentIndex = Math.min(Math.floor(progress), Math.max(0, lastIndex - 1));
  const nextIndex = Math.min(currentIndex + 1, lastIndex);
  const localT = progress - currentIndex;
  const activeIndex = Math.min(lastIndex, Math.round(progress));

  const current = projects[currentIndex];
  const next = projects[nextIndex];

  return (
    <div
      ref={containerRef}
      id={sectionId}
      style={{ height: `${projects.length * 100}vh` }}
      className="relative"
    >
      <div className="projects-sticky-viewport relative sticky top-0 flex flex-col justify-center overflow-hidden py-4 sm:py-6 lg:h-screen lg:items-center lg:py-0">
        <div className="mx-auto grid w-full max-w-7xl flex-1 content-center items-center gap-6 px-4 sm:gap-8 sm:px-6 md:gap-10 lg:grid-cols-2 lg:gap-20 lg:px-8">
          {/* Text panel */}
          <div className={`min-w-0 ${reverse ? "lg:order-2" : ""}`}>
            <p className="mb-3 text-[10px] tracking-[0.24em] text-cream/40 uppercase sm:mb-6 sm:text-[11px] sm:tracking-[0.3em]">
              {label}
            </p>
            <h3 className="heading-display mb-4 text-[clamp(1.75rem,6vw,2.5rem)] leading-tight text-cream sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h3>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-cream/60 sm:mb-8 sm:text-base md:mb-10 md:text-lg">
              {description}
            </p>

            {/* Active project meta */}
            <div className="relative h-16 max-w-md overflow-hidden border-t border-cream/15 pt-4 sm:h-20 sm:pt-5">
              {projects.map((project, i) => (
                <div
                  key={project.name}
                  className="absolute inset-x-0 top-4 transition-all duration-500 sm:top-5"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    transform: `translateY(${i === activeIndex ? 0 : 12}px)`,
                  }}
                >
                  <p className="text-[9px] tracking-[0.22em] text-accent uppercase sm:text-[10px] sm:tracking-[0.25em]">
                    {project.scope}
                  </p>
                  <p className="mt-1 font-serif text-base text-cream sm:mt-2 sm:text-xl">
                    {project.name}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress counter + bars */}
            <div className="mt-5 flex max-w-md items-center gap-3 sm:mt-8 sm:gap-4">
              <span className="text-[10px] tracking-[0.2em] text-cream/40 sm:text-xs">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-1 gap-1 sm:gap-1.5">
                {projects.map((project, i) => (
                  <span
                    key={project.name}
                    className="h-px flex-1 transition-colors duration-500"
                    style={{
                      backgroundColor:
                        i <= activeIndex
                          ? "rgba(196,165,116,0.9)"
                          : "rgba(245,240,232,0.15)",
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] tracking-[0.2em] text-cream/40 sm:text-xs">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            <p className="mt-3 text-[9px] tracking-[0.26em] text-cream/30 uppercase sm:mt-4 sm:text-[10px] sm:tracking-[0.3em] lg:hidden">
              Scroll to explore
            </p>
          </div>
          <div
            className={`relative mx-auto w-full max-w-md min-h-0 lg:mx-0 lg:max-w-none ${reverse ? "lg:order-1" : ""}`}
          >
            {/* Large image — curtain/blind reveal between projects */}
            <div className="projects-category-image-main relative aspect-[4/5] w-[78%] overflow-hidden">
              <SlatReveal
                base={current.image}
                next={next.image}
                baseAlt={current.name}
                nextAlt={next.name}
                t={localT}
              />
            </div>

            {/* Inset detail — crossfades */}
            <div className="projects-category-image-inset absolute bottom-0 right-0 aspect-square w-[46%] overflow-hidden border-4 border-charcoal">
              {projects.map((project, i) => (
                <img
                  key={project.name}
                  src={project.imageSecondary}
                  alt={`${project.name} detail`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
                  style={{ opacity: i === activeIndex ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
        </div>

        <ScrollAdvanceControl
          hint={scrollHint}
          onAdvance={handleScrollDown}
          opacity={controlsOpacity}
          variant="light"
          className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-8"
          ariaLabel={`${scrollHint}. Advance to the next project.`}
        />
      </div>
    </div>
  );
}
