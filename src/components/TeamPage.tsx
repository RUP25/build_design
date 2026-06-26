"use client";

import { Header } from "@/components/Header";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

export function TeamPage() {
  return (
    <>
      <Header />
      <main>
        <Team />
      </main>
      <Footer />
      <ScrollToTopButton threshold={720} />
    </>
  );
}
