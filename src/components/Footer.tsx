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
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16 lg:ml-auto lg:gap-24 lg:pr-2">
            <div>
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

            <div>
              <p className="section-label mb-4 text-cream/50">Contact</p>
              <p className="mb-1 text-sm text-cream/70">
                Info@buildesignprojects.com
              </p>
              <p className="mb-1 text-sm text-cream/70">+91 9831038457</p>
              <p className="text-sm text-cream/70">033 2252 4444</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 md:flex-row">
          <p className="text-xs text-cream/40">
            Built once. Built right.
          </p>
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Build Design Projects. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
