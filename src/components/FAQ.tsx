"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/lib/content";
import { FadeIn, SectionHeading, SectionLabel } from "@/components/ui/FadeIn";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-cream-dark/30 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-10 text-center sm:mb-16">
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading>Your Questions, Answered</SectionHeading>
        </FadeIn>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FadeIn key={faq.question} delay={i * 0.05}>
              <div className="border border-charcoal/10 bg-cream">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left sm:gap-4 sm:p-6"
                >
                  <div>
                    <span className="mb-2 block text-xs tracking-[0.2em] text-warm-gray">
                      ( {String(i + 1).padStart(2, "0")} )
                    </span>
                    <h3 className="heading-display text-base text-charcoal sm:text-lg md:text-xl">
                      {faq.question}
                    </h3>
                  </div>
                  <span
                    className={`mt-2 shrink-0 text-xl text-accent transition-transform duration-300 ${
                      openIndex === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm leading-relaxed text-warm-gray sm:px-6 sm:pb-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
