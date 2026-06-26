"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ServiceProcessStep } from "@/lib/content";
import { ProcessModelViewer } from "./ProcessModelViewer";

type ServicesProcessSectionProps = {
  steps: ServiceProcessStep[];
};

const SCROLL_VH = 420;

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

export function ServicesProcessSection({ steps }: ServicesProcessSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const scrollable = container.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;

        const p = clamp(-rect.top / scrollable);
        const idx = Math.min(
          steps.length - 1,
          Math.floor(p * steps.length + 0.08),
        );
        setActiveStep(idx);
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
  }, [steps.length]);

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative bg-cream"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div className="services-sticky-viewport sticky top-0 flex flex-col overflow-hidden">
        <div className="shrink-0 border-b border-charcoal/10 px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-label mb-2 sm:mb-3">How we work</p>
              <h2 className="heading-display text-2xl text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
                Process
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-warm-gray sm:text-sm">
              An interactive step-by-step view of how Build Design takes a project
              from brief to handover — scroll to advance each stage.
            </p>
          </div>
        </div>

        <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-4 px-4 py-4 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-10 lg:py-10">
          <div className="flex min-h-0 flex-col justify-center overflow-y-auto pr-0.5 sm:pr-1">
            <ol className="space-y-0">
              {steps.map((step, i) => {
                const isActive = i === activeStep;
                const isPast = i < activeStep;
                const isOpen = expanded === i;

                return (
                  <li
                    key={step.number}
                    className="border-t border-charcoal/10 py-3 transition-colors duration-500 sm:py-5"
                  >
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className="group flex w-full items-start gap-3 text-left sm:gap-4"
                    >
                      <span
                        className={`mt-0.5 font-serif text-xs transition-colors duration-500 sm:mt-1 sm:text-sm ${
                          isActive || isPast ? "text-design" : "text-warm-gray/50"
                        }`}
                      >
                        {step.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`heading-display text-lg transition-all duration-500 sm:text-xl md:text-2xl ${
                            isActive
                              ? "text-charcoal"
                              : isPast
                                ? "text-charcoal/70"
                                : "text-charcoal/35"
                          }`}
                          style={{
                            transform: isActive ? "translateX(0)" : "translateX(0)",
                          }}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`mt-1.5 text-xs leading-relaxed transition-all duration-500 sm:mt-2 sm:text-sm ${
                            isActive ? "text-warm-gray" : "text-warm-gray/45"
                          }`}
                        >
                          {step.summary}
                        </p>
                        <div
                          className="grid transition-all duration-500 ease-out"
                          style={{
                            gridTemplateRows: isOpen ? "1fr" : "0fr",
                          }}
                        >
                          <div className="overflow-hidden">
                            <p className="pt-2 text-xs leading-relaxed text-warm-gray/80 sm:pt-3 sm:text-sm">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                        <span className="mt-3 inline-block text-[10px] tracking-[0.22em] text-charcoal/45 uppercase transition-colors group-hover:text-design">
                          {isOpen ? "Less" : "More"}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative h-[240px] min-h-0 sm:h-[300px] lg:h-full lg:min-h-[420px]">
            <ProcessModelViewer
              activeStep={activeStep}
              onStepChange={setActiveStep}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cream to-transparent sm:h-16" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesCta() {
  return (
    <section className="border-t border-charcoal/10 bg-charcoal px-4 py-16 text-cream sm:px-6 sm:py-24 lg:px-10 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:gap-10 lg:flex-row lg:items-end">
        <div>
          <p className="section-label mb-4 text-cream/50 sm:mb-6">Ready for new views?</p>
          <h2 className="heading-display max-w-2xl text-2xl leading-[1.05] sm:text-3xl md:text-4xl lg:text-5xl">
            Serious projects require serious execution partners.
          </h2>
        </div>
        <Link
          href="/#contact"
          className="inline-flex items-center rounded-full bg-[#de915b] px-6 py-3 font-sans text-[10px] font-bold tracking-[0.15em] text-charcoal uppercase transition-colors hover:bg-[#c8784d] hover:text-cream sm:px-8 sm:py-4 sm:text-xs"
        >
          Consult your project
        </Link>
      </div>
    </section>
  );
}
