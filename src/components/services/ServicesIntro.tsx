"use client";

import { motion } from "framer-motion";
import { servicePillars } from "@/lib/content";

export function ServicesIntro() {
  return (
    <section className="border-b border-charcoal/10 bg-cream px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label mb-4 sm:mb-6">About us</p>
            <h2 className="heading-display mb-6 text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.05] text-charcoal sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl">
              Inspiring design.
              <br />
              Informed delivery.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-warm-gray sm:text-base md:text-lg">
              We thrive in the space between vision and viability — from
              city-shaping commercial spaces to one-of-a-kind residences. We
              design and deliver buildings that work, endure, and belong.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8">
            {servicePillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-charcoal/10 pt-5 sm:pt-6"
              >
                <h3 className="heading-display mb-2 text-xl text-charcoal sm:mb-3 sm:text-2xl">
                  {pillar.title}
                </h3>
                <p className="text-xs leading-relaxed text-warm-gray sm:text-sm md:text-base">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
