"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Service } from "@/lib/content";

type ServiceScrollShowcaseProps = {
  services: Service[];
};

const GAP = 1.2;
const SLOT_WIDTH = 50 - GAP;
const RIGHT_SLOT = 50 + GAP;
const SCROLL_VH_PER_SERVICE = 160;
const ENTER_SCROLL_VH = 55;
const TICKER_TEXT = "Why Build Design";

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function textOnLeft(index: number) {
  return index % 2 === 0;
}

function ServiceTextContent({
  service,
  index,
  total,
  textOnRight,
}: {
  service: Service;
  index: number;
  total: number;
  textOnRight: boolean;
}) {
  const nextLabel = String(Math.min(index + 2, total)).padStart(2, "0");

  return (
    <>
      <div>
        <h3 className="heading-display mb-4 text-xl leading-[0.95] text-service-text sm:mb-6 sm:text-2xl md:text-3xl lg:text-[2.75rem]">
          {service.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <ul className="space-y-1.5 sm:space-y-2 lg:block">
          {service.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-[10px] text-service-text/70 sm:text-xs"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-service-text text-xs font-medium text-charcoal sm:h-10 sm:w-10">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-service-text/30 text-xs text-service-text/60 sm:h-10 sm:w-10">
            {nextLabel}
          </span>
        </div>
        <p
          className={`max-w-[200px] text-xs leading-relaxed text-service-text/75 ${
            textOnRight ? "text-left" : "text-right"
          }`}
        >
          {service.description}
        </p>
      </div>
    </>
  );
}

function TextPanel({
  service,
  index,
  total,
  opacity,
  translateY,
}: {
  service: Service;
  index: number;
  total: number;
  opacity: number;
  translateY: number;
}) {
  if (opacity <= 0.005) return null;

  const onLeft = textOnLeft(index);

  return (
    <div
      className="absolute top-0 flex h-full flex-col justify-between overflow-hidden rounded-[1.25rem] bg-service-card p-5 will-change-[transform,opacity] sm:rounded-[1.75rem] sm:p-7 md:p-9 lg:rounded-[2.5rem] lg:p-12"
      style={{
        left: onLeft ? 0 : `${RIGHT_SLOT}%`,
        width: `${SLOT_WIDTH}%`,
        opacity,
        zIndex: 10,
        transform: `translate3d(0, ${translateY}px, 0)`,
      }}
    >
      <ServiceTextContent
        service={service}
        index={index}
        total={total}
        textOnRight={!onLeft}
      />
    </div>
  );
}

function ImagePanel({
  service,
  index,
  opacity,
  curtain,
}: {
  service: Service;
  index: number;
  opacity: number;
  curtain?: number;
}) {
  if (opacity <= 0.005) return null;

  const onLeft = !textOnLeft(index);
  const reveal = curtain ?? 1;
  const hiddenPct = (1 - reveal) * 100;

  return (
    <div
      className="absolute top-0 h-full overflow-hidden rounded-[1.75rem] lg:rounded-[2.5rem]"
      style={{
        left: onLeft ? 0 : `${RIGHT_SLOT}%`,
        width: `${SLOT_WIDTH}%`,
        opacity,
        zIndex: 5,
        clipPath:
          curtain !== undefined ? `inset(${hiddenPct}% 0 0 0)` : undefined,
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          sizes="55vw"
        />
        {curtain !== undefined && reveal < 0.99 && (
          <>
            <div
              className="absolute inset-x-0 top-0 bg-charcoal"
              style={{ height: `${hiddenPct}%` }}
            />
            <div
              className="absolute inset-x-0 bg-gradient-to-b from-charcoal via-charcoal/80 to-transparent"
              style={{ top: `${Math.max(0, hiddenPct - 4)}%`, height: "8%" }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function TickerLayer({ opacity, translateY }: { opacity: number; translateY: number }) {
  const repeated = Array.from({ length: 8 }, () => TICKER_TEXT);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[14%] z-[1] will-change-[transform,opacity] lg:top-[12%]"
      style={{
        opacity,
        transform: `translate3d(0, ${translateY}px, 0)`,
      }}
      aria-hidden={opacity < 0.05}
    >
      <div className="mx-auto max-w-7xl px-6 pt-4 lg:px-8">
        <p className="mb-6 max-w-xs text-sm leading-relaxed text-service-text/65">
          Want to learn more about the benefits of—Build Design?
        </p>
      </div>
      <div className="relative overflow-hidden border-t border-service-text/10 py-5">
        <div className="ticker-track flex w-max items-center gap-12 whitespace-nowrap">
          {[...repeated, ...repeated].map((text, i) => (
            <span
              key={`${text}-${i}`}
              className="heading-display text-[clamp(3rem,10vw,7rem)] leading-none text-service-text"
            >
              {text}
              <span className="mx-8 text-service-text/35">*</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ServiceScrollShowcase({ services }: ServiceScrollShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enterProgress, setEnterProgress] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const scrollable = container.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;

        const scrolled = Math.max(0, -rect.top);
        const enterPx = (ENTER_SCROLL_VH / 100) * window.innerHeight;
        const enterT = Math.min(1, scrolled / Math.max(1, enterPx));
        setEnterProgress(smoothstep(enterT));

        const serviceScrolled = Math.max(0, scrolled - enterPx);
        const serviceScrollable = Math.max(1, scrollable - enterPx);
        const segment = serviceScrollable / Math.max(1, services.length - 1);
        setProgress(
          Math.max(0, Math.min(services.length - 1, serviceScrolled / segment)),
        );
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [services.length]);

  if (services.length === 0) return null;

  const maxIdx = services.length - 1;
  const currentIndex = Math.min(Math.floor(progress), maxIdx);
  const nextIndex = Math.min(currentIndex + 1, maxIdx);
  const t = currentIndex >= maxIdx ? 0 : progress - currentIndex;
  const isTransitioning = currentIndex !== nextIndex && t > 0.01;

  const blend = isTransitioning ? smoothstep(t) : 0;
  const curtain = isTransitioning ? smoothstep((t - 0.35) / 0.65) : 1;

  const current = services[currentIndex];
  const next = services[nextIndex];
  const activeIndex = blend > 0.5 ? nextIndex : currentIndex;

  const tickerOpacity = 1 - enterProgress;
  const tickerY = lerp(0, -72, enterProgress);
  const cardsY = lerp(140, 0, enterProgress);

  const scrollHeight =
    services.length > 1
      ? `${ENTER_SCROLL_VH + services.length * SCROLL_VH_PER_SERVICE}vh`
      : `${ENTER_SCROLL_VH + 100}vh`;

  return (
    <div
      ref={containerRef}
      className="relative -mt-6 bg-charcoal lg:-mt-10"
      style={{ height: scrollHeight }}
    >
      <div className="services-sticky-viewport sticky top-0 overflow-hidden">
        <TickerLayer opacity={tickerOpacity} translateY={tickerY} />

        <div
          className="absolute inset-x-0 bottom-[4%] z-10 px-3 will-change-transform sm:bottom-[6%] sm:px-5 lg:bottom-[8%] lg:px-8"
          style={{ transform: `translate3d(0, ${cardsY}px, 0)` }}
        >
          <div className="relative mx-auto h-[min(62vh,520px)] w-full max-w-7xl sm:h-[min(58vh,560px)] lg:h-[min(62vh,600px)]">
            <TextPanel
              service={current}
              index={currentIndex}
              total={services.length}
              opacity={1 - blend}
              translateY={lerp(0, -20, blend)}
            />
            {isTransitioning && (
              <TextPanel
                service={next}
                index={nextIndex}
                total={services.length}
                opacity={blend}
                translateY={lerp(20, 0, blend)}
              />
            )}

            <ImagePanel
              service={current}
              index={currentIndex}
              opacity={isTransitioning ? 1 - blend : 1}
            />
            {isTransitioning && (
              <ImagePanel
                service={next}
                index={nextIndex}
                opacity={Math.max(blend, 0.01)}
                curtain={curtain}
              />
            )}

            <div className="absolute -bottom-2 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 lg:-bottom-4">
              {services.map((service, i) => (
                <div
                  key={service.title}
                  className="h-1 rounded-full"
                  style={{
                    width: i === activeIndex ? "2rem" : "0.5rem",
                    backgroundColor:
                      i <= activeIndex
                        ? "rgba(177, 166, 150, 0.95)"
                        : "rgba(177, 166, 150, 0.25)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
