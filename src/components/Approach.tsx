"use client";

import Image from "next/image";
import { approachPoints, partners } from "@/lib/content";
import { FadeIn, SectionHeading, SectionLabel } from "@/components/ui/FadeIn";

export function Approach() {
  return (
    <section className="bg-charcoal py-24 text-cream lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <FadeIn>
            <SectionLabel>Our Approach</SectionLabel>
            <SectionHeading className="mb-8 text-cream">
              Complete control leads to superior outcomes
            </SectionHeading>
            <p className="mb-8 leading-relaxed text-cream/70">
              We operate on a simple principle — complete control leads to
              superior outcomes. By managing every layer of a project internally
              and through trusted partnerships, we ensure:
            </p>
            <ul className="space-y-4">
              {approachPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-4 text-sm text-cream/80"
                >
                  <span className="text-accent">—</span>
                  {point}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
                alt="Construction and structural execution"
                fill
                className="object-cover opacity-90"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-24">
          <SectionLabel>Partnerships</SectionLabel>
          <SectionHeading className="mb-12 text-cream">
            Trusted by leading institutions
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <div
                key={partner}
                className="border border-cream/10 px-6 py-5 text-sm tracking-wide text-cream/80 transition-colors hover:border-accent/50 hover:text-cream"
              >
                {partner}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-cream/50">
            Authorized Dealer of Disha Pavers · Channel Partner of Royal Tint
            Smart Switchable Glass Technology
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
