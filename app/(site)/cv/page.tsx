import { Download, MousePointerClick } from "lucide-react";

import { AnimatedHeading } from "@/components/studio/animated-heading";
import { CvViewer } from "@/components/studio/cv-viewer";
import { cvPdf } from "@/config/cv";

export const metadata = {
  title: "CV",
  description: "Ehis Oghina's CV: hover a section to highlight it, click to expand the full detail.",
  alternates: { canonical: "/cv" },
};

export default function CvPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-3 pb-6 pt-24">
      <div className="flex flex-wrap items-end justify-between gap-5 px-2 pb-6">
        <div>
          <p className="legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]">Curriculum vitae</p>
          <AnimatedHeading
            as="h1"
            text="My *CV*"
            wordClassName="text-extrude"
            className="font-display mt-2 text-5xl leading-[0.95] md:text-7xl"
          />
          <p className="mt-4 flex max-w-xl items-start gap-2 text-[15px] text-white/75">
            <MousePointerClick className="mt-0.5 h-5 w-5 shrink-0 text-[#46b07a]" />
            Hover over any section to highlight it, then click to open the full detail, with links to the related
            pages.
          </p>
        </div>
        <a
          href={cvPdf}
          download
          className="inline-flex items-center gap-2 rounded-full bg-[#2f7d50] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#46b07a]"
        >
          <Download className="h-4 w-4" /> Download PDF
        </a>
      </div>
      <CvViewer />
    </div>
  );
}
