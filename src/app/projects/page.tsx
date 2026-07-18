import type { Metadata } from "next";
import { ProjectsPage } from "@/components/ProjectsPage";
import { PageSeo } from "@/components/seo/PageSeo";
import { createPageMetadata } from "@/lib/seo";

const description =
  "View Build Design Projects portfolio of luxury residential and commercial turnkey executions across India, including premium homes, corporate environments, and high-spec commercial spaces.";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description,
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
        name="Residential and Commercial Projects"
        description={description}
        path="/projects"
        type="CollectionPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
      />
      <ProjectsPage />
    </>
  );
}
