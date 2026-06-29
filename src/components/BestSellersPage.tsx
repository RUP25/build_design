"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BestSellersCollection } from "@/components/collection/BestSellersCollection";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

export function BestSellersPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <BestSellersCollection />
      </main>
      <Footer />
      <ScrollToTopButton threshold={480} />
    </>
  );
}
