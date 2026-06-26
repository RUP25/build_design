"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { ProjectImageCanvas } from "./ProjectImageCanvas";

type ProjectScrollShowcaseProps = {
  projects: Project[];
};

function ProjectTextPanel({
  project,
  opacity,
  translateY,
}: {
  project: Project;
  opacity: number;
  translateY: number;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: opacity > 0.5 ? "auto" : "none",
      }}
    >
      <div className="flex gap-4 sm:gap-6 md:gap-8">
        <div className="mt-1 h-16 w-px shrink-0 bg-cream/40 sm:mt-2 sm:h-24 md:h-32" />
        <div className="min-w-0">
          <p className="mb-2 text-[9px] tracking-[0.22em] text-cream/50 uppercase sm:mb-4 sm:text-[10px] sm:tracking-[0.25em]">
            {project.scope}
          </p>
          <h3 className="heading-display mb-3 text-2xl leading-[0.95] text-cream sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
            {project.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>
          <p className="max-w-md text-xs leading-relaxed text-cream/65 sm:text-sm md:text-base">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProjectScrollShowcase({ projects }: ProjectScrollShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

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
        const rawProgress = scrolled / (scrollable / (projects.length - 1 || 1));
        const clamped = Math.max(
          0,
          Math.min(projects.length - 1, rawProgress),
        );
        setProgress(clamped);
        setActiveIndex(Math.round(clamped));
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
  }, [projects.length]);

  const currentIndex = Math.min(
    Math.floor(progress),
    Math.max(0, projects.length - 2),
  );
  const nextIndex = Math.min(currentIndex + 1, projects.length - 1);
  const localT = progress - currentIndex;
  const eased =
    localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;

  const scrollHeight =
    projects.length > 1 ? `${projects.length * 100}vh` : "100vh";

  return (
    <div
      ref={containerRef}
      className="relative bg-charcoal"
      style={{ height: scrollHeight }}
    >
      <div className="projects-sticky-viewport sticky top-0 overflow-hidden">
        <div className="mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-8 lg:px-8">
          <div className="relative z-10 flex h-[44%] min-h-0 flex-col justify-center pt-16 sm:h-[42%] sm:pt-20 lg:h-full lg:w-[42%] lg:pt-0">
            <div className="relative min-h-[180px] sm:min-h-[220px] md:min-h-[280px]">
              <ProjectTextPanel
                project={projects[currentIndex]}
                opacity={1 - eased}
                translateY={-eased * 24}
              />
              {currentIndex !== nextIndex && (
                <ProjectTextPanel
                  project={projects[nextIndex]}
                  opacity={eased}
                  translateY={(1 - eased) * 24}
                />
              )}
            </div>

            <div className="mt-4 flex items-center gap-3 sm:mt-6 sm:gap-4 lg:mt-10">
              <span className="text-[10px] tracking-[0.2em] text-cream/40 sm:text-xs">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-1 gap-2">
                {projects.map((project, i) => (
                  <div
                    key={project.name}
                    className="h-px flex-1 transition-colors duration-500"
                    style={{
                      backgroundColor:
                        i <= activeIndex
                          ? "rgba(196, 165, 116, 0.9)"
                          : "rgba(255, 255, 255, 0.15)",
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
            <p className="mt-4 hidden text-[10px] tracking-[0.3em] text-cream/30 uppercase lg:block">
              Scroll to explore
            </p>
          </div>

          <div className="relative h-[56%] min-h-0 sm:h-[58%] lg:h-[85%] lg:w-[58%]">
            <ProjectImageCanvas projects={projects} progress={progress} />
          </div>
        </div>
      </div>
    </div>
  );
}
