import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { createFaqSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "One-Stop Turnkey Execution Since 1979",
  description:
    "Build Design Projects delivers premium turnkey construction and interior execution for luxury residential and commercial developments across India — structure, systems, sourcing, and handover since 1979.",
  path: "/",
  keywords: [
    "turnkey contractor Kolkata",
    "luxury home construction India",
    "commercial turnkey execution",
    "interior and construction company India",
  ],
});

export default function Page() {
  return (
    <>
      <JsonLd data={createFaqSchema()} />
      <HomePage />
    </>
  );
}
