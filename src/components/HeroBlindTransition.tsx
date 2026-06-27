"use client";

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type HeroBlindTransitionProps = {
  slides: { image: string; name: string }[];
  slideIndex: number;
  transitionT: number;
  /** Lock the current frame during scroll handoff. */
  frozen?: boolean;
};

/**
 * Auto-advance hero pictures — depth parallax crossfade (zoom + vertical drift).
 */
export function HeroBlindTransition({
  slides,
  slideIndex,
  transitionT,
  frozen = false,
}: HeroBlindTransitionProps) {
  const maxIndex = slides.length - 1;
  const fromIdx = clamp(slideIndex, 0, maxIndex);
  const toIdx = (fromIdx + 1) % slides.length;
  const fromImage = slides[fromIdx].image;
  const toImage = slides[toIdx].image;
  const t = frozen ? 0 : clamp(transitionT);
  const isTransitioning = !frozen && t > 0.001 && fromImage !== toImage;

  if (!isTransitioning) {
    return (
      <img
        src={fromImage}
        alt={slides[fromIdx].name}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
    );
  }

  // Outgoing — recedes: fades, zooms out, drifts upward
  const outOpacity = 1 - t;
  const outScale = lerp(1, 1.14, t);
  const outY = lerp(0, -6, t);

  // Incoming — advances: fades in, settles from zoom, rises into frame
  const inOpacity = t;
  const inScale = lerp(1.16, 1, t);
  const inY = lerp(5, 0, t);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <img
        src={fromImage}
        alt=""
        className="absolute inset-0 h-full w-full origin-center object-cover will-change-transform"
        style={{
          opacity: outOpacity,
          transform: `translate3d(0, ${outY}%, 0) scale(${outScale})`,
          filter: `brightness(${lerp(1, 0.7, t)})`,
          zIndex: 1,
        }}
        draggable={false}
      />
      <img
        src={toImage}
        alt={slides[toIdx].name}
        className="absolute inset-0 h-full w-full origin-center object-cover will-change-transform"
        style={{
          opacity: inOpacity,
          transform: `translate3d(0, ${inY}%, 0) scale(${inScale})`,
          zIndex: 2,
        }}
        draggable={false}
      />
    </div>
  );
}
