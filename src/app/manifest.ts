import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Build Design Projects",
    short_name: "BDP",
    description:
      "One-stop turnkey construction and interior execution across India since 1979.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f0e8",
    theme_color: "#172218",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
