import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Fira_Sans,
  Host_Grotesk,
} from "next/font/google";
import { notoSerif } from "@/lib/fonts";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-host-grotesk",
  display: "swap",
});

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Build Design Projects | One-Stop Turnkey Execution Since 1979",
  description:
    "Premium turnkey execution partner for high-value residential and commercial developments across India. Construction, engineering, global sourcing, and lifestyle integrations — delivered end-to-end.",
  keywords: [
    "turnkey construction",
    "luxury residential",
    "commercial execution",
    "Build Design Projects",
    "India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${hostGrotesk.variable} ${firaSans.variable} ${notoSerif.variable}`}
    >
      <body className="antialiased">
        {children}
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
