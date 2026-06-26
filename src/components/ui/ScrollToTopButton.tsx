"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type ScrollToTopButtonProps = {
  /** Scroll distance (px) before the button appears. */
  threshold?: number;
};

export function ScrollToTopButton({ threshold = 600 }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed right-6 bottom-[5.75rem] z-50 flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/15 bg-cream text-charcoal shadow-[0_8px_30px_-12px_rgba(26,24,20,0.35)] transition-colors hover:border-accent hover:bg-accent hover:text-charcoal sm:right-8"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 14V4M9 4L4.5 8.5M9 4l4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
