import type { Metadata } from "next";
import {
  companyAddress,
  companyEmail,
  companyPhone,
  faqs,
} from "@/lib/content";
import {
  defaultOgImage,
  isPreviewDeployment,
  siteKeywords,
  siteName,
  siteTagline,
  siteUrl,
} from "@/lib/site";

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: typeof defaultOgImage;
  noIndex?: boolean;
};

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath === "/" ? "" : normalizedPath}`;
}

// Social share cards (WhatsApp, etc.) always show the site-wide branding,
// regardless of which page URL is shared. Page-specific titles/descriptions
// are kept for search engines only.
const shareCardTitle = `${siteName} | ${siteTagline}`;
const shareCardDescription =
  "Premium turnkey execution partner for high-value residential and commercial developments across India.";

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage = defaultOgImage,
  noIndex = false,
}: PageSeoOptions): Metadata {
  const canonical = absoluteUrl(path);
  const mergedKeywords = Array.from(new Set([...keywords, ...siteKeywords]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName,
      title: shareCardTitle,
      description: shareCardDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareCardTitle,
      description: shareCardDescription,
      images: [ogImage.url],
    },
    robots: noIndex || isPreviewDeployment
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "HomeAndConstructionBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl("/logo.png"),
    image: defaultOgImage.url,
    description:
      "Premium turnkey execution partner for high-value residential and commercial developments across India since 1979.",
    email: companyEmail,
    telephone: companyPhone.display,
    foundingDate: "1979",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: companyAddress.line1,
      addressLocality: "Kolkata",
      postalCode: "700016",
      addressRegion: "West Bengal",
      addressCountry: "IN",
    },
    hasMap: companyAddress.mapsUrl,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: companyPhone.display,
      email: companyEmail,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: "English",
    },
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    description: siteTagline,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

export function createWebPageSchema({
  name,
  description,
  path,
  type = "WebPage",
}: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "CollectionPage";
}) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}/#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en-IN",
  };
}

export function createServicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Turnkey construction and interior execution services",
    itemListElement: [
      "Construction & Structural Execution",
      "Engineering & Systems Integration",
      "Materials, Finishes & Installations",
      "Lifestyle & Luxury Integrations",
      "Global Sourcing & High-End Procurement",
      "Prefab & Advanced Build Systems",
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "India" },
      },
    })),
  };
}

export function createFaqSchema(items: typeof faqs = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createBreadcrumbSchema(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | ${siteTagline}`,
    template: `%s | ${siteName}`,
  },
  description:
    "Premium turnkey execution partner for high-value residential and commercial developments across India. Construction, engineering, global sourcing, and lifestyle integrations — delivered end-to-end since 1979.",
  keywords: siteKeywords,
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "construction",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName,
    title: `${siteName} | ${siteTagline}`,
    description:
      "Premium turnkey execution partner for high-value residential and commercial developments across India.",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | ${siteTagline}`,
    description:
      "Premium turnkey execution partner for high-value residential and commercial developments across India.",
    images: [defaultOgImage.url],
  },
  robots: isPreviewDeployment
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
  ...(process.env.GOOGLE_SITE_VERIFICATION || process.env.BING_SITE_VERIFICATION
    ? {
        verification: {
          ...(process.env.GOOGLE_SITE_VERIFICATION
            ? { google: process.env.GOOGLE_SITE_VERIFICATION }
            : {}),
          ...(process.env.BING_SITE_VERIFICATION
            ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
            : {}),
        },
      }
    : {}),
};
