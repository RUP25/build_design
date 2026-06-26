"use client";

import { Header } from "@/components/Header";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

export function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <Services />
      </main>
      <Footer />
      <ScrollToTopButton threshold={720} />
    </>
  );
}
