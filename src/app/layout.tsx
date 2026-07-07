import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Fira_Sans,
  Host_Grotesk,
} from "next/font/google";
import { JsonLd } from "@/components/seo/JsonLd";
import { notoSerif } from "@/lib/fonts";
import {
  createOrganizationSchema,
  createWebSiteSchema,
  rootMetadata,
} from "@/lib/seo";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-host-grotesk",
  display: "swap",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fira-sans",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${dmSans.variable} ${hostGrotesk.variable} ${firaSans.variable} ${notoSerif.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">
        <JsonLd data={[createOrganizationSchema(), createWebSiteSchema()]} />
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
