"use client";

import Link from "next/link";
import { teamLeads, teamPillars, partners } from "@/lib/content";
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
          <FadeIn className="mb-16 max-w-3xl">
            <p className="section-label mb-6 text-cream/50">(Leadership)</p>
            <h2 className="heading-display text-4xl text-cream md:text-5xl lg:text-6xl">
              Who powers Build Design
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
            {teamLeads.map((lead, i) => (
              <FadeIn key={lead.name} delay={i * 0.08}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full lg:h-48 lg:w-48">
                    <img
                      src={lead.photo}
                      alt={lead.name}
                      className="h-full w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                    />
                  </div>
                  <p className="mt-7 text-base text-cream lg:text-lg">
                    {lead.name}
                  </p>
                  <p className="mt-1 text-xs tracking-wide text-cream/50">
                    {lead.role}
                  </p>
                  <a
                    href={`tel:${lead.phone.replace(/\s/g, "")}`}
                    className="mt-2 text-sm text-cream/70 transition-colors hover:text-accent"
                  >
                    {lead.phone}
                  </a>
                </div>
              </FadeIn>
            ))}
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
