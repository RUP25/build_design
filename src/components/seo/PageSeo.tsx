import { JsonLd } from "@/components/seo/JsonLd";
import { createBreadcrumbSchema } from "@/lib/seo";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type PageSeoProps = {
  breadcrumbs?: BreadcrumbItem[];
};

export function PageSeo({ breadcrumbs }: PageSeoProps) {
  if (!breadcrumbs?.length) return null;

  return <JsonLd data={createBreadcrumbSchema(breadcrumbs)} />;
}
