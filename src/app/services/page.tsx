import type { Metadata } from "next";
import { ServicesPage } from "@/components/ServicesPage";

export const metadata: Metadata = {
  title: "Services | Build Design Projects",
  description:
    "End-to-end turnkey execution — structure, systems, interiors, and final handover through a single accountable team.",
};

export default function Page() {
  return <ServicesPage />;
}
