"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Service } from "@/lib/content";
import { ScrollAdvanceControl } from "@/components/ui/ScrollAdvanceControl";

type ServicesSolutionsScrollProps = {
  services: Service[];
};

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

export function ServicesSolutionsScroll({ services }: ServicesSolutionsScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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
          setScrollProgress(0);
          return;
        }

        const p = clamp(-rect.top / scrollable);
        setScrollProgress(p);
        const idx = Math.min(
          services.length - 1,
          Math.floor(p * services.length),
        );
        const local = p * services.length - idx;
        setActiveIndex(idx);
        setProgress(local);
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
  }, [services.length]);

  const scrollHeight = `${Math.max(services.length, 1) * 110}vh`;

  return (
    <section id="solutions" ref={containerRef} style={{ height: scrollHeight }}>
      <div className="services-sticky-viewport relative sticky top-0 overflow-hidden bg-charcoal text-cream">
        <div className="mx-auto flex h-full max-w-7xl flex-col px-4 pb-14 pt-[4.75rem] sm:px-6 sm:py-20 lg:px-10 lg:py-24">
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
                  className="absolute inset-0 grid min-h-0 grid-rows-[1fr_auto] gap-4 will-change-[transform,opacity] sm:gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-12"
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

                  <div className="services-solutions-image relative min-h-[200px] shrink-0 overflow-hidden rounded-sm sm:min-h-[240px] lg:min-h-0 lg:shrink">
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
