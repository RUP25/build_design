import type { Metadata } from "next";
import { TeamPage } from "@/components/TeamPage";

export const metadata: Metadata = {
  title: "Our Team | Build Design Projects",
  description:
    "The specialists behind every Build Design Projects execution — one accountable team delivering high-value residential and commercial projects across India.",
};

export default function Page() {
  return <TeamPage />;
}
