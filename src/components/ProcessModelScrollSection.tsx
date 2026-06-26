"use client";

import { useEffect, useRef, useState } from "react";
import { serviceProcessSteps } from "@/lib/content";
import { ProcessModelViewer } from "./services/ProcessModelViewer";

/** Scroll distance while the 3D view stays pinned full-screen. */
const SCROLL_VH = 240;

function Scene3DBadge() {
  return (
    <span className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-4 py-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="h-4 w-4 text-[#e04719]"
        aria-hidden="true"
      >
        <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3z" />
        <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
      </svg>
      <span className="font-category text-[11px] font-bold tracking-[0.28em] text-white/90 uppercase">
        3D Scene
      </span>
    </span>
  );
}

export function ProcessModelScrollSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const steps = serviceProcessSteps;
  const maxStep = Math.max(0, steps.length - 1);
  const safeStep = Math.min(Math.max(0, activeStep), maxStep);
  const active = steps[safeStep] ?? steps[0];

  useEffect(() => {
    if (activeStep !== safeStep) setActiveStep(safeStep);
  }, [activeStep, safeStep]);

  const handleStepChange = (step: number) => {
    setActiveStep(Math.min(Math.max(0, step), maxStep));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const pinned = rect.top <= 0 && rect.bottom >= vh;
        setIsFullscreen(pinned);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative bg-[#080808]"
      style={{ height: `${SCROLL_VH}vh` }}
      aria-label="Process — interactive 3D model"
    >
      <div
        className={`sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#080808] ${
          isFullscreen ? "z-40" : "z-20"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 z-10 home-process-overlay lg:bg-none">
          <div className="mx-auto h-full max-w-7xl px-4 pt-20 pb-8 sm:px-6 sm:pt-24 sm:pb-10 lg:px-10 lg:pt-32 lg:pb-12">
            <div className="max-w-md">
              <p className="mb-3 text-[10px] tracking-[0.28em] text-white/45 uppercase sm:mb-4">
                How we work
              </p>
              <div
                key={active.number}
                className="transition-all duration-700 ease-out"
              >
                <h2 className="heading-display text-xl leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                  {active.title}
                </h2>
                <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-white/55 sm:mt-4 sm:text-sm">
                  {active.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-3 text-left sm:inset-x-auto sm:right-8 sm:bottom-6 sm:text-right lg:right-16 lg:bottom-7 xl:right-24 2xl:right-32">
            <div className="mb-1 flex justify-start sm:justify-end" aria-hidden="true">
              <Scene3DBadge />
            </div>
            <p className="heading-display mb-1 text-lg text-white sm:mb-3 sm:text-2xl md:text-3xl">
              Process
            </p>
            <p className="max-w-xs text-[10px] leading-relaxed text-white/45 sm:text-sm">
              <span className="sm:hidden">Tap the markers to explore each stage.</span>
              <span className="hidden sm:inline">
                Click the markers on the model to explore each stage of how
                Build Design delivers your project.
              </span>
            </p>
            <div className="mt-3 h-px w-28 bg-gradient-to-r from-[#4a7cff] via-[#de915b] to-transparent sm:mt-5 sm:w-48 sm:ml-auto" />
            {isFullscreen && (
              <p className="mt-4 hidden text-[10px] tracking-[0.2em] text-white/35 uppercase md:block">
                Scroll to continue
              </p>
            )}
          </div>
        </div>

        <div className="relative h-full w-full">
          <ProcessModelViewer
            activeStep={safeStep}
            onStepChange={handleStepChange}
            mobileCameraPullBack={1.42}
          />
        </div>
      </div>
    </section>
  );
}
