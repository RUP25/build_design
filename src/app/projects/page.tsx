import type { Metadata } from "next";
import { ProjectsPage } from "@/components/ProjectsPage";
import { PageSeo } from "@/components/seo/PageSeo";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "View Build Design Projects portfolio of luxury residential and commercial turnkey executions across India, including premium homes, corporate environments, and high-spec commercial spaces.",
  path: "/projects",
  keywords: [
    "luxury residential projects India",
    "commercial interior portfolio",
    "Kolkata luxury home projects",
    "turnkey project showcase",
  ],
});

export default function Page() {
  return (
    <>
      <PageSeo
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
      />
      <ProjectsPage />
    </>
  );
}
