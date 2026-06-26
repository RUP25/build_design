"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { aboutFeatures, aboutSpecialization, stats } from "@/lib/content";
import { AboutModelVisual } from "@/components/about/AboutModelVisual";
import { FadeIn, SectionHeading, SectionLabel } from "@/components/ui/FadeIn";

function StatCard({
  value,
  label,
  className = "",
  variant = "light",
}: {
  value: string;
  label: string;
  className?: string;
  variant?: "light" | "dark" | "accent" | "muted";
}) {
  const styles = {
    light: "bg-cream-dark/70 text-charcoal",
    dark: "bg-charcoal text-cream",
    accent: "bg-accent text-charcoal",
    muted: "bg-charcoal-light text-service-text",
  };

  return (
    <div
      className={`flex min-h-[140px] flex-col justify-between rounded-2xl p-6 sm:min-h-[160px] sm:p-7 lg:rounded-3xl lg:p-8 ${styles[variant]} ${className}`}
    >
      <p className="text-[clamp(2.75rem,6vw,4.5rem)] font-medium leading-none tracking-tight">
        {value}
      </p>
      <p className="max-w-[14rem] text-sm leading-snug opacity-80">{label}</p>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative overflow-x-clip bg-cream py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(30deg, #1a1814 12%, transparent 12.5%, transparent 87%, #1a1814 87.5%, #1a1814), linear-gradient(150deg, #1a1814 12%, transparent 12.5%, transparent 87%, #1a1814 87.5%, #1a1814), linear-gradient(30deg, #1a1814 12%, transparent 12.5%, transparent 87%, #1a1814 87.5%, #1a1814), linear-gradient(150deg, #1a1814 12%, transparent 12.5%, transparent 87%, #1a1814 87.5%, #1a1814)",
          backgroundSize: "80px 140px",
          backgroundPosition: "0 0, 0 0, 40px 70px, 40px 70px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Foundation-style split hero */}
        <div className="grid items-end gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <FadeIn>
            <SectionLabel>About</SectionLabel>
            <SectionHeading className="mb-6 max-w-xl text-balance">
              Effortless Execution, Limitless Capability.
            </SectionHeading>
            <p className="mb-10 max-w-lg text-base leading-relaxed text-warm-gray md:text-lg">
              Build Design Projects fuses decades of turnkey expertise with
              disciplined delivery — elevating high-value residential and
              commercial execution to the next level.
            </p>

            <div className="grid gap-0 sm:grid-cols-2">
              {aboutFeatures.map((feature, i) => (
                <div
                  key={feature.number}
                  className={`border-charcoal/10 py-5 ${
                    i % 2 === 0 ? "sm:pr-6" : "sm:pl-6 sm:border-l"
                  } ${i < 2 ? "border-b sm:border-b" : ""}`}
                >
                  <div className="flex gap-4">
                    <span className="text-xs tracking-[0.2em] text-warm-gray-light">
                      {feature.number}
                    </span>
                    <div>
                      <p className="mb-1 text-sm font-medium text-charcoal">
                        {feature.title}
                      </p>
                      <p className="text-xs leading-relaxed text-warm-gray">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/#contact"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-charcoal px-7 py-3.5 text-xs tracking-[0.15em] text-cream uppercase transition-colors hover:bg-accent hover:text-charcoal"
            >
              Contact Us
              <span aria-hidden="true">↗</span>
            </Link>
          </FadeIn>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full overflow-visible lg:-mr-8 xl:-mr-12"
          >
            <AboutModelVisual />
          </motion.div>
        </div>

        <FadeIn className="mt-20 border-t border-charcoal/10 pt-14 lg:mt-24 lg:pt-20">
          <p className="heading-display mx-auto max-w-5xl text-balance text-[clamp(1.5rem,3.2vw,2.25rem)] leading-snug text-charcoal/85">
            {aboutSpecialization}
          </p>
        </FadeIn>

        {/* Foundation-style bento stats */}
        <FadeIn className="mt-20 lg:mt-28">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-4">
            <StatCard
              value={stats[0].value}
              label={stats[0].label}
              variant="accent"
              className="col-span-1 row-span-2 min-h-[220px] lg:col-span-3 lg:row-span-2 lg:min-h-[340px]"
            />
            <StatCard
              value={stats[1].value}
              label={stats[1].label}
              variant="dark"
              className="col-span-1 min-h-[160px] lg:col-span-3 lg:col-start-4"
            />
            <div className="relative col-span-2 row-span-2 hidden min-h-[280px] overflow-hidden rounded-3xl lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:block lg:min-h-[340px]">
              <img
                src="/images/villatree-clean.png"
                alt="Modern villa with landscaped grounds"
                className="absolute left-1/2 top-1/2 h-[128%] w-[128%] -translate-x-1/2 -translate-y-1/2 object-contain"
                draggable={false}
              />
            </div>
            <StatCard
              value={stats[2].value}
              label={stats[2].label}
              variant="light"
              className="col-span-2 min-h-[140px] lg:col-span-6 lg:col-start-4 lg:row-start-2"
            />
            <StatCard
              value={stats[3].value}
              label={stats[3].label}
              variant="muted"
              className="col-span-1 min-h-[140px] lg:col-span-3 lg:col-start-4 lg:row-start-3"
            />
            <div className="col-span-1 flex min-h-[140px] flex-col justify-between rounded-2xl border border-charcoal/10 bg-cream p-6 lg:col-span-3 lg:col-start-7 lg:row-start-3 lg:rounded-3xl lg:p-8">
              <p className="text-xs tracking-[0.2em] text-warm-gray">01</p>
              <div>
                <p className="heading-display text-2xl text-charcoal">Mission</p>
                <p className="mt-2 text-xs leading-relaxed text-warm-gray">
                  Precision without compromise — from concept to completion.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
