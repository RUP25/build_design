"use client";

import { FadeIn } from "@/components/ui/FadeIn";

// Reaktor-style large statement block (big heading + offset supporting line),
// using Build Design's own brand copy.
export function StatementSection() {
  return (
    <section className="bg-showcase-bg py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeIn>
          <h2 className="max-w-[16ch] font-sans text-[clamp(2.25rem,6.5vw,5.5rem)] font-medium leading-[1.02] tracking-tight text-showcase-title">
            Effortless Execution, Limitless Capability.
          </h2>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="ml-auto mt-10 max-w-xl text-right font-sans text-lg leading-relaxed text-showcase-title/70 md:text-xl lg:mt-12">
            Build Design Projects fuses decades of turnkey expertise with
            disciplined delivery — elevating high-value residential and
            commercial execution to the next level.
          </p>
        </FadeIn>

        <div className="mt-14 h-px w-full bg-showcase-border/40 lg:mt-20" />
      </div>
    </section>
  );
}
