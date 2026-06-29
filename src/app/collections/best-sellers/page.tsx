import type { Metadata } from "next";
import { BestSellersPage } from "@/components/BestSellersPage";

export const metadata: Metadata = {
  title: "Top Bestsellers | Build Design Projects",
  description:
    "Browse signature residential and commercial projects from Build Design Projects — curated featured work across India.",
};

export default function Page() {
  return <BestSellersPage />;
}
