"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// The final photo is the SAME url as the Hero background, so the framed
// photo "opens up" seamlessly into the main screen.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80";

const introImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
  HERO_IMAGE,
];

const INITIAL_DELAY_MS = 750;
const HOLD_MS = 850;
const EASE = [0.22, 1, 0.36, 1] as const;

type IntroSequenceProps = {
  onComplete: () => void;
};

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [shown, setShown] = useState(false);
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    introImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // First just "BUILD DESIGN", then the photo appears between the words.
  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), INITIAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Once the frame is in, cycle through exactly three photos, then open up.
  useEffect(() => {
    if (!shown) return;
    const timers: number[] = [];

    if (index < introImages.length - 1) {
      timers.push(window.setTimeout(() => setIndex((i) => i + 1), HOLD_MS));
    } else {
      timers.push(window.setTimeout(() => setReveal(true), HOLD_MS));
      timers.push(window.setTimeout(() => setVisible(false), HOLD_MS + 950));
    }

    return () => timers.forEach((t) => clearTimeout(t));
  }, [shown, index]);

  const skip = () => {
    setReveal(true);
    setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          onClick={skip}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-cream px-4 sm:px-6"
          aria-hidden="true"
        >
          <div className="flex max-w-full items-center gap-2 whitespace-nowrap sm:gap-5 lg:gap-7">
            <motion.span
              layout
              animate={{ opacity: reveal ? 0 : 1 }}
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="heading-display text-[clamp(2.4rem,9vw,7rem)] leading-none tracking-tight text-build"
            >
              BUILD
            </motion.span>

            <div className="flex w-[clamp(3.4rem,11vw,8.5rem)] shrink-0 flex-col items-center">
              <motion.span
                animate={{ opacity: reveal ? 0 : 1, y: reveal ? -8 : 0 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mb-4 w-full text-center text-[11px] tracking-[0.4em] text-warm-gray uppercase sm:mb-5"
                style={{ paddingLeft: "0.2em" }}
              >
                Est. 1979
              </motion.span>

              {/* Framed photo — appears between the words after the initial beat */}
              {!reveal && shown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.35 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{ borderRadius: 3 }}
                  className="relative h-[clamp(2.4rem,7.5vw,5.8rem)] w-full shrink-0 overflow-hidden shadow-[0_18px_40px_-18px_rgba(26,24,20,0.45)]"
                >
                  {introImages.map((src, i) => (
                    <motion.img
                      key={src}
                      src={src}
                      alt=""
                      initial={false}
                      animate={{ opacity: i === index ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: shown && !reveal ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-6 flex items-center gap-2 sm:mt-8"
              >
                {introImages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === index ? "w-7 bg-charcoal" : "w-3 bg-charcoal/25"
                    }`}
                  />
                ))}
              </motion.div>
            </div>

            <motion.span
              layout
              animate={{ opacity: reveal ? 0 : 1 }}
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="heading-display text-[clamp(2.4rem,9vw,7rem)] leading-none tracking-tight text-design"
            >
              DESIGN
            </motion.span>
          </div>

          {/* The same photo opens up to become the full main screen */}
          {reveal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ borderRadius: 0 }}
              className="absolute inset-0 overflow-hidden"
              transition={{ duration: 0.9, ease: EASE }}
            >
              <img
                src={HERO_IMAGE}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30"
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
