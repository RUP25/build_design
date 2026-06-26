"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { HomeScrollExperience } from "@/components/HomeScrollExperience";
import { ProcessModelScrollSection } from "@/components/ProcessModelScrollSection";
import { Credibility } from "@/components/Credibility";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { IntroSequence } from "@/components/IntroSequence";
import { HomeScrollControl } from "@/components/HomeScrollControl";

export function HomePage() {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (introDone) return;
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  const handleIntroComplete = () => {
    document.body.style.overflow = "";
    setIntroDone(true);
  };

  return (
    <>
      {!introDone && <IntroSequence onComplete={handleIntroComplete} />}
      <Header />
      <main>
        <HomeScrollExperience />
        <ProcessModelScrollSection />
        <Credibility />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <HomeScrollControl enabled={introDone} />
    </>
  );
}
