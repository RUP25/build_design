"use client";

import { Header } from "@/components/Header";
import { Projects } from "@/components/Projects";
import { Footer } from "@/components/Footer";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

export function ProjectsPage() {
  return (
    <>
      <Header />
      <main>
        <Projects />
      </main>
      <Footer />
      <ScrollToTopButton threshold={720} />
    </>
  );
}
