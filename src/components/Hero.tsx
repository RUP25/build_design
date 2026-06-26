"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt="Luxury residential architecture"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="section-label mb-6 text-cream/60"
        >
          Trusted since 1979
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="heading-display mb-6 max-w-4xl text-5xl text-cream md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Private Residences. Landmark Spaces. Delivered End-to-End.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-4 max-w-2xl text-lg font-light leading-relaxed text-cream/80 md:text-xl"
        >
          Build Design Projects is a one-stop turnkey execution partner for
          high-value residential and commercial developments — engineered,
          built, and delivered with absolute precision.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-10 max-w-2xl text-sm leading-relaxed text-cream/60 md:text-base"
        >
          Since 1979, we have executed premium projects by integrating
          construction, engineering systems, global sourcing, and advanced
          lifestyle infrastructure — under one accountable team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#contact"
            className="bg-cream px-8 py-4 text-xs tracking-[0.15em] text-charcoal uppercase transition-all hover:bg-accent"
          >
            Discuss Your Project
          </a>
          <a
            href="/projects"
            className="border border-cream/30 px-8 py-4 text-xs tracking-[0.15em] text-cream uppercase transition-all hover:border-cream hover:bg-cream/10"
          >
            View Selected Work
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.3em] text-cream/50 uppercase">
          Scroll
        </span>
        <div className="h-12 w-px bg-cream/30">
          <div className="scroll-indicator-line h-full w-full bg-cream/70" />
        </div>
      </motion.div>
    </section>
  );
}
