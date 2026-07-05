"use client";

import Link from "next/link";
import { teamLeadershipCopy, teamPillars, partners } from "@/lib/content";
import { FadeIn, SectionHeading, SectionLabel } from "@/components/ui/FadeIn";
import { TeamScrollHero } from "@/components/team/TeamScrollHero";

export function Team() {
  return (
    <>
      {/* Scroll-pinned growing-sphere hero */}
      <TeamScrollHero />

      {/* Leadership */}
      <section className="bg-charcoal py-20 text-cream lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:items-end lg:gap-20">
            <FadeIn className="max-w-xl">
              <p className="section-label mb-6 text-cream/50">(Leadership)</p>
              <h2 className="heading-display text-4xl text-cream md:text-5xl lg:text-6xl">
                Who powers Build Design
              </h2>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="relative max-w-2xl lg:max-w-none lg:pt-2">
                <span
                  aria-hidden="true"
                  className="absolute -left-6 top-1 hidden h-[calc(100%-0.25rem)] w-px bg-accent/50 lg:block"
                />
                <p className="text-base leading-[1.9] text-cream/72 sm:text-lg lg:text-xl lg:leading-[1.95]">
                  {teamLeadershipCopy}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeIn className="mb-16 max-w-3xl">
            <SectionLabel>How we work</SectionLabel>
            <SectionHeading>Our work stands on five pillars.</SectionHeading>
          </FadeIn>

          <div className="grid gap-px overflow-hidden border-t border-charcoal/10">
            {teamPillars.map((pillar, i) => (
              <FadeIn key={pillar.number} delay={i * 0.05}>
                <div className="grid gap-4 border-b border-charcoal/10 py-8 md:grid-cols-[auto_1fr_2fr] md:items-baseline md:gap-12">
                  <span className="text-sm text-accent">{pillar.number}</span>
                  <h3 className="heading-display text-2xl text-charcoal lg:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="leading-relaxed text-warm-gray">
                    {pillar.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Partners + CTA */}
      <section className="border-t border-charcoal/10 bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <FadeIn>
              <SectionLabel>Trusted by</SectionLabel>
              <ul className="space-y-4">
                {partners.map((partner) => (
                  <li
                    key={partner}
                    className="flex items-center gap-4 border-b border-charcoal/10 pb-4 text-charcoal/80 last:border-0"
                  >
                    <span className="text-accent">—</span>
                    {partner}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h2 className="heading-display text-3xl text-charcoal md:text-4xl lg:text-5xl">
                Tell us your project. We&apos;ll build the team around it.
              </h2>
              <Link
                href="/#contact"
                className="mt-10 inline-block bg-charcoal px-8 py-4 text-xs tracking-[0.15em] text-cream uppercase transition-all hover:bg-accent hover:text-charcoal"
              >
                Start a conversation
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
