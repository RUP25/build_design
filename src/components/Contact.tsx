"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { FadeIn, SectionHeading, SectionLabel } from "@/components/ui/FadeIn";
import { useSectionParallax } from "@/hooks/useSectionParallax";
import { companyAddress, companyEmail, companyPhone } from "@/lib/content";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { sectionRef, parallaxY } = useSectionParallax(0.85);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[25%] left-0 h-[160%] w-full will-change-transform"
          style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1920&q=80"
            alt="Luxury architecture at dusk"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-charcoal/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-2 lg:gap-24">
          <FadeIn>
            <SectionLabel>Contact</SectionLabel>
            <SectionHeading className="mb-6 text-cream">
              Envision Your Project
            </SectionHeading>
            <p className="mb-4 text-lg leading-relaxed text-cream/70">
              If you are planning a high-value residential or commercial
              project, connect with us for a confidential consultation.
            </p>
            <p className="heading-display mb-8 text-xl text-cream/90 sm:mb-12 sm:text-2xl md:text-3xl">
              Serious projects require serious execution partners.
            </p>

            <div className="space-y-8">
              <div>
                <p className="section-label mb-3 text-cream/50">Phone</p>
                <a
                  href={`tel:${companyPhone.tel}`}
                  className="text-cream transition-colors hover:text-accent"
                >
                  {companyPhone.display}
                </a>
              </div>

              <div>
                <p className="section-label mb-3 text-cream/50">Email</p>
                <a
                  href={`mailto:${companyEmail}`}
                  className="text-cream transition-colors hover:text-accent"
                >
                  {companyEmail}
                </a>
              </div>

              <div>
                <p className="section-label mb-3 text-cream/50">Address</p>
                <address className="not-italic leading-relaxed text-cream">
                  {companyAddress.line1}
                  <br />
                  {companyAddress.line2}
                </address>
              </div>

              <div>
                <p className="section-label mb-3 text-cream/50">
                  Service Coverage
                </p>
                <p className="text-cream">Pan India</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-cream p-5 sm:p-8 lg:p-10">
              <h3 className="heading-display mb-2 text-xl text-charcoal sm:text-2xl">
                Request a Consultation
              </h3>
              <p className="mb-8 text-sm text-warm-gray">
                Our team will contact you as soon as possible.
              </p>

              {submitted ? (
                <div className="py-12 text-center">
                  <p className="heading-display mb-2 text-2xl text-charcoal">
                    Thank you!
                  </p>
                  <p className="text-warm-gray">
                    Your submission has been received. We will be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs tracking-wide text-warm-gray uppercase"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      disabled={submitting}
                      className="w-full border border-charcoal/15 bg-transparent px-4 py-3 text-charcoal outline-none transition-colors focus:border-accent disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs tracking-wide text-warm-gray uppercase"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled={submitting}
                      className="w-full border border-charcoal/15 bg-transparent px-4 py-3 text-charcoal outline-none transition-colors focus:border-accent disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs tracking-wide text-warm-gray uppercase"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      disabled={submitting}
                      className="w-full border border-charcoal/15 bg-transparent px-4 py-3 text-charcoal outline-none transition-colors focus:border-accent disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-xs tracking-wide text-warm-gray uppercase"
                    >
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      disabled={submitting}
                      className="w-full resize-none border border-charcoal/15 bg-transparent px-4 py-3 text-charcoal outline-none transition-colors focus:border-accent disabled:opacity-60"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-700" role="alert">
                      {error}
                    </p>
                  )}
                  <p className="text-xs text-warm-gray">
                    By sending your request, you agree to our privacy policy. We
                    promise to keep your personal information safe and secure.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-charcoal py-4 text-xs tracking-[0.15em] text-cream uppercase transition-all hover:bg-accent hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Send Request"}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
