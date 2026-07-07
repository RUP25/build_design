import { Noto_Serif } from "next/font/google";

export const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-noto-serif",
  display: "swap",
});
