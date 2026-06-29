"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { notoSerif } from "@/lib/fonts";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Team", href: "/team" },
];

// Routes that open with a full dark hero, so the header should start in
// light (cream) text mode while near the top.
const darkHeroRoutes = ["/", "/projects", "/services"];

export function Header() {
  const pathname = usePathname();
  const [overHero, setOverHero] = useState(darkHeroRoutes.includes(pathname));
  const [inProcessSection, setInProcessSection] = useState(false);
  const [inTickerSection, setInTickerSection] = useState(false);
  const [inTrackRecordSection, setInTrackRecordSection] = useState(false);
  const [inFaqSection, setInFaqSection] = useState(false);
  const [inServicesSolutions, setInServicesSolutions] = useState(false);
  const [inBeliefsImage, setInBeliefsImage] = useState(false);
  const [inProjectsCategory, setInProjectsCategory] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hideCenterNav = inProcessSection || inTickerSection || inFaqSection;
  const hideHeader = inTrackRecordSection;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setOverHero(
        darkHeroRoutes.includes(pathname) &&
          y <
            window.innerHeight *
              (pathname === "/" ? 3.2 : 0.72),
      );

      const processEl = document.getElementById("process");
      if (pathname === "/" && processEl) {
        const rect = processEl.getBoundingClientRect();
        const vh = window.innerHeight;
        setInProcessSection(rect.top <= 0 && rect.bottom >= vh);
      } else {
        setInProcessSection(false);
      }

      const tickerEl = document.getElementById("home-ticker");
      if (pathname === "/" && tickerEl) {
        const rect = tickerEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const opacity = Number.parseFloat(window.getComputedStyle(tickerEl).opacity);
        setInTickerSection(
          opacity > 0.15 && rect.top < vh * 0.35 && rect.bottom > 0,
        );
      } else {
        setInTickerSection(false);
      }

      const trackRecordEl = document.getElementById("track-record");
      if (pathname === "/" && trackRecordEl) {
        const rect = trackRecordEl.getBoundingClientRect();
        const vh = window.innerHeight;
        setInTrackRecordSection(rect.top < vh * 0.75 && rect.bottom > vh * 0.25);
      } else {
        setInTrackRecordSection(false);
      }

      const faqEl = document.getElementById("faq");
      if (pathname === "/" && faqEl) {
        const rect = faqEl.getBoundingClientRect();
        const vh = window.innerHeight;
        setInFaqSection(rect.top < vh * 0.75 && rect.bottom > vh * 0.25);
      } else {
        setInFaqSection(false);
      }

      const solutionsEl = document.getElementById("solutions");
      if (pathname === "/services" && solutionsEl) {
        const rect = solutionsEl.getBoundingClientRect();
        const vh = window.innerHeight;
        setInServicesSolutions(rect.top <= 0 && rect.bottom >= vh * 0.45);
      } else {
        setInServicesSolutions(false);
      }

      const beliefsEl = document.getElementById("beliefs");
      const beliefsImageEl = document.getElementById("beliefs-image-panel");
      if (pathname === "/services" && beliefsEl && beliefsImageEl) {
        const beliefsRect = beliefsEl.getBoundingClientRect();
        const imageRect = beliefsImageEl.getBoundingClientRect();
        const vh = window.innerHeight;
        const beliefsPinned =
          beliefsRect.top <= 0 && beliefsRect.bottom >= vh * 0.55;
        setInBeliefsImage(beliefsPinned && imageRect.bottom > 96);
      } else {
        setInBeliefsImage(false);
      }

      if (pathname === "/projects") {
        const vh = window.innerHeight;
        const inCategory = ["projects-residential", "projects-commercial"].some(
          (id) => {
            const el = document.getElementById(id);
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top <= 0 && rect.bottom >= vh * 0.45;
          },
        );
        setInProjectsCategory(inCategory);
      } else {
        setInProjectsCategory(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if ((hideCenterNav || hideHeader) && menuOpen) setMenuOpen(false);
  }, [hideCenterNav, hideHeader, menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isCollectionPage = pathname.startsWith("/collections");
  const useDarkNav =
    pathname === "/about" ||
    pathname === "/team" ||
    isCollectionPage;

  const light = overHero || inBeliefsImage;
  const headerSection = inBeliefsImage
    ? "beliefs-image"
    : inServicesSolutions
      ? "services-solutions"
      : inProjectsCategory
        ? "projects-category"
        : undefined;
  const navTextClass =
    useDarkNav && !overHero
      ? "text-charcoal hover:text-design"
      : "text-white hover:text-white/80";
  const burgerClass =
    useDarkNav && !overHero ? "bg-charcoal" : light ? "bg-white" : "bg-charcoal";

  return (
    <>
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{
          y: hideHeader ? -28 : 0,
          opacity: hideHeader ? 0 : 1,
          pointerEvents: hideHeader ? "none" : "auto",
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`site-header fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isCollectionPage
            ? "border-b border-charcoal/10 bg-cream/95 backdrop-blur-sm"
            : "bg-transparent"
        }`}
        data-page={
          pathname === "/projects"
            ? "projects"
            : isCollectionPage
              ? "collection"
              : undefined
        }
        data-section={headerSection}
      >
        <div className="site-header__inner grid w-full grid-cols-[1fr_auto] items-center px-4 py-6 sm:px-5 md:grid-cols-[1fr_auto_1fr] lg:px-6 lg:py-7">
          {!inTickerSection && (
            <Link
              href="/"
              className={`site-header__logo group ${
                inProjectsCategory ? "max-md:hidden" : ""
              } ${inServicesSolutions ? "ml-0" : "ml-4 lg:ml-6"}`}
            >
              <span className="site-logo heading-display flex flex-col leading-[0.92] tracking-[0.12em] text-[1.5rem] lg:text-[1.85rem]">
                <span className="site-logo__build text-build">BUILD</span>
                <span className="site-logo__design">DESIGN</span>
              </span>
            </Link>
          )}

          {inTickerSection ? (
            <div className="hidden md:block" aria-hidden="true" />
          ) : hideCenterNav ? (
            <div className="hidden md:block" aria-hidden="true" />
          ) : (
            <nav
              className={`site-header__nav hidden items-center justify-center gap-0 md:flex ${navTextClass}`}
              aria-label="Main"
            >
              {navLinks.map((link, i) => (
                <span key={link.href} className="flex items-center">
                  {i > 0 && (
                    <span
                      className="site-header__sep mx-5 select-none text-base text-white/50 lg:mx-7 lg:text-lg"
                      aria-hidden="true"
                    >
                      ✦
                    </span>
                  )}
                  <Link
                    href={link.href}
                    className="site-header__link font-serif text-[1rem] font-bold tracking-[0.22em] uppercase transition-colors lg:text-[1.125rem]"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}

          <div className="site-header__actions flex items-center justify-self-end md:col-start-3">
            <Link
              href="/#contact"
              className={`${notoSerif.className} site-header__contact mr-4 hidden items-center rounded-full bg-[#e04719] px-6 py-3 text-sm font-bold tracking-[0.22em] text-charcoal uppercase transition-colors hover:bg-[#c63d14] hover:text-cream lg:mr-6 ${inTickerSection ? "" : "lg:inline-flex"}`}
            >
              Contact
            </Link>
            {!hideCenterNav && (
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative z-50 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] md:hidden"
              >
                <span
                  className={`h-px w-6 transition-all ${burgerClass} ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
                />
                <span
                  className={`h-px w-6 transition-all ${burgerClass} ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`h-px w-6 transition-all ${burgerClass} ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={false}
        animate={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
        className="fixed inset-0 z-40 bg-charcoal/96 md:hidden"
      >
        {!hideCenterNav && (
          <nav className="flex h-full flex-col items-center justify-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-3xl font-light tracking-wide text-cream"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className={`${notoSerif.className} site-header__contact mt-2 inline-flex items-center rounded-full bg-[#e04719] px-6 py-3 text-sm font-bold tracking-[0.22em] text-charcoal uppercase transition-colors hover:bg-[#c63d14] hover:text-cream`}
            >
              Contact
            </Link>
          </nav>
        )}
      </motion.div>
    </>
  );
}
