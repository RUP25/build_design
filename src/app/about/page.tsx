import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "About | Build Design Projects",
  description:
    "Decades of turnkey expertise in high-value residential and commercial execution — precision without compromise, from concept to completion.",
};

export default function Page() {
  return <AboutPage />;
}
