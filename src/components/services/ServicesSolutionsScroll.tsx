"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Service } from "@/lib/content";
import { ScrollAdvanceControl } from "@/components/ui/ScrollAdvanceControl";

type ServicesSolutionsScrollProps = {
  services: Service[];
};

const SLIDE_INTERVAL_MS = 1500;
const SLIDE_TRANSITION_MS = 900;

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

export function ServicesSolutionsScroll({ services }: ServicesSolutionsScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const autoplayActiveRef = useRef(false);
  const holdTimerRef = useRef(0);
  const rafRef = useRef(0);
  const runTransitionRef = useRef<(() => void) | null>(null);
  const scheduleHoldRef = useRef<(() => void) | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  activeIndexRef.current = activeIndex;

  const scrollProgress =
    services.length > 0 ? (activeIndex + progress) / services.length : 0;

  const scrollBeats = services.map((_, i) => ({
    end: (i + 1) / services.length,
    hint:
      i === 0
        ? "Scroll"
        : i === services.length - 1
          ? "Our beliefs"
          : "Keep scrolling",
  }));

  const activeBeat = scrollBeats.findIndex((beat) => scrollProgress < beat.end);
  const scrollHint =
    activeBeat === -1
      ? "Our beliefs"
      : (scrollBeats[activeBeat]?.hint ?? "Continue");
  const controlsOpacity =
    scrollProgress < 0.78
      ? 1
      : scrollProgress < 0.94
        ? 1 - (scrollProgress - 0.78) / 0.16
        : 0;

  const clearTimers = () => {
    window.clearTimeout(holdTimerRef.current);
    cancelAnimationFrame(rafRef.current);
  };

  useEffect(() => {
    const sticky = stickyRef.current;
    if (!sticky) return;

    const scheduleHold = () => {
      clearTimers();
      if (activeIndexRef.current >= services.length - 1) return;

      holdTimerRef.current = window.setTimeout(() => {
        runTransitionRef.current?.();
      }, SLIDE_INTERVAL_MS);
    };

    const runTransition = () => {
      clearTimers();
      if (activeIndexRef.current >= services.length - 1) return;

      const start = performance.now();

      const animate = (now: number) => {
        const t = clamp((now - start) / SLIDE_TRANSITION_MS);
        setProgress(t);

        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          const nextIndex = activeIndexRef.current + 1;
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
          setProgress(0);
          scheduleHold();
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    runTransitionRef.current = runTransition;
    scheduleHoldRef.current = scheduleHold;

    const syncAutoplay = (shouldPlay: boolean) => {
      if (shouldPlay && !autoplayActiveRef.current) {
        autoplayActiveRef.current = true;
        scheduleHold();
      } else if (!shouldPlay && autoplayActiveRef.current) {
        autoplayActiveRef.current = false;
        clearTimers();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        syncAutoplay(entry.isIntersecting && entry.intersectionRatio >= 0.4);
      },
      { threshold: [0, 0.25, 0.4, 0.5, 0.75, 1] },
    );

    observer.observe(sticky);

    return () => {
      autoplayActiveRef.current = false;
      clearTimers();
      observer.disconnect();
    };
  }, [services.length]);

  const handleScrollDown = () => {
    if (activeIndexRef.current >= services.length - 1) {
      document.getElementById("beliefs")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    runTransitionRef.current?.();
  };

  return (
    <section id="solutions" ref={containerRef} className="relative">
      <div
        ref={stickyRef}
        className="services-sticky-viewport relative overflow-hidden bg-charcoal text-cream"
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col px-4 pb-14 pt-[4.75rem] sm:px-6 sm:pb-16 sm:pt-20 lg:px-10 lg:py-16">
          <div className="mb-4 flex shrink-0 items-end justify-between gap-4 sm:mb-8 sm:gap-6">
            <div>
              <p className="section-label mb-2 text-cream/50 sm:mb-4">Our offer</p>
              <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Solutions
              </h2>
            </div>
            <span className="shrink-0 font-serif text-xs tracking-[0.2em] text-cream/40 sm:text-sm">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(services.length).padStart(2, "0")}
            </span>
          </div>

          <div className="relative min-h-0 flex-1">
            {services.map((service, i) => {
              const isActive = i === activeIndex;
              const isNext = i === activeIndex + 1;
              const isLastSlide = activeIndex === services.length - 1;
              const leave =
                isActive && !isLastSlide ? smoothstep(progress) : 0;
              const enter = isActive ? 1 - leave : 0;
              const opacity = isActive ? 1 - leave : isNext ? smoothstep(progress) : 0;
              const translateY = isActive
                ? leave * -48
                : isNext
                  ? (1 - smoothstep(progress)) * 48
                  : 48;

              if (opacity <= 0.01 && !isActive && !isNext) return null;

              return (
                <div
                  key={service.title}
                  className="absolute inset-0 grid min-h-0 grid-rows-[auto_1fr] gap-4 will-change-[transform,opacity] sm:gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-12"
                  style={{
                    opacity,
                    transform: `translate3d(0, ${translateY}px, 0)`,
                    pointerEvents: opacity > 0.5 ? "auto" : "none",
                  }}
                >
                  <div className="flex min-h-0 flex-col justify-start overflow-y-auto pr-0.5 lg:justify-between lg:overflow-visible lg:pr-0">
                    <div>
                      <h3 className="heading-display mb-3 text-2xl leading-[0.95] sm:mb-6 sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                        {service.headline.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>
                      <p className="max-w-md text-xs leading-relaxed text-cream/70 sm:text-sm md:text-base">
                        {service.description}
                      </p>
                    </div>
                    <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs text-cream/75 sm:gap-3 sm:text-sm"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-design" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="services-solutions-image relative min-h-0 overflow-hidden rounded-sm lg:shrink">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700"
                      style={{
                        transform: `scale(${1 + enter * 0.04})`,
                      }}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ScrollAdvanceControl
          hint={scrollHint}
          onAdvance={handleScrollDown}
          opacity={controlsOpacity}
          variant="light"
          className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-8"
          ariaLabel={`${scrollHint}. Advance to the next service.`}
        />
      </div>
    </section>
  );
}
