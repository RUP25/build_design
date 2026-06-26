"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

type HomeScrollControlProps = {
  enabled?: boolean;
};

type HomeScrollBeat = {
  hint: string;
  sectionId: string;
  progress: number;
};

const HOME_SCROLL_BEATS: HomeScrollBeat[] = [
  { hint: "Scroll", sectionId: "home-scroll", progress: 0.06 },
  { hint: "Keep scrolling", sectionId: "home-scroll", progress: 0.2 },
  { hint: "Explore our work", sectionId: "home-scroll", progress: 0.38 },
  { hint: "Watch it unfold", sectionId: "home-scroll", progress: 0.55 },
  { hint: "Our expertise", sectionId: "home-scroll", progress: 0.72 },
  { hint: "See the process", sectionId: "home-scroll", progress: 0.9 },
  { hint: "3D walkthrough", sectionId: "process", progress: 0.22 },
  { hint: "How we build", sectionId: "process", progress: 0.52 },
  { hint: "Every detail", sectionId: "process", progress: 0.84 },
  { hint: "Proven track record", sectionId: "track-record", progress: 0.08 },
  { hint: "Questions answered", sectionId: "faq", progress: 0.08 },
  { hint: "Get in touch", sectionId: "contact", progress: 0.1 },
];

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function getElementTop(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY;
}

function getBeatTargetY(beat: HomeScrollBeat) {
  const el = document.getElementById(beat.sectionId);
  if (!el) return 0;

  const top = getElementTop(el);
  const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
  return top + scrollable * clamp(beat.progress);
}

function currentBeatIndex(scrollY: number) {
  for (let i = 0; i < HOME_SCROLL_BEATS.length; i += 1) {
    if (scrollY < getBeatTargetY(HOME_SCROLL_BEATS[i]) - 20) return i;
  }
  return HOME_SCROLL_BEATS.length;
}

export function HomeScrollControl({ enabled = true }: HomeScrollControlProps) {
  const [visible, setVisible] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);
  const [controlsOpacity, setControlsOpacity] = useState(1);
  const [useLightText, setUseLightText] = useState(true);
  const [isInitialStage, setIsInitialStage] = useState(true);
  const [inProcessSection, setInProcessSection] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const scrollHint =
    HOME_SCROLL_BEATS[Math.min(activeBeat, HOME_SCROLL_BEATS.length - 1)]
      ?.hint ?? "Continue";

  const handleScrollDown = useCallback(() => {
    const y = window.scrollY;
    const beat = HOME_SCROLL_BEATS[currentBeatIndex(y)];
    if (!beat) return;

    window.scrollTo({
      top: getBeatTargetY(beat),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const inProcessMobile = inProcessSection && isMobile;
  const inShowcaseMobile =
    isMobile &&
    !inProcessSection &&
    activeBeat >= 2 &&
    activeBeat <= 5 &&
    !useLightText;

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const max = Math.max(
          0,
          document.documentElement.scrollHeight - vh,
        );

        setVisible(max > vh * 0.5);

        const beat = currentBeatIndex(y);
        setActiveBeat(beat);

        const contactEl = document.getElementById("contact");
        const contactTop = contactEl ? getElementTop(contactEl) : max;
        const contactFade = clamp((y - (contactTop - vh * 0.15)) / (vh * 0.55));
        setControlsOpacity(
          beat >= HOME_SCROLL_BEATS.length ? 0 : 1 - contactFade * 0.95,
        );

        const overHomeHero = y < vh * 0.82;
        const processEl = document.getElementById("process");
        let inProcess = false;
        if (processEl) {
          const rect = processEl.getBoundingClientRect();
          inProcess = rect.top <= 0 && rect.bottom >= vh * 0.45;
        }

        setUseLightText(overHomeHero || inProcess);
        setInProcessSection(inProcess);
        setIsInitialStage(beat === 0 && y < vh * 0.18);
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
  }, [enabled]);

  if (!enabled || !visible || controlsOpacity < 0.05) return null;

  const hintClass = useLightText
    ? "text-cream/85 group-hover:text-cream"
    : "text-charcoal group-hover:text-charcoal/70";

  return (
    <>
      {inShowcaseMobile && (
        <div
          className="home-scroll-control pointer-events-none fixed left-4 bottom-[13%] z-[45] transition-opacity duration-500"
          style={{ opacity: controlsOpacity }}
          aria-hidden="true"
        >
          <span className="home-scroll-control__hint text-xs font-bold tracking-[0.28em] text-charcoal/85 uppercase">
            {scrollHint}
          </span>
        </div>
      )}

      <div
      className={`home-scroll-control fixed z-[45] transition-[opacity,top,right,bottom,transform] duration-500 ${
        inProcessMobile
          ? "right-4 top-[38%] left-auto bottom-auto translate-x-0"
          : `left-1/2 -translate-x-1/2 ${
              isInitialStage
                ? "bottom-[4.75rem] sm:bottom-4"
                : "bottom-5 sm:bottom-8"
            }`
      }`}
      style={{
        opacity: controlsOpacity,
        pointerEvents: controlsOpacity > 0.05 ? "auto" : "none",
      }}
      aria-label="Page scroll controls"
    >
      <button
        type="button"
        onClick={handleScrollDown}
        aria-label={`${scrollHint}. Advance to the next part of the home page.`}
        className={`group flex flex-col gap-2.5 ${
          inProcessMobile ? "items-end" : "mx-auto items-center"
        }`}
      >
        <span
          className={`home-scroll-control__hint text-xs font-bold tracking-[0.28em] uppercase transition-colors ${
            inShowcaseMobile ? "sr-only" : hintClass
          }`}
        >
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
            className={`transition-colors ${
              useLightText
                ? "text-cream/70 group-hover:text-cream"
                : "text-accent group-hover:text-accent-dark"
            }`}
          >
            <path
              d="M1 1.5 7 6.5 13 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className={`home-scroll-control__line h-10 w-px ${
              useLightText ? "bg-cream/25" : "bg-accent/25"
            }`}
          >
            <div
              className={`scroll-indicator-line h-full w-full ${
                useLightText ? "bg-cream/70" : "bg-accent/80"
              }`}
            />
          </div>
        </motion.span>
      </button>
    </div>
    </>
  );
}
