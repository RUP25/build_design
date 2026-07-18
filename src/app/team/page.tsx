import type { Metadata } from "next";
import { TeamPage } from "@/components/TeamPage";
import { PageSeo } from "@/components/seo/PageSeo";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Meet the Build Design Projects team — specialists in turnkey residential and commercial execution, engineering, sourcing, and project delivery across India.";

export const metadata: Metadata = createPageMetadata({
  title: "Our Team",
  description,
  path: "/team",
  keywords: [
    "Build Design Projects team",
    "construction project leadership India",
    "turnkey execution specialists",
  ],
});

export default function Page() {
  return (
    <>
      <PageSeo
        name="Build Design Projects Team"
        description={description}
        path="/team"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Our Team", path: "/team" },
        ]}
      />
      <TeamPage />
    </>
  );
}
