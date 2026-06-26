"use client";

import { motion } from "framer-motion";

type ScrollAdvanceControlProps = {
  hint: string;
  onAdvance: () => void;
  opacity?: number;
  variant?: "light" | "dark" | "muted";
  className?: string;
  ariaLabel?: string;
};

export function ScrollAdvanceControl({
  hint,
  onAdvance,
  opacity = 1,
  variant = "dark",
  className = "",
  ariaLabel,
}: ScrollAdvanceControlProps) {
  const isLight = variant === "light";
  const isMuted = variant === "muted";

  const hintClass = isMuted
    ? "text-cream/50 group-hover:text-cream/65"
    : isLight
      ? "text-cream/85 group-hover:text-cream"
      : "text-charcoal group-hover:text-charcoal/70";

  const iconClass = isMuted
    ? "text-cream/45 group-hover:text-cream/60"
    : isLight
      ? "text-cream/70 group-hover:text-cream"
      : "text-accent group-hover:text-accent-dark";

  const lineTrackClass = isMuted
    ? "bg-cream/20"
    : isLight
      ? "bg-cream/25"
      : "bg-accent/25";

  const lineFillClass = isMuted
    ? "bg-cream/50"
    : isLight
      ? "bg-cream/70"
      : "bg-accent/80";

  return (
    <div
      className={`transition-opacity duration-500 ${className}`}
      style={{
        opacity,
        pointerEvents: opacity > 0.05 ? "auto" : "none",
      }}
    >
      <button
        type="button"
        onClick={onAdvance}
        aria-label={ariaLabel ?? `${hint}. Advance to the next section.`}
        className="group mx-auto flex flex-col items-center gap-2.5"
      >
        <span
          className={`text-xs font-bold tracking-[0.28em] uppercase transition-colors ${hintClass}`}
        >
          {hint}
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
            className={`transition-colors ${iconClass}`}
          >
            <path
              d="M1 1.5 7 6.5 13 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className={`h-10 w-px ${lineTrackClass}`}>
            <div className={`scroll-indicator-line h-full w-full ${lineFillClass}`} />
          </div>
        </motion.span>
      </button>
    </div>
  );
}
