"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollAdvanceControl } from "@/components/ui/ScrollAdvanceControl";
import { useSectionParallax } from "@/hooks/useSectionParallax";

export function ServicesHero() {
  const { sectionRef, parallaxY } = useSectionParallax(0.9);

  return (
    <section
      id="services-hero"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-end overflow-hidden bg-charcoal pb-12 pt-24 text-cream sm:pb-16 sm:pt-28 lg:pb-24 lg:pt-36"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[25%] left-0 h-[160%] w-full will-change-transform"
          style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
        >
          <img
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80"
            alt="Luxury interior construction and design"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/35" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(224,108,7,0.14),transparent_55%)]"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10">
        <div>
          <p className="section-label mb-6 text-cream/50 sm:mb-8">(What we do)</p>
          <h1 className="heading-display max-w-4xl text-[clamp(2rem,7vw,5.5rem)] leading-[0.95]">
            <span className="block">Turnkey execution.</span>
            <span className="block text-design">Delivered with precision.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/65 sm:mt-8 sm:text-base md:text-lg">
            We are designers and builders for the built environment — delivering
            high-value residential and commercial projects from structure to final
            handover.
          </p>
        </div>

        <div className="flex flex-col items-start gap-5 sm:gap-6 lg:items-end">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="hidden flex-col items-center gap-3 text-[10px] tracking-[0.35em] text-cream/45 uppercase sm:flex"
          >
            <span>Move</span>
            <span className="block h-10 w-px bg-cream/30" />
          </motion.div>
          <Link
            href="#solutions"
            className="hidden items-center rounded-full bg-[#de915b] px-5 py-2.5 font-sans text-[10px] font-bold tracking-[0.15em] text-charcoal uppercase transition-colors hover:bg-[#c8784d] hover:text-cream sm:inline-flex sm:px-6 sm:py-3 sm:text-xs"
          >
            Discover our offer
          </Link>
        </div>
      </div>

      <ScrollAdvanceControl
        hint="Scroll"
        variant="light"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 sm:bottom-8"
        onAdvance={() => {
          document
            .getElementById("solutions")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        ariaLabel="Scroll. Explore our solutions."
      />
    </section>
  );
}
