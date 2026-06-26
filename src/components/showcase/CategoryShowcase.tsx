"use client";

import { useEffect, useRef, useState } from "react";

type Sphere = {
  title: string;
  subtitle: string;
  image: string;
};

type Category = {
  label: string;
  spheres: Sphere[];
};

// Categories cycle one after another, Studio Reaktor style.
const CATEGORIES: Category[] = [
  {
    label: "Approach",
    spheres: [
      {
        title: "Consistent quality across all stages",
        subtitle: "Every layer held to one standard, start to finish",
        image:
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
      },
      {
        title: "Strict adherence to timelines",
        subtitle: "Disciplined delivery, milestones honoured",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80",
      },
      {
        title: "Seamless coordination across disciplines",
        subtitle: "One accountable team across every trade",
        image:
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
      },
      {
        title: "Zero dependency on fragmented vendors",
        subtitle: "Complete control, no broken hand-offs",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
      },
    ],
  },
  {
    label: "Partnership",
    spheres: [
      {
        title: "High-end material procurement",
        subtitle: "Direct sourcing of premium, bespoke finishes",
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
      },
      {
        title: "Advanced construction technologies",
        subtitle: "Modern systems engineered for precision",
        image:
          "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80",
      },
      {
        title: "Integration of global standards into local execution",
        subtitle: "World-class benchmarks, delivered on the ground",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      },
    ],
  },
  {
    label: "Advantages",
    spheres: [
      {
        title: "Single-point ownership of high-value projects",
        subtitle: "One accountable team, complete responsibility",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
      },
      {
        title: "Access to premium materials, global sourcing & technologies",
        subtitle: "Imported finishes and specialised systems on demand",
        image:
          "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80",
      },
      {
        title: "Authorized partnerships with leading brands",
        subtitle: "Trusted, certified relationships across the industry",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
      },
    ],
  },
];

const ENTER_VH = 45;
const PER_SPHERE_VH = 95;

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Keyframes by "stage" (sphere index minus global progress).
// stage 0 = active/centre, -1 = parked top-left (small), +1 = entering bottom-right.
type Frame = { x: number; y: number; size: number; op: number; text: number };

const FRAMES: Record<number, Frame> = {
  [-2]: { x: 4, y: 6, size: 7, op: 0, text: 0 },
  [-1]: { x: 27, y: 26, size: 17, op: 0.62, text: 0 },
  [0]: { x: 62, y: 50, size: 46, op: 1, text: 1 },
  [1]: { x: 95, y: 78, size: 14, op: 0.5, text: 0 },
  [2]: { x: 116, y: 96, size: 7, op: 0, text: 0 },
};

function frameAt(stage: number): Frame {
  const f = Math.max(-2, Math.min(1, Math.floor(stage)));
  const a = FRAMES[f];
  const b = FRAMES[f + 1];
  const t = smoothstep(stage - f);
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    size: lerp(a.size, b.size, t),
    op: lerp(a.op, b.op, t),
    text: lerp(a.text, b.text, t),
  };
}

type FlatSphere = Sphere & { categoryIndex: number };

const FLAT: FlatSphere[] = CATEGORIES.flatMap((cat, ci) =>
  cat.spheres.map((s) => ({ ...s, categoryIndex: ci })),
);

export function CategoryShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enter, setEnter] = useState(0);
  const [progress, setProgress] = useState(0);

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

        const scrolled = Math.max(0, -rect.top);
        const enterPx = (ENTER_VH / 100) * window.innerHeight;
        setEnter(smoothstep(Math.min(1, scrolled / Math.max(1, enterPx))));

        const after = Math.max(0, scrolled - enterPx);
        const span = Math.max(1, scrollable - enterPx);
        const seg = span / Math.max(1, FLAT.length - 1);
        setProgress(Math.max(0, Math.min(FLAT.length - 1, after / seg)));
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

  const activeIndex = Math.min(FLAT.length - 1, Math.round(progress));
  const activeCategory = FLAT[activeIndex].categoryIndex;
  const clusterY = lerp(120, 0, enter);

  const scrollHeight = `${ENTER_VH + FLAT.length * PER_SPHERE_VH}vh`;

  return (
    <div
      ref={containerRef}
      className="relative bg-cream"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Decorative faint rings */}
        <div
          className="pointer-events-none absolute right-[-10%] top-1/2 aspect-square w-[70vw] -translate-y-1/2 rounded-full border border-charcoal/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[8%] top-1/2 aspect-square w-[42vw] -translate-y-1/2 rounded-full border border-charcoal/10"
          aria-hidden="true"
        />

        {/* Category title (bottom-left) */}
        <div className="absolute bottom-[8%] left-6 z-20 lg:left-12">
          <p
            className="mb-3 text-[11px] tracking-[0.35em] text-warm-gray uppercase"
            style={{ opacity: enter }}
          >
            Selected Work
          </p>
          <div className="relative h-[clamp(3.2rem,11vw,9rem)] overflow-hidden">
            {CATEGORIES.map((cat, i) => {
              const isActive = i === activeCategory;
              return (
                <h2
                  key={cat.label}
                  className="heading-display absolute left-0 top-0 whitespace-nowrap text-[clamp(3rem,10vw,8.5rem)] leading-none tracking-tight text-charcoal"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : 28}px)`,
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

        {/* Sphere stage */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${clusterY}px, 0)`, opacity: enter }}
        >
          {FLAT.map((sphere, i) => {
            const stage = i - progress;
            if (stage < -2 || stage > 1.85) return null;

            const f = frameAt(stage);
            if (f.op <= 0.01) return null;

            return (
              <div
                key={`${sphere.title}-${i}`}
                className="absolute"
                style={{
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${f.size}vh`,
                  maxWidth: "82vw",
                  aspectRatio: "1",
                  opacity: f.op,
                  zIndex: Math.round(f.size),
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-full shadow-[0_30px_60px_-25px_rgba(26,24,20,0.5)]">
                  <img
                    src={sphere.image}
                    alt={sphere.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent"
                    style={{ opacity: f.text }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 px-[8%] pb-[12%] text-center"
                    style={{ opacity: f.text }}
                  >
                    <h3 className="heading-display text-[clamp(1.1rem,2.4vw,2rem)] leading-tight text-cream">
                      {sphere.title}
                    </h3>
                    <p className="mx-auto mt-1 max-w-[80%] text-[clamp(0.6rem,1vw,0.85rem)] leading-snug text-cream/80">
                      {sphere.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div
          className="absolute bottom-[8%] right-6 z-20 flex items-center gap-1.5 lg:right-12"
          style={{ opacity: enter }}
        >
          {FLAT.map((s, i) => (
            <span
              key={`${s.title}-dot-${i}`}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === activeIndex ? "1.75rem" : "0.5rem",
                backgroundColor:
                  i <= activeIndex
                    ? "rgba(196,165,116,0.95)"
                    : "rgba(26,24,20,0.18)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
