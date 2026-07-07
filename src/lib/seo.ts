import type { Metadata } from "next";
import {
  companyAddress,
  companyEmail,
  companyPhone,
  faqs,
} from "@/lib/content";
import {
  defaultOgImage,
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
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage.url],
    },
    robots: noIndex
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
    logo: absoluteUrl("/icon.png"),
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
    sameAs: [companyAddress.mapsUrl],
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
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "construction",
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
  robots: {
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
