import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";
import { PageSeo } from "@/components/seo/PageSeo";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Since 1979, Build Design Projects has delivered high-value residential and commercial turnkey execution across India with single-point ownership, precision engineering, and post-handover service assurance.";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description,
  path: "/about",
  keywords: [
    "about Build Design Projects",
    "turnkey construction company since 1979",
    "Kolkata construction and interior firm",
  ],
});

export default function Page() {
  return (
    <>
      <PageSeo
        name="About Build Design Projects"
        description={description}
        path="/about"
        type="AboutPage"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <AboutPage />
    </>
  );
}
