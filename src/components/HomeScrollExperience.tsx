"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HeroBlindTransition } from "@/components/HeroBlindTransition";

// ─── Hero background (Reaktor-style vertical blind transitions, auto-advance) ─

type HeroSlide = { name: string; headline: string; image: string };

const HERO_SLIDES: HeroSlide[] = [
  {
    name: "Private Residences",
    headline: "Private Residences.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
  },
  {
    name: "Commercial Spaces",
    headline: "Commercial Spaces.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
  },
  {
    name: "Solid wood work",
    headline: "Solid wood work.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
  },
];

const HERO_HOLD_MS = 2000;
const HERO_TRANSITION_MS = 850;

// ─── Showcase categories (orbit spheres) ─────────────────────────────────────

type Sphere = { title: string; subtitle: string; image: string };
type Category = { label: string; spheres: Sphere[] };

const CATEGORIES: Category[] = [
  {
    label: "Residential",
    spheres: [
      {
        title: "Luxury Villas",
        subtitle:
          "Custom-designed villas built with exceptional craftsmanship, premium materials, and seamless project execution.",
        image: "/images/residential/living-room.png",
      },
      {
        title: "Premium Bungalows",
        subtitle:
          "Elegant bungalow residences delivered with integrated structural, architectural, and finishing excellence.",
        image: "/images/residential/dining-room.png",
      },
      {
        title: "Custom Family Homes",
        subtitle:
          "Personalized living spaces developed to reflect unique lifestyles while ensuring quality, comfort, and durability.",
        image: "/images/residential/custom-family-homes.jpg",
      },
    ],
  },
  {
    label: "Commercial",
    spheres: [
      {
        title: "Office & Corporate Buildings",
        subtitle:
          "Modern workspaces designed and executed to support productivity, scalability, and operational efficiency.",
        image: "/images/commercial/office-conference.png",
      },
      {
        title: "Hospitality & Leisure Spaces",
        subtitle:
          "Hotels, resorts, and guest-centric environments built with a focus on comfort, functionality, and premium experiences.",
        image: "/images/commercial/hospitality-bar.png",
      },
      {
        title: "Airport & Infrastructure Projects",
        subtitle:
          "Large-scale public and transportation facilities delivered with precision engineering, compliance, and reliability.",
        image: "/images/commercial/airport-infrastructure.jpg",
      },
    ],
  },
  {
    label: "Solid wood",
    spheres: [
      {
        title: "Custom Furniture",
        subtitle:
          "Handcrafted solid wood furniture, including beds, dining sets, console tables, and storage solutions, crafted for durability and timeless appeal.",
        image: "/images/solid-wood/nesting-tables.png",
      },
      {
        title: "Interior Design",
        subtitle:
          "Thoughtfully designed interiors that balance functionality, elegance, and comfort, tailored to each client's lifestyle and vision.",
        image: "/images/solid-wood/carved-chair.png",
      },
      {
        title: "Bespoke Living Spaces",
        subtitle:
          "From contemporary apartments to heritage bungalows, we create warm, character-rich environments that blend beauty with everyday usability.",
        image: "/images/solid-wood/bespoke-living-spaces.jpg",
      },
    ],
  },
];

/** Large category title size (Residential, Commercial, Solid wood) */
const CATEGORY_TITLE_SIZE_DESKTOP = "clamp(2.75rem, 10vw, 8rem)";
const CATEGORY_TITLE_SIZE_MOBILE = "clamp(1.65rem, 7.5vw, 2.75rem)";
const CATEGORY_BG = ["#f5f0e8", "#8a8278", "#c77a54"] as const;

type FlatSphere = Sphere & { categoryIndex: number; sphereInCategory: number };

/** 3 spheres per category → 9 bubbles flow through the carousel. */
const SPHERES_PER_CATEGORY = 3;
const GRID_SPHERES: FlatSphere[] = CATEGORIES.flatMap((cat, ci) =>
  cat.spheres.slice(0, SPHERES_PER_CATEGORY).map((s, si) => ({
    ...s,
    categoryIndex: ci,
    sphereInCategory: si,
  })),
);

// ─── Scroll config ───────────────────────────────────────────────────────────

const SCROLL_VH = 1550;
/** Viewport-heights of scroll before hero handoff begins — 0 = animate on first scroll */
const HANDOFF_HOLD_VH = 0;
/** Viewport-heights over which slide-up + Build/Design meet + statement reveal run */
const HANDOFF_DURATION_VH = 2.8;
/** Space between line end and “Design” (em). Increase for more gap before Design. */
const TAGLINE_LINE_DESIGN_GAP_EM = 0.2;
const SCROLLABLE_VH = SCROLL_VH - 100;
/** Legacy p thresholds for ticker / bubbles (after handoff) */
const HANDOFF_END_P = (HANDOFF_HOLD_VH + HANDOFF_DURATION_VH) * 100 / SCROLLABLE_VH;
/** Ticker holds at top before fading (Reaktor Webflow timing) */
const TICKER_HOLD_END_P = HANDOFF_END_P + 0.07;
const TICKER_EXIT_END_P = HANDOFF_END_P + 0.24;
const TICKER_FADE_END_P =
  TICKER_HOLD_END_P + (TICKER_EXIT_END_P - TICKER_HOLD_END_P) * 0.62;

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

/** Smoother quintic ease — used for Build/Design merge */
function easeInOutQuint(t: number) {
  const c = clamp(t);
  return c < 0.5
    ? 16 * c * c * c * c * c
    : 1 - Math.pow(-2 * c + 2, 5) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function track(p: number, a: number, b: number) {
  return smoothstep(clamp((p - a) / (b - a)));
}

function trackEase(
  p: number,
  a: number,
  b: number,
  ease: (t: number) => number = smoothstep,
) {
  return ease(clamp((p - a) / (b - a)));
}

// ─── Horizontal bubble carousel (Reaktor: right → left conveyor) ─────────────

type FlowFrame = { s: number; x: number; y: number; size: number; op: number };

/** Focal point where the active bubble peaks large (Reaktor video). */
const FLOW_FOCAL_SIZE_VH = 54;

type FlowConfig = {
  focalX: number;
  focalY: number;
  focalSizeVh: number;
  sizeScale: number;
};

const FLOW_CONFIGS: Record<"sm" | "md" | "lg", FlowConfig> = {
  sm: { focalX: 68, focalY: 34, focalSizeVh: 36, sizeScale: 0.72 },
  md: { focalX: 72, focalY: 40, focalSizeVh: 46, sizeScale: 0.86 },
  lg: { focalX: 75, focalY: 44, focalSizeVh: FLOW_FOCAL_SIZE_VH, sizeScale: 1 },
};

function getViewportTier(width: number): "sm" | "md" | "lg" {
  if (width < 640) return "sm";
  if (width < 1024) return "md";
  return "lg";
}

function buildFlowFrames(config: FlowConfig): FlowFrame[] {
  const { focalX, focalY, focalSizeVh, sizeScale } = config;
  return [
    { s: -1.85, x: 126, y: 88, size: 6 * sizeScale, op: 0 },
    { s: -1.0, x: 104, y: 76, size: 16 * sizeScale, op: 0.55 },
    { s: -0.45, x: 92, y: 58, size: 30 * sizeScale, op: 0.9 },
    { s: 0.0, x: focalX, y: focalY, size: focalSizeVh, op: 1 },
    { s: 0.6, x: 50, y: 48, size: 26 * sizeScale, op: 0.85 },
    { s: 1.15, x: 33, y: 54, size: 14 * sizeScale, op: 0.7 },
    { s: 1.9, x: 8, y: 62, size: 6 * sizeScale, op: 0 },
  ];
}

/** Slight per-bubble vertical lane so multiple bubbles don't sit on one line. */
function flowLaneOffset(index: number): number {
  const lanes = [-2.5, 0, 2.5, -1.5, 1.5, -2, 2, -1, 1];
  return lanes[index % lanes.length] ?? 0;
}

function flowState(stage: number, frames: FlowFrame[], index = 0) {
  const last = frames.length - 1;
  let a = frames[0];
  let b = frames[last];

  if (stage <= frames[0].s) {
    a = b = frames[0];
  } else if (stage >= frames[last].s) {
    a = b = frames[last];
  } else {
    for (let i = 0; i < last; i++) {
      if (stage >= frames[i].s && stage <= frames[i + 1].s) {
        a = frames[i];
        b = frames[i + 1];
        break;
      }
    }
  }

  const span = b.s - a.s;
  const t = span <= 0 ? 0 : smoothstep((stage - a.s) / span);
  const sizeVh = lerp(a.size, b.size, t);

  const focalCloseness = 1 - smoothstep(clamp(Math.abs(stage) / 0.9));
  const textT = 1 - smoothstep(clamp(Math.abs(stage) / 0.4));
  const laneY = flowLaneOffset(index);

  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t) + laneY,
    sizeVh,
    opacity: lerp(a.op, b.op, t),
    imgScale: lerp(1.14, 1, focalCloseness),
    text: textT,
    textY: lerp(14, 0, textT),
    z: Math.round(40 + sizeVh),
  };
}

// Marquee pills mirror the Studio Reaktor reference categories
const PILL_PREVIEW_IMAGES = Object.fromEntries(
  CATEGORIES.map((cat) => [
    cat.label,
    cat.spheres.slice(0, SPHERES_PER_CATEGORY).map((s) => s.image),
  ]),
) as Record<string, string[]>;

const MARQUEE_PILLS = [
  {
    label: "Commercial",
    count: 16,
    images: PILL_PREVIEW_IMAGES.Commercial,
  },
  {
    label: "Development",
    count: 16,
    images: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    ],
  },
  {
    label: "Residential",
    count: 16,
    images: PILL_PREVIEW_IMAGES.Residential,
  },
  {
    label: "Solid wood",
    count: 16,
    images: PILL_PREVIEW_IMAGES["Solid wood"],
  },
];

const MARQUEE_ROW1 = MARQUEE_PILLS;
const MARQUEE_ROW2 = [...MARQUEE_PILLS].reverse();
const MARQUEE_TICKER_ROW1 = [...MARQUEE_ROW1, ...MARQUEE_ROW1];
const MARQUEE_TICKER_ROW2 = [...MARQUEE_ROW2, ...MARQUEE_ROW2];
const PILL_PREVIEW_INTERVAL_MS = 400;

function useViewportFlowConfig() {
  const [tier, setTier] = useState<"sm" | "md" | "lg">("lg");

  useEffect(() => {
    const update = () => setTier(getViewportTier(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    tier,
    config: FLOW_CONFIGS[tier],
    frames: buildFlowFrames(FLOW_CONFIGS[tier]),
    categoryTitleSize:
      tier === "sm" ? CATEGORY_TITLE_SIZE_MOBILE : CATEGORY_TITLE_SIZE_DESKTOP,
  };
}

function CategoryPill({
  label,
  count,
  active,
  images,
  previewEnabled,
}: {
  label: string;
  count: number;
  active?: boolean;
  images?: string[];
  previewEnabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewImages = images?.slice(0, 3) ?? [];

  useEffect(() => {
    if (!hovered || !previewEnabled || previewImages.length <= 1) return;

    const timer = window.setInterval(() => {
      setPreviewIndex((i) => (i + 1) % previewImages.length);
    }, PILL_PREVIEW_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [hovered, previewEnabled, previewImages.length]);

  useEffect(() => {
    if (!hovered) setPreviewIndex(0);
  }, [hovered]);

  return (
    <span
      className={`group relative inline-flex shrink-0 cursor-pointer items-baseline rounded-full border-2 px-5 py-2 font-sans text-[1.125rem] font-bold leading-none transition-colors duration-200 sm:px-7 sm:py-2.5 sm:text-[1.5rem] md:px-12 md:py-[1.125rem] md:text-[2.25rem] ${
        active
          ? "border-showcase-active text-showcase-active"
          : "border-showcase-border text-showcase-text"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {label}
      <sup className="relative -top-[0.45em] ml-0.5 text-[0.42em] font-bold">
        ({count})
      </sup>
      {previewImages.length > 0 && previewEnabled && (
        <span
          className={`pointer-events-none absolute left-1/2 top-1/2 z-30 aspect-square w-[min(11vw,6.75rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-[0_24px_48px_-18px_rgba(26,24,20,0.45)] transition-all duration-300 ease-out ${
            hovered ? "scale-[0.72] opacity-100" : "scale-[0.35] opacity-0"
          }`}
        >
          {previewImages.map((src, i) => (
            <img
              key={`${label}-${src}-${i}`}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-out"
              style={{ opacity: i === previewIndex ? 1 : 0 }}
              draggable={false}
              loading="lazy"
            />
          ))}
        </span>
      )}
    </span>
  );
}

function useHeroAutoSlide(handoffT: number) {
  const active = handoffT < 0.98;

  const [slideIndex, setSlideIndex] = useState(0);
  const [transitionT, setTransitionT] = useState(0);

  useEffect(() => {
    if (!active) return;

    let holdTimer = 0;
    let raf = 0;

    const advance = () => {
      const start = performance.now();

      const animate = (now: number) => {
        const t = clamp((now - start) / HERO_TRANSITION_MS);
        setTransitionT(smoothstep(t));

        if (t < 1) {
          raf = requestAnimationFrame(animate);
        } else {
          setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
          setTransitionT(0);
          holdTimer = window.setTimeout(advance, HERO_HOLD_MS);
        }
      };

      raf = requestAnimationFrame(animate);
    };

    holdTimer = window.setTimeout(advance, HERO_HOLD_MS);

    return () => {
      window.clearTimeout(holdTimer);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  const activeSlide =
    transitionT > 0.5 ? (slideIndex + 1) % HERO_SLIDES.length : slideIndex;

  return { slideIndex, transitionT, activeSlide };
}

export function HomeScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const taglineTrackRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLSpanElement>(null);
  const { tier, frames: flowFrames, categoryTitleSize } = useViewportFlowConfig();
  const [p, setP] = useState(0);
  const [handoffT, setHandoffT] = useState(0);
  const [taglineMetrics, setTaglineMetrics] = useState({
    trackWidth: 0,
    designWidth: 0,
    gapPx: 0,
  });

  const measureTagline = useCallback(() => {
    const track = taglineTrackRef.current;
    const design = designRef.current;
    if (!track || !design) return;
    const fontSize = Number.parseFloat(window.getComputedStyle(design).fontSize);
    setTaglineMetrics({
      trackWidth: track.offsetWidth,
      designWidth: design.offsetWidth,
      gapPx: TAGLINE_LINE_DESIGN_GAP_EM * fontSize,
    });
  }, []);

  useEffect(() => {
    CATEGORIES.forEach((category) => {
      category.spheres.forEach((sphere) => {
        const img = new window.Image();
        img.src = sphere.image;
      });
    });
  }, []);

  useLayoutEffect(() => {
    measureTagline();
    window.addEventListener("resize", measureTagline);

    const track = taglineTrackRef.current;
    const observer =
      track && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measureTagline)
        : null;
    if (track && observer) observer.observe(track);
    if (designRef.current && observer) observer.observe(designRef.current);

    return () => {
      window.removeEventListener("resize", measureTagline);
      observer?.disconnect();
    };
  }, [measureTagline]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const scrollable = container.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const vh = window.innerHeight;

        if (scrollable <= 0) {
          setP(0);
          setHandoffT(0);
          return;
        }

        setP(clamp(scrolled / scrollable));
        setHandoffT(
          clamp((scrolled - HANDOFF_HOLD_VH * vh) / (HANDOFF_DURATION_VH * vh)),
        );
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

  const {
    slideIndex: heroSlideIndex,
    transitionT: heroTransitionT,
    activeSlide: activeHeroSlide,
  } = useHeroAutoSlide(handoffT);

  // ── Hero handoff: shrink into rounded card + slide up (Reaktor) ──
  const shrinkT = trackEase(handoffT, 0, 0.7, easeInOutQuint);
  const heroInsetVw = lerp(0, 3.25, shrinkT);
  const heroInsetVh = lerp(0, 2.4, shrinkT);
  const heroRadius = lerp(0, 32, shrinkT);
  const heroSlideY = lerp(0, -102, handoffT);
  const heroShadow =
    shrinkT > 0.01
      ? `0 ${lerp(4, 18, shrinkT)}px ${lerp(20, 56, shrinkT)}px -${lerp(6, 14, shrinkT)}px rgba(26,24,20,${lerp(0.08, 0.22, shrinkT)})`
      : "none";
  const heroVisible = handoffT < 1 || heroSlideY > -99.5;
  const showcaseOpacity = clamp(
    Math.max(handoffT, track(p, HANDOFF_END_P - 0.04, HANDOFF_END_P + 0.06)),
  );

  // ── Ticker: rises with hero → holds at top → fades then exits (Reaktor) ──
  const tickerFadeT = track(p, TICKER_HOLD_END_P, TICKER_FADE_END_P);
  const tickerExitT = track(p, TICKER_FADE_END_P, TICKER_EXIT_END_P);
  const marqueeTopPct =
    handoffT < 1
      ? lerp(108, 18, handoffT)
      : p < TICKER_FADE_END_P
        ? 18
        : lerp(18, -10, tickerExitT);
  const marqueeOpacity =
    handoffT <= 0
      ? 0
      : handoffT < 1
        ? clamp(handoffT * 1.2)
        : p < TICKER_HOLD_END_P
          ? 1
          : 1 - tickerFadeT;
  const tickerAnimating = marqueeOpacity > 0.12 && p < TICKER_EXIT_END_P;

  // ── Category title appears as ticker rises (Reaktor: y ≈ 80vh) ──
  const titleReveal = track(p, HANDOFF_END_P - 0.05, TICKER_FADE_END_P);
  const titleSlideY = lerp(40, 0, titleReveal);

  // ── Bubble carousel: right → left conveyor (Reaktor video) ──
  const bubblesStartP = TICKER_FADE_END_P - 0.05;
  const bubblesVisible = track(p, bubblesStartP, TICKER_FADE_END_P + 0.08);
  const bubbleFlowEndP = 0.992;
  // sphereProgress advances the conveyor: -1.3 (first entering right)
  //   → N-0.4 (last exiting left). Each integer value = that bubble at focal.
  const sphereProgress = lerp(
    -1.3,
    GRID_SPHERES.length - 0.4,
    track(p, bubblesStartP, bubbleFlowEndP),
  );

  const activeSphere = clamp(
    Math.round(sphereProgress),
    0,
    GRID_SPHERES.length - 1,
  );
  const activeCategory = GRID_SPHERES[activeSphere].categoryIndex;
  const showcaseBg =
    bubblesVisible > 0.05 ? CATEGORY_BG[activeCategory] : CATEGORY_BG[0];

  const headlineOpacity = lerp(1, 0, track(handoffT, 0.08, 0.72));
  const taglineOpacity = lerp(1, 0, track(handoffT, 0.88, 1));

  // Line anchored after Build; Design moves left and consumes the line from the right
  const meetT = handoffT;
  const taglineScale = lerp(1, 1.28, meetT);
  const taglineSize =
    tier === "sm"
      ? "clamp(1.05rem,4.2vw,1.35rem)"
      : "clamp(1.35rem,3.2vw,2rem)";
  const taglineFontSize = `calc(${taglineSize} * ${taglineScale})`;
  const maxLineWidth = Math.max(
    0,
    taglineMetrics.trackWidth - taglineMetrics.designWidth - taglineMetrics.gapPx,
  );
  const lineWidthPx = (1 - meetT) * maxLineWidth;
  const designLeftPx = (1 - meetT) * (maxLineWidth + taglineMetrics.gapPx);
  const taglineLift = lerp(0, 8, meetT);

  const handoffActive = handoffT > 0.001;

  return (
    <div
      id="home-scroll"
      ref={containerRef}
      className="relative bg-cream"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div
        className={`home-sticky-viewport sticky top-0 overflow-x-hidden ${
          handoffActive || bubblesVisible > 0.02
            ? "overflow-y-visible"
            : "overflow-y-clip"
        }`}
        style={{
          backgroundColor: showcaseBg,
          transition: "background-color 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* ── Showcase layer (behind hero — ticker rises as hero slides up) ── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: showcaseBg,
            opacity: showcaseOpacity,
            pointerEvents: showcaseOpacity > 0.05 ? "auto" : "none",
            zIndex: 10,
            transition: "background-color 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Ticker — rises from bottom, holds, scrolls, fades (Reaktor Webflow) */}
          <div
            id="home-ticker"
            className="absolute inset-x-0 z-30 py-4 sm:py-6 md:py-8"
            style={{
              top: `${marqueeTopPct}%`,
              opacity: marqueeOpacity,
              transform: "translateY(-50%)",
              pointerEvents: marqueeOpacity > 0.05 ? "auto" : "none",
            }}
          >
            <div className="overflow-hidden">
              <div
                className="ticker-track flex w-max gap-4 sm:gap-6 md:gap-8"
                style={{
                  animationPlayState: tickerAnimating ? "running" : "paused",
                }}
              >
                {MARQUEE_TICKER_ROW1.map((pill, i) => (
                  <CategoryPill
                    key={`r1-${pill.label}-${i}`}
                    label={pill.label}
                    count={pill.count}
                    images={pill.images}
                    previewEnabled={marqueeOpacity > 0.35}
                    active={
                      titleReveal > 0.35 &&
                      pill.label === CATEGORIES[activeCategory].label
                    }
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 overflow-hidden sm:mt-5 md:mt-6">
              <div
                className="ticker-track-reverse flex w-max gap-4 pl-[3.5rem] sm:gap-6 sm:pl-[7rem] md:gap-8 md:pl-[11rem]"
                style={{
                  animationPlayState: tickerAnimating ? "running" : "paused",
                }}
              >
                {MARQUEE_TICKER_ROW2.map((pill, i) => (
                  <CategoryPill
                    key={`r2-${pill.label}-${i}`}
                    label={pill.label}
                    count={pill.count}
                    images={pill.images}
                    previewEnabled={marqueeOpacity > 0.35}
                    active={
                      titleReveal > 0.35 &&
                      pill.label === CATEGORIES[activeCategory].label
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Large category title — behind bubbles (Reaktor z-order) */}
          <div
            className="pointer-events-none absolute bottom-[17%] left-4 z-[15] max-w-[calc(100vw-2rem)] sm:bottom-[11%] sm:left-6 lg:bottom-[12%] lg:left-12"
            style={{
              opacity: titleReveal,
              transform: `translateY(${titleSlideY}px)`,
            }}
          >
            <div
              className="relative grid overflow-hidden"
              style={{ height: categoryTitleSize }}
            >
              {CATEGORIES.map((cat, i) => {
                const isActive = i === activeCategory;
                return (
                  <h2
                    key={cat.label}
                    className="home-category-title col-start-1 row-start-1 self-end whitespace-nowrap font-category font-medium leading-none tracking-tight text-showcase-title"
                    style={{
                      fontSize: categoryTitleSize,
                      opacity: isActive ? 1 : 0,
                      transform: `translateY(${isActive ? 0 : 48}px)`,
                      transition:
                        "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    {cat.label}
                  </h2>
                );
              })}
            </div>
          </div>

          {/* Decorative background orbit rings (Reaktor) */}
          {bubblesVisible > 0.02 && (
            <div
              className="pointer-events-none absolute inset-0 z-[12]"
              style={{ opacity: bubblesVisible }}
              aria-hidden="true"
            >
              <div className="absolute left-[68%] top-[38%] aspect-square w-[78vh] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sphere-outline/90 sm:left-[72%] sm:top-[40%] lg:left-[75%] lg:top-[44%] home-orbit-ring" />
              <div className="absolute left-[68%] top-[38%] aspect-square w-[122vh] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sphere-outline/70 sm:left-[72%] sm:top-[40%] lg:left-[75%] lg:top-[44%] home-orbit-ring home-orbit-ring--outer" />
            </div>
          )}

          {/* Bubble carousel — each project flows right → left, peaks at focal */}
          {bubblesVisible > 0.01 && (
            <div
              className="absolute inset-0 z-20"
              style={{ overflow: "visible", pointerEvents: "none" }}
            >
              {GRID_SPHERES.map((sphere, i) => {
                const flow = flowState(sphereProgress - i, flowFrames, i);
                if (flow.opacity <= 0.01) return null;

                return (
                  <div
                    key={`${sphere.title}-${i}`}
                    className="absolute origin-center will-change-[left,top,width,height,opacity]"
                    style={{
                      left: `${flow.x}%`,
                      top: `${flow.y}%`,
                      width: `${flow.sizeVh}vh`,
                      height: `${flow.sizeVh}vh`,
                      opacity: flow.opacity * bubblesVisible,
                      transform: "translate(-50%, -50%)",
                      zIndex: flow.z,
                    }}
                  >
                    <div className="relative h-full w-full">
                      <div
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-sphere-outline"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-[3px] overflow-hidden rounded-full">
                        <img
                          src={sphere.image}
                          alt={sphere.title}
                          className="h-full w-full origin-center object-cover will-change-transform"
                          style={{ transform: `scale(${flow.imgScale})` }}
                          draggable={false}
                          loading={i < SPHERES_PER_CATEGORY ? "eager" : "lazy"}
                          decoding="async"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/15 to-transparent"
                          style={{ opacity: flow.text }}
                        />
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center px-[10%] text-center will-change-[opacity,transform]"
                          style={{
                            opacity: flow.text,
                            transform: `translateY(${flow.textY}px)`,
                          }}
                        >
                          <h3 className="font-sans text-[clamp(0.65rem,1.5vw,1.6rem)] font-medium leading-tight text-white sm:text-[clamp(0.7rem,1.7vw,1.6rem)]">
                            {sphere.title}
                          </h3>
                          <p className="mx-auto mt-1 max-w-[80%] font-sans text-[clamp(0.45rem,0.85vw,1rem)] font-normal leading-snug text-white/85 sm:mt-1.5 sm:text-[clamp(0.5rem,0.95vw,1rem)]">
                            {sphere.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Hero layer — shrinks with rounded edges, then slides up ── */}
        <div
          className="absolute overflow-hidden will-change-[transform,border-radius]"
          style={{
            top: `${heroInsetVh}vh`,
            left: `${heroInsetVw}vw`,
            right: `${heroInsetVw}vw`,
            height: `calc(100vh - ${heroInsetVh * 2}vh)`,
            transform: `translate3d(0, ${heroSlideY}vh, 0)`,
            opacity: heroVisible ? 1 : 0,
            pointerEvents: heroVisible ? "auto" : "none",
            zIndex: 30,
            borderRadius: `${heroRadius}px`,
            boxShadow: heroShadow,
          }}
        >
          <HeroBlindTransition
            slides={HERO_SLIDES}
            slideIndex={heroSlideIndex}
            transitionT={heroTransitionT}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/25" />

          <div
            className="absolute left-4 top-[50%] z-10 max-w-[calc(100vw-2rem)] sm:left-6 sm:top-[56%] sm:max-w-3xl lg:left-12 lg:top-[58%]"
            style={{ opacity: headlineOpacity }}
          >
            <div className="relative grid">
              {HERO_SLIDES.map((slide, i) => {
                const isActive = i === activeHeroSlide;
                return (
                  <h1
                    key={slide.name}
                    className="heading-display col-start-1 row-start-1 text-[clamp(2rem,7vw,5.5rem)] leading-[1.05] text-cream transition-[opacity,transform] duration-500 ease-out sm:text-[clamp(2.5rem,6vw,5.5rem)]"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(18px)",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    {slide.headline}
                  </h1>
                );
              })}
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-[13%] z-10 px-4 sm:bottom-[10%] sm:px-[8%] lg:bottom-[11%]"
            style={{
              opacity: taglineOpacity,
              transform: `translateY(-${taglineLift}px)`,
            }}
          >
            <div className="relative flex w-full items-center">
              <span
                className="relative z-[3] shrink-0 font-serif font-light tracking-wide text-cream will-change-transform"
                style={{ fontSize: taglineFontSize }}
              >
                Build
              </span>

              <div
                ref={taglineTrackRef}
                className="relative mx-[0.35em] min-w-0 flex-1"
              >
                <div className="relative min-h-[1.2em] w-full">
                  <div
                    className="absolute left-0 top-1/2 z-[1] h-px -translate-y-1/2 bg-cream/45 will-change-[width]"
                    style={{ width: `${lineWidthPx}px` }}
                    aria-hidden="true"
                  />
                  <span
                    ref={designRef}
                    className="absolute top-1/2 z-[2] -translate-y-1/2 whitespace-nowrap font-serif font-light tracking-wide text-design will-change-[left]"
                    style={{
                      fontSize: taglineFontSize,
                      left: `${designLeftPx}px`,
                    }}
                  >
                    Design
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
