import type { Metadata } from "next";
import { ServicesPage } from "@/components/ServicesPage";
import { PageSeo } from "@/components/seo/PageSeo";
import { createPageMetadata, createServicesSchema } from "@/lib/seo";

const description =
  "Explore Build Design Projects turnkey services: luxury residential execution, commercial builds, MEP and engineering systems, global sourcing, prefab solutions, pools, and lifestyle integrations across India.";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description,
  path: "/services",
  keywords: [
    "turnkey construction services India",
    "luxury residential execution",
    "commercial construction services",
    "MEP engineering contractor",
    "prefab construction India",
    "global sourcing construction materials",
  ],
});

export default function Page() {
  return (
    <>
      <PageSeo
        name="Turnkey Construction and Interior Services"
        description={description}
        path="/services"
        type="CollectionPage"
        additionalSchemas={[createServicesSchema()]}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <ServicesPage />
    </>
  );
}
