const DEFAULT_SITE_URL = "https://www.buildesignprojetcs.com";

function normalizeSiteUrl(url: string) {
  const trimmed = url.trim().replace(/\/$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export const siteName = "Build Design Projects";
export const siteTagline = "One-Stop Turnkey Execution Since 1979";

export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEFAULT_SITE_URL),
);

export const defaultOgImage = {
  url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
  width: 1200,
  height: 630,
  alt: "Build Design Projects — luxury turnkey construction and interior execution",
};

export const siteKeywords = [
  "Build Design Projects",
  "turnkey construction India",
  "luxury residential construction",
  "commercial interior execution",
  "Kolkata construction company",
  "Pan India turnkey contractor",
  "luxury interior design India",
  "prefab construction India",
  "global sourcing construction",
  "high-end residential projects",
];

export const siteRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/projects", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/team", changeFrequency: "monthly" as const, priority: 0.7 },
];
