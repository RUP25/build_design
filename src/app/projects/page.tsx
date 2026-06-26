import type { Metadata } from "next";
import { ProjectsPage } from "@/components/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects | Build Design Projects",
  description:
    "A curated portfolio of high-value residential and commercial turnkey executions — precision, discretion, and long-term value.",
};

export default function Page() {
  return <ProjectsPage />;
}
