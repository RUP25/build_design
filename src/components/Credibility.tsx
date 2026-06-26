import {
  officialPartnerships,
  trustedClientLogos,
  trustedVendorClients,
} from "@/lib/content";
import { SectionHeading, SectionLabel } from "@/components/ui/FadeIn";

function PartnerLogo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`block h-auto w-auto max-w-full object-contain object-center ${className}`}
      style={{ height: "auto", width: "auto" }}
    />
  );
}

export function Credibility() {
  return (
    <section
      id="track-record"
      className="bg-cream py-16 sm:py-24 lg:py-32"
      aria-label="Proven Track Record"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionLabel>Track Record</SectionLabel>
            <SectionHeading className="mb-6 sm:mb-8">Proven Track Record</SectionHeading>
            <p className="mb-6 text-sm leading-relaxed text-warm-gray sm:mb-8 sm:text-base">
              Build Design Projects has successfully delivered projects for
              leading institutions, corporate clients, and private homeowners.
            </p>
            <p className="heading-display text-xl text-charcoal/80 sm:text-2xl md:text-3xl">
              From private residences to complex commercial environments, our
              work reflects discipline, scale, and reliability.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-10">
            <div>
              <p className="mb-4 flex items-start gap-2 text-[10px] leading-relaxed tracking-[0.16em] text-charcoal uppercase sm:text-[11px] sm:tracking-[0.18em]">
                <span className="text-accent">•</span>
                Trusted Clients &amp; Government / Corporate Vendor Partnerships
              </p>

              <p className="mb-5 text-[10px] leading-relaxed tracking-[0.12em] text-charcoal/80 uppercase sm:text-[11px] sm:tracking-[0.14em]">
                We are proud to be approved vendors to premier government
                &amp; corporate institutions:
              </p>

              <ul className="mb-8 space-y-2.5">
                {trustedVendorClients.map((client) => (
                  <li
                    key={client}
                    className="flex items-start gap-2 text-[10px] leading-relaxed tracking-[0.1em] text-charcoal/85 uppercase sm:text-[11px] sm:tracking-[0.12em]"
                  >
                    <span className="text-accent">•</span>
                    {client}
                  </li>
                ))}
              </ul>

              <div className="border-b border-charcoal/10 py-6 sm:py-8">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:justify-between lg:gap-x-4">
                  {trustedClientLogos.map((logo) => (
                    <div
                      key={logo.name}
                      className="flex min-h-[4.5rem] w-[44%] items-center justify-center px-1 sm:min-h-[5.5rem] sm:w-[30%] sm:px-2 lg:min-h-[6.5rem] lg:w-auto lg:flex-1 lg:px-1"
                    >
                      <PartnerLogo
                        src={logo.src}
                        alt={logo.name}
                        className="max-h-[5.5rem] sm:max-h-[7rem] lg:max-h-[8.5rem]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="mb-6 border-b border-charcoal/20 pb-2 text-[11px] tracking-[0.18em] text-charcoal uppercase">
                Our Official Partnerships
              </p>

              <div className="space-y-10">
                {officialPartnerships.map((partnership) => (
                  <div
                    key={partnership.title}
                    className="grid gap-4 sm:grid-cols-[1fr_minmax(9rem,auto)] sm:items-center sm:gap-6"
                  >
                    <p className="flex items-start gap-2 text-[10px] leading-relaxed tracking-[0.1em] text-charcoal/85 uppercase sm:text-[11px] sm:tracking-[0.12em]">
                      <span className="text-accent">•</span>
                      {partnership.title}
                    </p>
                    <div className="flex min-h-[3.5rem] items-center justify-start sm:min-h-[4.5rem] sm:justify-end">
                      <PartnerLogo
                        src={partnership.logo.src}
                        alt={partnership.logo.name}
                        className="max-h-[3.5rem] sm:max-h-[4.5rem] md:max-h-[5rem]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
