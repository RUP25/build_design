"use client";

/** Vertical column count — matches Reaktor hero blind transition (~20 strips). */
const STRIP_COUNT = 20;
/** How much of the 0→1 progress window is used for left-to-right stagger. */
const STAGGER_SPAN = 0.82;

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number) {
  const c = clamp(t);
  return c * c * (3 - 2 * c);
}

function StripColumn({
  index,
  fromImage,
  toImage,
  progress,
}: {
  index: number;
  fromImage: string;
  toImage: string;
  progress: number;
}) {
  const delay = (index / Math.max(1, STRIP_COUNT - 1)) * STAGGER_SPAN;
  const localT = smoothstep((progress - delay) / Math.max(0.01, 1 - STAGGER_SPAN));

  const sliceStyle = {
    width: `${STRIP_COUNT * 100}%`,
    left: `${-index * 100}%`,
  } as const;

  return (
    <div
      className="relative h-full shrink-0 overflow-hidden"
      style={{ width: `${100 / STRIP_COUNT}%` }}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${-localT * 100}%, 0)` }}
      >
        <img
          src={fromImage}
          alt=""
          className="absolute top-0 h-full max-w-none object-cover"
          style={sliceStyle}
          draggable={false}
        />
      </div>
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${(1 - localT) * 100}%, 0)` }}
      >
        <img
          src={toImage}
          alt=""
          className="absolute top-0 h-full max-w-none object-cover"
          style={sliceStyle}
          draggable={false}
        />
      </div>
    </div>
  );
}

type HeroBlindTransitionProps = {
  slides: { image: string; name: string }[];
  slideIndex: number;
  transitionT: number;
};

export function HeroBlindTransition({
  slides,
  slideIndex,
  transitionT,
}: HeroBlindTransitionProps) {
  const maxIndex = slides.length - 1;
  const fromIdx = clamp(slideIndex, 0, maxIndex);
  const toIdx = (fromIdx + 1) % slides.length;
  const fromImage = slides[fromIdx].image;
  const toImage = slides[toIdx].image;
  const isTransitioning = transitionT > 0.001 && fromImage !== toImage;

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

  return (
    <div className="absolute inset-0 flex" aria-hidden="true">
      {Array.from({ length: STRIP_COUNT }, (_, i) => (
        <StripColumn
          key={i}
          index={i}
          fromImage={fromImage}
          toImage={toImage}
          progress={transitionT}
        />
      ))}
    </div>
  );
}
