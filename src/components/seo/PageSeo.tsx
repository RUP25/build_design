import { JsonLd } from "@/components/seo/JsonLd";
import { createBreadcrumbSchema, createWebPageSchema } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type PageSeoProps = {
  breadcrumbs: BreadcrumbItem[];
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "CollectionPage";
  additionalSchemas?: Record<string, unknown>[];
};

export function PageSeo({
  breadcrumbs,
  name,
  description,
  path,
  type,
  additionalSchemas = [],
}: PageSeoProps) {
  return (
    <JsonLd
      data={[
        createWebPageSchema({ name, description, path, type }),
        createBreadcrumbSchema(breadcrumbs),
        ...additionalSchemas,
      ]}
    />
  );
}
