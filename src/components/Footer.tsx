import { companyAddress, companyEmail, companyPhone } from "@/lib/content";

function FooterMap({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <a
        href={companyAddress.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="section-label mb-3 inline-block text-cream/50 transition-colors hover:text-cream/80"
      >
        Find us here
      </a>
      <div className="overflow-hidden border border-cream/10 bg-charcoal-light">
        <iframe
          title="Build Design Projects office location"
          src={companyAddress.mapsEmbedUrl}
          className="h-44 w-full grayscale-[20%] contrast-[1.05] transition-[filter] duration-500 hover:grayscale-0 sm:h-48"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal py-16 text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-serif text-2xl font-light tracking-[0.15em]">
              <span className="text-build">BUILD </span>
              <span className="text-design">DESIGN</span>
            </p>
            <p className="mb-4 text-[10px] tracking-[0.25em] text-cream/50 uppercase">
              Projects
            </p>
            <p className="text-sm leading-relaxed text-cream/60">
              One-Stop Turnkey Execution Since 1979
            </p>

            <FooterMap className="mt-8 hidden max-w-sm lg:block" />
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-8 lg:ml-auto lg:gap-24 lg:pr-2">
            <div className="shrink-0">
              <p className="section-label mb-4 text-cream/50">Navigation</p>
              <nav className="flex flex-col gap-2">
                {[
                  { label: "About", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Projects", href: "/projects" },
                  { label: "Team", href: "/team" },
                  { label: "Contact", href: "/#contact" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-cream/70 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="min-w-0 shrink-0">
              <p className="section-label mb-4 text-cream/50">Contact</p>
              <a
                href={`mailto:${companyEmail}`}
                className="mb-4 block text-sm text-cream/70 transition-colors hover:text-cream"
              >
                {companyEmail}
              </a>
              <p className="mb-4 text-sm text-cream/70">{companyPhone.display}</p>
              <p className="section-label mb-2 text-cream/50">Address</p>
              <address className="not-italic text-sm leading-relaxed text-cream/70">
                {companyAddress.line1}
                <br />
                {companyAddress.line2}
              </address>
            </div>

            <FooterMap className="w-full min-w-0 flex-1 lg:hidden" />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 md:flex-row">
          <p className="text-xs text-cream/40">Built once. Built right.</p>
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Build Design Projects. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
