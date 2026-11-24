// Interactive CV: clickable regions laid over the two CV page images in /public/cv.
// Rectangles are percentages of the page (x, y, width, height), measured from the
// text positions in the PDF. The content shown when a region opens comes from
// config/studio.ts (experiences, projects, degrees, skills), so it stays in sync.

export type CvKind = "education" | "experience" | "project" | "skills";

export interface CvHotspot {
  id: string;
  page: 1 | 2;
  rect: { x: number; y: number; w: number; h: number };
  kind: CvKind;
  /** id of the matching entry in config/studio.ts (a degree id, experience id or project id). */
  ref: string;
}

export const cvPdf = "/cv/Ehis-Oghina-CV.pdf";
export const cvPages = ["/cv/page-1.webp", "/cv/page-2.webp"] as const;

export const cvHotspots: CvHotspot[] = [
  { id: "edu-birmingham", page: 1, rect: { x: 6.72, y: 12.65, w: 86.68, h: 5.58 }, kind: "education", ref: "msc" },
  { id: "edu-dcu", page: 1, rect: { x: 6.72, y: 18.47, w: 86.68, h: 7.25 }, kind: "education", ref: "bsc" },
  { id: "exp-nlp", page: 1, rect: { x: 6.72, y: 28.57, w: 86.68, h: 11.4 }, kind: "experience", ref: "nlp-researcher" },
  { id: "exp-optum", page: 1, rect: { x: 6.72, y: 40.27, w: 86.68, h: 14.13 }, kind: "experience", ref: "optum" },
  { id: "exp-rv", page: 1, rect: { x: 6.72, y: 54.64, w: 86.68, h: 12.83 }, kind: "experience", ref: "rv-uncovered" },
  { id: "exp-epam", page: 1, rect: { x: 6.72, y: 67.7, w: 86.68, h: 12.71 }, kind: "experience", ref: "epam" },
  { id: "exp-dcu", page: 1, rect: { x: 6.72, y: 80.65, w: 86.68, h: 11.4 }, kind: "experience", ref: "dcu-soccer" },
  { id: "proj-lbl", page: 2, rect: { x: 6.72, y: 7.42, w: 86.68, h: 11.82 }, kind: "project", ref: "little-by-little" },
  { id: "proj-trivium", page: 2, rect: { x: 6.72, y: 19.48, w: 86.68, h: 14.73 }, kind: "project", ref: "trivium" },
  { id: "proj-so", page: 2, rect: { x: 6.72, y: 34.33, w: 86.68, h: 13.18 }, kind: "project", ref: "social-olympics" },
  { id: "proj-xgg", page: 2, rect: { x: 6.72, y: 47.75, w: 86.68, h: 14.61 }, kind: "project", ref: "xggaffer" },
  { id: "proj-frd", page: 2, rect: { x: 6.72, y: 62.24, w: 86.68, h: 10.33 }, kind: "project", ref: "financial-risk-dashboard" },
  { id: "skills", page: 2, rect: { x: 6.72, y: 73.29, w: 86.68, h: 12.0 }, kind: "skills", ref: "skills" },
];

/** Extra links offered when a region is opened (internal pages stay in the same tab). */
export const cvLinks: Record<string, { label: string; href: string }[]> = {
  "nlp-researcher": [{ label: "See it on the Experience page", href: "/experience" }, { label: "Research", href: "/research" }],
  "rv-uncovered": [{ label: "See it on the Experience page", href: "/experience" }],
  optum: [{ label: "See it on the Experience page", href: "/experience" }],
  epam: [{ label: "See it on the Experience page", href: "/experience" }],
  "dcu-soccer": [{ label: "See it on the Experience page", href: "/experience" }],
  msc: [{ label: "Ask the assistant about my studies", href: "/ask" }],
  bsc: [{ label: "Ask the assistant about my studies", href: "/ask" }],
  skills: [{ label: "See the projects that use these", href: "/projects" }],
  // Projects: the repo button is added automatically when a project has one.
  xggaffer: [{ label: "Open on the Projects page", href: "/projects" }, { label: "Ask the assistant about it", href: "/ask" }],
  trivium: [{ label: "Open on the Projects page", href: "/projects" }, { label: "Research", href: "/research" }],
  "social-olympics": [{ label: "Open on the Projects page", href: "/projects" }],
  "little-by-little": [{ label: "Open on the Projects page", href: "/projects" }],
  "financial-risk-dashboard": [{ label: "Open on the Projects page", href: "/projects" }],
};
