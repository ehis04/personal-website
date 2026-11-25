import "./studio.css";

import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";

import { StudioNav } from "@/components/studio/nav";
import { SiteFooter } from "@/components/studio/site-footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "700", // the display face is only ever used bold; a single weight is a much smaller file
  variable: "--font-display",
  display: "swap",
});

const accent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-accent",
  display: "swap",
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`studio font-sans ${display.variable} ${accent.variable}`}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <StudioNav />
      {children}
      <SiteFooter />
    </div>
  );
}
