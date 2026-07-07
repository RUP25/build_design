"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getAdaptiveImageQuality,
  optimizeUnsplashUrl,
  preloadImage,
} from "@/lib/image-url";

// The final photo is the SAME url as the Hero background, so the framed
// photo "opens up" seamlessly into the main screen.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80";

const introImages = [
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
  HERO_IMAGE,
];

const INTRO_FRAME_WIDTH = 720;
const HERO_REVEAL_WIDTH = 1280;

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
    const quality = getAdaptiveImageQuality(75);

    preloadImage(
      optimizeUnsplashUrl(introImages[0], {
        width: INTRO_FRAME_WIDTH,
        quality,
      }),
    );

    const secondTimer = window.setTimeout(() => {
      preloadImage(
        optimizeUnsplashUrl(introImages[1], {
          width: INTRO_FRAME_WIDTH,
          quality,
        }),
      );
    }, 400);

    const heroTimer = window.setTimeout(() => {
      preloadImage(
        optimizeUnsplashUrl(HERO_IMAGE, {
          width: HERO_REVEAL_WIDTH,
          quality,
        }),
      );
    }, 900);

    return () => {
      window.clearTimeout(secondTimer);
      window.clearTimeout(heroTimer);
    };
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
          <div className="flex flex-col items-center pb-8 sm:pb-10">
            <div className="flex max-w-full items-end gap-2 whitespace-nowrap sm:gap-5 lg:gap-7">
              <motion.span
                layout
                animate={{ opacity: reveal ? 0 : 1 }}
                initial={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="heading-display text-[clamp(2.4rem,9vw,7rem)] leading-none tracking-tight text-build"
              >
                BUILD
              </motion.span>

              <div className="relative w-[clamp(4rem,13vw,9.5rem)] shrink-0">
                <motion.span
                  animate={{ opacity: reveal ? 0 : 1, y: reveal ? -8 : 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.35em] text-warm-gray uppercase sm:mb-4 sm:text-[11px] sm:tracking-[0.4em]"
                >
                  Est. 1979
                </motion.span>

                {/* Framed photo — aligned to the BUILD / DESIGN baseline */}
                {!reveal && shown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.35 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    style={{ borderRadius: 3 }}
                    className="relative h-[clamp(3rem,9vw,6.5rem)] w-full shrink-0 overflow-hidden shadow-[0_18px_40px_-18px_rgba(26,24,20,0.45)]"
                  >
                    {introImages.map((src, i) => (
                      <motion.img
                        key={src}
                        src={optimizeUnsplashUrl(src, {
                          width: INTRO_FRAME_WIDTH,
                        })}
                        alt=""
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "low"}
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
                  className="absolute left-1/2 top-full mt-3 flex -translate-x-1/2 items-center justify-center gap-2 sm:mt-4"
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
                src={optimizeUnsplashUrl(HERO_IMAGE, { width: HERO_REVEAL_WIDTH })}
                alt=""
                decoding="async"
                fetchPriority="high"
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
