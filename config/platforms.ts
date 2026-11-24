// Every place Ehis can be found. Handles and links are placeholders until filled in.
//
// status "yours"     = a platform you told me you are on (shown large).
// status "suggested" = a platform that would strengthen your profile; delete any
//                      you don't use, and give the ones you do a `url`.

export type PlatformCategory =
  | "Professional"
  | "Writing"
  | "Video & social"
  | "Code & competitions"
  | "Research"
  | "Community";

export interface Platform {
  id: string;
  name: string;
  /** Key into the icon map on the Platforms page. */
  icon: string;
  category: PlatformCategory;
  status: "yours" | "suggested";
  handle: string;
  /** What a visitor will find there. */
  blurb: string;
  /** Leave empty until the real profile link exists. */
  url?: string;
}

export const platforms: Platform[] = [
  // ───────── Confirmed ─────────
  { id: "linkedin", name: "LinkedIn", icon: "linkedin", category: "Professional", status: "yours", handle: "your-name", blurb: "Career history, roles and professional updates." },
  { id: "x", name: "X", icon: "x", category: "Video & social", status: "yours", handle: "@your-handle", blurb: "Quick takes on AI, football analytics and builds." },
  { id: "substack", name: "Substack", icon: "substack", category: "Writing", status: "yours", handle: "your-newsletter", blurb: "Longer writing and the newsletter." },
  { id: "facebook", name: "Facebook", icon: "facebook", category: "Video & social", status: "yours", handle: "your.name", blurb: "Personal updates and community." },
  { id: "leetcode", name: "LeetCode", icon: "leetcode", category: "Code & competitions", status: "yours", handle: "your-username", blurb: "Problem-solving practice and contest history." },

  // ───────── Suggested placeholders ─────────
  { id: "github", name: "GitHub", icon: "github", category: "Professional", status: "suggested", handle: "ehis04", url: "https://github.com/ehis04", blurb: "Code, models and open-source work." },
  { id: "calendly", name: "Booking", icon: "calendly", category: "Professional", status: "suggested", handle: "cal link", blurb: "Book a call or intro chat." },
  { id: "medium", name: "Medium", icon: "medium", category: "Writing", status: "suggested", handle: "@your-handle", blurb: "Articles cross-posted for a wider audience." },
  { id: "youtube", name: "YouTube", icon: "youtube", category: "Video & social", status: "suggested", handle: "Channel name", blurb: "Football analytics, builds and explainers." },
  { id: "instagram", name: "Instagram", icon: "instagram", category: "Video & social", status: "suggested", handle: "@your-handle", blurb: "Photos, clips and behind-the-scenes." },
  { id: "tiktok", name: "TikTok", icon: "tiktok", category: "Video & social", status: "suggested", handle: "@your-handle", blurb: "Short-form football and AI clips." },
  { id: "threads", name: "Threads", icon: "threads", category: "Video & social", status: "suggested", handle: "@your-handle", blurb: "Conversations alongside Instagram." },
  { id: "bluesky", name: "Bluesky", icon: "bluesky", category: "Video & social", status: "suggested", handle: "you.bsky.social", blurb: "Where much of the AI and research crowd now posts." },
  { id: "kaggle", name: "Kaggle", icon: "kaggle", category: "Code & competitions", status: "suggested", handle: "your-username", blurb: "Notebooks, datasets and competition rankings." },
  { id: "huggingface", name: "Hugging Face", icon: "huggingface", category: "Code & competitions", status: "suggested", handle: "your-username", blurb: "Models and demos you have published." },
  { id: "stackoverflow", name: "Stack Overflow", icon: "stackoverflow", category: "Code & competitions", status: "suggested", handle: "your-profile", blurb: "Answers and reputation as a developer." },
  { id: "hackerrank", name: "HackerRank", icon: "hackerrank", category: "Code & competitions", status: "suggested", handle: "your-username", blurb: "Skill badges and certifications." },
  { id: "devpost", name: "Devpost", icon: "devpost", category: "Code & competitions", status: "suggested", handle: "your-username", blurb: "Hackathon projects, including the datathon." },
  { id: "scholar", name: "Google Scholar", icon: "scholar", category: "Research", status: "suggested", handle: "Your profile", blurb: "Papers and citation counts." },
  { id: "orcid", name: "ORCID", icon: "orcid", category: "Research", status: "suggested", handle: "0000-0000-0000-0000", blurb: "A permanent researcher ID linking your work." },
  { id: "researchgate", name: "ResearchGate", icon: "researchgate", category: "Research", status: "suggested", handle: "Your-Name", blurb: "Preprints and research updates." },
  { id: "discord", name: "Discord", icon: "discord", category: "Community", status: "suggested", handle: "your-server", blurb: "A community for your channel or project." },
  { id: "spotify", name: "Spotify", icon: "spotify", category: "Community", status: "suggested", handle: "Show name", blurb: "A podcast or audio version of your videos." },
];

export const categoryOrder: PlatformCategory[] = [
  "Professional",
  "Writing",
  "Video & social",
  "Code & competitions",
  "Research",
  "Community",
];
