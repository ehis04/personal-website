// Site content.
//
// REAL (from Ehis's CV, CV1126): profile, degrees, experiences, studioProjects.
// PLACEHOLDER (nothing provided yet, not factual): papers, videos, socials, and the
// photos/clips used as images. Replace those as real material arrives.

export const profile = {
  name: "Ehis Oghina",
  mainRole: "AI Engineer",
  education: ["BSc Computer Science", "MSc Artificial Intelligence"],
  otherRoles: ["Data Scientist", "Software Engineer", "Football Analyst", "Creator", "Builder"],
};

export interface Degree {
  degree: string;
  school: string;
  city: string;
  period: string;
  note?: string;
}

// Most recent first.
export const degrees: Degree[] = [
  {
    degree: "MSc Artificial Intelligence",
    school: "University of Birmingham",
    city: "Birmingham",
    period: "Sep 2026 – Sep 2027",
  },
  {
    degree: "BSc (Honours) Computer Science",
    school: "Dublin City University",
    city: "Dublin",
    period: "Aug 2022 – May 2026",
    note: "Key modules: Artificial Intelligence, Advanced Algorithms, Probability & Statistics, Linear Algebra.",
  },
];

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  tags: string[];
  image: string;
  imagePosition: string;
  /** Up to three headline numbers, taken from the CV. Omit when the CV has none. */
  metrics?: { value: string; label: string }[];
}

// Most recent start first. Images are placeholders (the user's own photos).
export const experiences: Experience[] = [
  {
    id: "nlp-researcher",
    company: "University of Birmingham",
    role: "NLP Researcher",
    period: "Sep 2026 — Now",
    location: "Birmingham",
    summary:
      "Research team member at the NLP Research Group, working on SemEval 2027: cross-lingual alignment and activation steering for large language models.",
    highlights: [
      "Selected to join a university research team participating in SemEval 2027, investigating cross-lingual alignment and activation steering techniques for large language models.",
      "Contributing to collaborative NLP research on multilingual language generation, model interpretability and evaluation of language-steering methods.",
    ],
    tags: ["NLP", "LLMs", "Interpretability", "SemEval 2027"],
    image: "/media/photo-3.jpg",
    imagePosition: "50% 22%",
  },
  {
    id: "rv-uncovered",
    company: "R.V. Uncovered",
    role: "Founder & Lead Engineer",
    period: "Jun 2026 — Now",
    location: "Birmingham",
    summary:
      "An independent football analytics venture that adjusts player and team metrics for match context and exposes misleading headline statistics.",
    highlights: [
      "Founded a football analytics platform that adjusts player and team metrics for match context, including game state, red cards, substitutions and injuries. Exposes misleading headline statistics such as raw xG and distance covered.",
      "Designing a tool-calling LLM agent that answers natural-language football questions with grounded data, visualisations and caveats.",
      "Developing a computer-vision pipeline using pitch calibration, player tracking and shirt-number identification to generate tracking data from amateur match footage.",
    ],
    tags: ["Football analytics", "LLM agents", "Computer vision", "Tracking data"],
    image: "/media/photo-2.jpg",
    imagePosition: "50% 40%",
  },
  {
    id: "optum",
    company: "Optum, UnitedHealthCare",
    role: "Software Engineer / Data Scientist",
    period: "Apr 2025 — Oct 2025",
    location: "Dublin",
    summary:
      "Built a Snowflake-backed analytics platform that cut manual reporting by seven hours a week, and improved data quality across large pharmaceutical datasets.",
    highlights: [
      "Built a Snowflake-backed Dash analytics platform for real-time exploration of application performance and analytics trends. Reduced manual reporting effort by seven hours per week (70%) and supported Team Leaders and Data Analysts with custom filtering, query execution and visual dashboards.",
      "Implemented RapidFuzz-based string matching across large pharmaceutical datasets to flag inconsistent, duplicate or mismatched records, improving data quality by 56%.",
      "Led stakeholder meetings across business and engineering teams, translating requirements into Databricks and Snowflake deliverables, including waste analysis reports.",
    ],
    tags: ["Snowflake", "Dash", "Databricks", "RapidFuzz", "Python"],
    metrics: [
      { value: "7 hrs", label: "Saved per week" },
      { value: "70%", label: "Less manual reporting" },
      { value: "56%", label: "Data quality gain" },
    ],
    image: "/media/photo-1.jpg",
    imagePosition: "50% 4%",
  },
  {
    id: "epam",
    company: "EPAM Systems",
    role: "Software Engineering Associate",
    period: "Jan 2025 — May 2025",
    location: "Dublin",
    summary:
      "Prototyped Raspberry Pi IoT automation systems in Python, with sensor control, cloud sync and live data visualisation.",
    highlights: [
      "Prototyped Raspberry Pi-based IoT automation systems in Python, implementing GPIO sensor control and cloud API synchronisation to support real-time device monitoring and automated data capture.",
      "Built lightweight data pipelines on embedded Linux using Pandas, Matplotlib and Dash to collect, process and visualise sensor data.",
      "Supported testing, documentation and prototype refinement in agile workflows to improve reliability and maintainability.",
    ],
    tags: ["Python", "Raspberry Pi", "IoT", "Pandas", "Dash"],
    image: "/media/talk-a.jpg",
    imagePosition: "50% 30%",
  },
  {
    id: "dcu-soccer",
    company: "DCU Soccer",
    role: "IT Specialist, Club Chairperson",
    period: "Aug 2022 — Jun 2026",
    location: "Dublin City University",
    summary:
      "Chaired and ran IT for a university football club of 500+ members: budgets, fixtures, events and communication.",
    highlights: [
      "Managed day-to-day operations for a university football club with 500+ members, overseeing budgeting, fixture coordination, event planning and communication with DCU Athletics and external clubs.",
      "Managed club IT infrastructure and internal communication systems, improving coordination and reducing reliance on manual messaging and fragmented administration.",
    ],
    tags: ["Leadership", "Operations", "IT", "Football"],
    metrics: [{ value: "500+", label: "Club members" }],
    image: "/media/photo-5.jpg",
    imagePosition: "50% 30%",
  },
];

export type StudioMedia =
  | { kind: "image"; src: string; position?: string; zoom?: number }
  | { kind: "video"; src: string; poster: string };

export interface StudioProject {
  id: string;
  title: string;
  kicker: string;
  description: string;
  /** Shown in the detail panel as the project's status line. */
  status: string;
  tags: string[];
  media: StudioMedia;
  /** Public GitHub repo, when one exists. No project is hosted yet, so there is no demo link. */
  repo?: string;
}

// The first project is the flagship. Media is placeholder (the user's own clips and photos).
// None of these are hosted yet; add a `demo` link when that changes.
export const studioProjects: StudioProject[] = [
  {
    id: "xggaffer",
    title: "xgGaffer",
    kicker: "Sports analytics platform",
    description:
      "A football analytics platform across five European leagues, built on an ML pipeline that scraped 43,000+ matches and 64,000+ player records. 86+ engineered features feed seven models covering match outcomes, scorelines, season simulation, injury risk, tactics and lineups. A deterministic natural-language query pipeline classifies 16 intent types and routes them to the ML engines, with Claude Haiku used only as a grounded formatter. Includes role-based tools for coaches, referees, players and fans.",
    status: "Aug 2025 – May 2026",
    tags: ["Python", "Django", "React", "TypeScript", "PostgreSQL", "Scikit-learn"],
    media: { kind: "video", src: "/media/gym-a.mp4", poster: "/media/gym-a.jpg" },
    repo: "https://github.com/ehis04/xggaffer",
  },
  {
    id: "trivium",
    title: "Trivium",
    kicker: "Tournament analytics",
    description:
      "A football analytics pipeline on match event and tracking data from the FIFA U-17 World Cups 2025 (men's and women's). Three team scores (dominance, efficiency, resourcefulness) are standardised within each tournament and measured against a pre-tournament Elo expectation, to find which tactical profiles take teams further than their strength predicts. A Streamlit dashboard offers team reports, match reviews and a coach scouting view, with a natural-language query box that sends only aggregated results to the Claude API.",
    status: "Sep 2026 – Nov 2026",
    tags: ["Python", "Pandas", "DuckDB", "Scikit-learn", "Statsmodels", "Streamlit", "Plotly"],
    media: { kind: "video", src: "/media/talk-a.mp4", poster: "/media/talk-a.jpg" },
    repo: "https://github.com/ehis04/trivium",
  },
  {
    id: "social-olympics",
    title: "Social Olympics",
    kicker: "Competition platform",
    description:
      "A cross-platform web and mobile app for running custom Olympic-style competitions. Types, validation, scoring logic and UI packages are shared between Next.js and React Native (Expo) clients in a Turborepo monorepo on a Supabase backend. A configurable scoring engine covers a 52-event library in 16 categories, with tiered placement points, event weight multipliers (0.5× to 3×), best-of-N selection, MVP bonuses, multi-stage tiebreakers and snake-draft team balancing from peer-voted strength ratings.",
    status: "Jun 2026 – Oct 2026",
    tags: ["TypeScript", "Next.js", "React Native", "Expo", "Supabase", "PostgreSQL"],
    media: { kind: "video", src: "/media/gym-b.mp4", poster: "/media/gym-b.jpg" },
    repo: "https://github.com/ehis04/social-olympics",
  },
  {
    id: "little-by-little",
    title: "Little by Little",
    kicker: "Grocery optimisation",
    description:
      "A full-stack web app, in progress, that helps Irish households decide where and how to do their weekly grocery shop. It compares single-store and split-shop plans across major supermarkets while accounting for loyalty vouchers, travel cost and time, and returns the Cheapest, Fastest and most Balanced options with a store-by-store checklist. A deterministic optimisation engine handles pricing, voucher eligibility and product matching; an LLM only parses shopping lists and explains recommendations in plain language.",
    status: "Oct 2026 – Present",
    tags: ["Python", "FastAPI", "PostgreSQL", "OR-Tools", "TypeScript", "React", "LLM API"],
    media: { kind: "image", src: "/media/photo-3.jpg", position: "50% 22%" },
  },
  {
    id: "financial-risk-dashboard",
    title: "Financial Risk Dashboard",
    kicker: "Risk analytics",
    description:
      "A Django application that cleans historical market data with Pandas and NumPy and computes portfolio-level risk metrics, presenting risk trends and portfolio performance through interactive Matplotlib and Seaborn visualisations. Scikit-learn models were trained to predict Value at Risk (VaR) and volatility patterns, reaching 82% accuracy across a 5-year historical dataset.",
    status: "Nov 2024 – Feb 2025",
    tags: ["Python", "Django", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"],
    media: { kind: "image", src: "/media/photo-2.jpg", position: "50% 35%" },
  },
];

// ───────── Research & socials (placeholder content: nothing provided yet) ─────────

export interface Paper {
  id: string;
  title: string;
  venue: string;
  year: string;
  abstract: string;
  tags: string[];
  /** Where to read more (a public repo or paper). Omit while there is nothing public. */
  href?: string;
  /** Short status shown on the button when there is no link. */
  status: string;
}

// Real research activity from the CV and the public repos. No published papers yet.
export const papers: Paper[] = [
  {
    id: "semeval-2027",
    title: "Cross-lingual alignment & activation steering for LLMs",
    venue: "SemEval 2027 · University of Birmingham NLP Research Group",
    year: "2026 – now",
    abstract:
      "Part of a university research team taking part in SemEval 2027, investigating cross-lingual alignment and activation steering techniques for large language models, with a focus on multilingual generation, interpretability and evaluating language-steering methods.",
    tags: ["NLP", "LLMs", "Interpretability"],
    status: "In progress",
  },
  {
    id: "trivium",
    title: "Tournament pathways: tactical profiles at the FIFA U-17 World Cups 2025",
    venue: "Trivium · independent project",
    year: "2026",
    abstract:
      "Why do some teams go further than their strength predicts? Three standardised team scores, measured against a pre-tournament Elo expectation, identify which tactical profiles overperform.",
    tags: ["Football analytics", "Tracking data"],
    href: "https://github.com/ehis04/trivium",
    status: "Code on GitHub",
  },
  {
    id: "xggaffer",
    title: "xgGaffer: football analytics and coaching platform",
    venue: "Final-year project · Dublin City University",
    year: "2026",
    abstract:
      "Seven ML models over 43,000+ matches covering outcomes, scorelines, season simulation, injury risk, tactics and lineups, behind a grounded natural-language query pipeline.",
    tags: ["Machine learning", "Sports analytics"],
    href: "https://github.com/ehis04/xggaffer",
    status: "Code on GitHub",
  },
];

export interface VideoItem {
  id: string;
  title: string;
  meta: string;
  /** An 11-character YouTube video ID. Leave empty until the real video exists. */
  youtubeId?: string;
  poster: string;
}

export const videos: VideoItem[] = [
  { id: "v1", title: "Video title placeholder", meta: "Placeholder · football analytics", poster: "/media/talk-a.jpg" },
  { id: "v2", title: "Second video placeholder", meta: "Placeholder · build log", poster: "/media/photo-2.jpg" },
  { id: "v3", title: "Third video placeholder", meta: "Placeholder · explainer", poster: "/media/photo-5.jpg" },
  { id: "v4", title: "Fourth video placeholder", meta: "Placeholder · talk", poster: "/media/photo-3.jpg" },
];

export const socials = [
  { id: "youtube", name: "YouTube", handle: "Channel name", note: "Football analytics and builds" },
  { id: "github", name: "GitHub", handle: "ehis04", note: "Code and models" },
  { id: "linkedin", name: "LinkedIn", handle: "Profile", note: "Work and updates" },
  { id: "newsletter", name: "Newsletter", handle: "Subscribe", note: "New posts, in your inbox" },
] as const;
