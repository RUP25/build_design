"use client";

import Link from "next/link";
import { commercialProjects, residentialProjects } from "@/lib/content";
import { FadeIn } from "@/components/ui/FadeIn";
import { ScrollAdvanceControl } from "@/components/ui/ScrollAdvanceControl";
import { CategoryScroll } from "@/components/projects/CategoryScroll";
import { useSectionParallax } from "@/hooks/useSectionParallax";

const executionScope = [
  {
    title: "End-to-end construction & delivery",
    description: "A single accountable team from groundwork to final handover.",
  },
  {
    title: "Full systems integration",
    description:
      "Electrical, plumbing, HVAC, and smart systems engineered as one.",
  },
  {
    title: "Premium material & fixture installation",
    description: "Globally sourced finishes installed to exacting standards.",
  },
  {
    title: "Complete project handover",
    description: "Documented, commissioned, and supported beyond completion.",
  },
];

const keyDeliveries = [
  "Premium residential developments",
  "Airport and hospitality projects (TFS)",
  "Corporate execution for ITC Group",
  "High-end retail and commercial spaces",
];

const clientMeaning = [
  "Proven capability at scale",
  "Experience with high-value environments",
  "Consistent execution standards",
  "Trusted by established organizations",
];

function Label({ children }: { children: string }) {
  return (
    <p className="mb-6 font-serif text-xs tracking-[0.18em] text-accent italic sm:mb-8 sm:text-sm">
      ({children})
    </p>
  );
}

export function Projects() {
  const heroParallax = useSectionParallax(0.9);
  const executionParallax = useSectionParallax(0.85);

  return (
    <div className="bg-charcoal text-cream">
      {/* Hero — full-page image with overlaid copy */}
      <section
        id="projects-hero"
        ref={heroParallax.sectionRef}
        className="relative flex min-h-[100dvh] items-end overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-[25%] left-0 h-[160%] w-full will-change-transform"
            style={{
              transform: `translate3d(0, ${heroParallax.parallaxY}px, 0)`,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
              alt="Signature project"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/25" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8 lg:pb-28 lg:pt-44">
          <FadeIn>
            <Label>Portfolio</Label>
            <h1 className="heading-display max-w-4xl text-balance text-[clamp(2.25rem,8vw,5rem)] leading-[1.04] text-cream sm:text-5xl md:text-7xl lg:text-8xl">
              A curated portfolio
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:mt-10 sm:text-lg lg:ml-auto">
              Reflecting our capability to execute complex, high-value projects
              across sectors — with precision, discretion, and long-term value.
            </p>
          </FadeIn>
        </div>

        <ScrollAdvanceControl
          hint="Scroll"
          variant="light"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 sm:bottom-8"
          onAdvance={() => {
            document
              .getElementById("projects-residential")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          ariaLabel="Scroll. Explore the residential portfolio."
        />
      </section>

      {/* Categories — scroll-pinned, cycling through every project */}
      <CategoryScroll
        sectionId="projects-residential"
        exitHint="Commercial next"
        label="( 01 ) Residential"
        title="Private Residences"
        description="Luxury homes and bungalows executed with complete structural, system, and finishing integration."
        projects={residentialProjects}
      />
      <CategoryScroll
        sectionId="projects-commercial"
        exitHint="Our approach"
        label="( 02 ) Commercial"
        title="Commercial & Corporate Spaces"
        description="High-performance environments including offices, airport projects, hospitality, and branded spaces."
        projects={commercialProjects}
        reverse
      />

      {/* Execution Scope — frosted cards over a dimmed image */}
      <section
        ref={executionParallax.sectionRef}
        className="relative overflow-hidden py-16 sm:py-28 lg:py-36"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-[25%] left-0 h-[160%] w-full will-change-transform"
            style={{
              transform: `translate3d(0, ${executionParallax.parallaxY}px, 0)`,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              aria-hidden="true"
            />
          </div>
          <div className="absolute inset-0 bg-charcoal/85" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10 max-w-2xl sm:mb-16">
            <Label>Execution Scope</Label>
            <h2 className="heading-display text-3xl text-cream sm:text-4xl md:text-5xl lg:text-6xl">
              Every layer, owned end-to-end.
            </h2>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {executionScope.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="flex h-full flex-col justify-between border border-cream/15 bg-cream/5 p-5 backdrop-blur-md sm:p-7">
                  <div>
                    <h3 className="heading-display mb-3 text-lg text-cream sm:mb-4 sm:text-xl lg:text-2xl">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-cream/55 sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-6 text-xs tracking-[0.25em] text-accent sm:mt-10">
                    ( {String(i + 1).padStart(2, "0")} )
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <p className="heading-display mt-10 max-w-3xl text-xl leading-snug text-cream/80 sm:mt-16 sm:text-2xl lg:text-3xl">
              Each project reflects a commitment to precision, discretion, and
              long-term value.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Credibility — Proven Track Record */}
      <section className="px-4 py-16 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:gap-16 lg:grid-cols-2 lg:gap-24">
            <FadeIn>
              <Label>Completed Projects</Label>
              <h2 className="heading-display mb-6 text-3xl text-cream sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl">
                Proven track record
              </h2>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-cream/60 sm:mb-8 sm:text-base md:text-lg">
                Build Design Projects has successfully delivered projects for
                leading institutions, corporate clients, and private homeowners.
              </p>
              <p className="heading-display max-w-md text-xl leading-snug text-cream/80 sm:text-2xl md:text-3xl">
                From private residences to complex commercial environments, our
                work reflects discipline, scale, and reliability.
              </p>
            </FadeIn>

            <FadeIn delay={0.15} className="space-y-8 sm:space-y-12">
              <div>
                <p className="mb-4 text-[10px] tracking-[0.24em] text-accent uppercase sm:mb-6 sm:text-[11px] sm:tracking-[0.3em]">
                  Key Deliveries Include
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  {keyDeliveries.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-cream/10 pb-3 text-sm text-cream/75 sm:gap-4 sm:pb-4 sm:text-base"
                    >
                      <span className="text-accent">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-4 text-[10px] tracking-[0.24em] text-accent uppercase sm:mb-6 sm:text-[11px] sm:tracking-[0.3em]">
                  What This Means for Clients
                </p>
                <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                  {clientMeaning.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-xs text-cream/60 sm:gap-3 sm:text-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <Link
              href="/#contact"
              className="mt-12 inline-block bg-cream px-6 py-3.5 text-xs tracking-[0.15em] text-charcoal uppercase transition-all hover:bg-accent sm:mt-20 sm:px-8 sm:py-4"
            >
              Discuss your project
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
