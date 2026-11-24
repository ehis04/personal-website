// Every place Ehis can be found.
//
// The five MAIN places (LinkedIn, YouTube, GitHub, Substack, X) are picked in
// app/(site)/platforms/page.tsx; everything else appears under "More places".
// `handle` is what visitors see; `url` makes the tile a link. A tile with no `url`
// shows the handle only (set `handleOnly` for a username such as Discord).

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
  handle: string;
  /** What a visitor will find there. */
  blurb: string;
  /** The profile link. Leave unset when there is none yet. */
  url?: string;
  /** True when the handle is a username to copy (for example Discord), not a link. */
  handleOnly?: boolean;
}

export const platforms: Platform[] = [
  { id: "linkedin", name: "LinkedIn", icon: "linkedin", category: "Professional", handle: "ehisoghina", url: "https://www.linkedin.com/in/ehisoghina", blurb: "Career history, roles and professional updates." },
  { id: "x", name: "X", icon: "x", category: "Video & social", handle: "@ehis_oghina", url: "https://x.com/ehis_oghina", blurb: "Quick takes on AI, football analytics and builds." },
  { id: "substack", name: "Substack", icon: "substack", category: "Writing", handle: "ehisoghina", url: "https://ehisoghina.substack.com", blurb: "Longer writing and the newsletter." },
  { id: "github", name: "GitHub", icon: "github", category: "Professional", handle: "ehis04", url: "https://github.com/ehis04", blurb: "Code, models and open-source work." },
  { id: "youtube", name: "YouTube", icon: "youtube", category: "Video & social", handle: "@manehis21", url: "https://www.youtube.com/@manehis21", blurb: "Football analytics, builds and explainers." },

  { id: "facebook", name: "Facebook", icon: "facebook", category: "Video & social", handle: "ehis.oghina.71", url: "https://www.facebook.com/ehis.oghina.71", blurb: "Personal updates and community." },
  { id: "leetcode", name: "LeetCode", icon: "leetcode", category: "Code & competitions", handle: "eo4", url: "https://leetcode.com/u/eo4/", blurb: "Problem-solving practice and contest history." },
  { id: "calendly", name: "Booking", icon: "calendly", category: "Professional", handle: "calendly.com/ehisoghina", url: "https://calendly.com/ehisoghina", blurb: "Book a call or intro chat." },
  { id: "medium", name: "Medium", icon: "medium", category: "Writing", handle: "@ehisoghina", url: "https://medium.com/@ehisoghina", blurb: "Articles cross-posted for a wider audience." },
  { id: "instagram", name: "Instagram", icon: "instagram", category: "Video & social", handle: "@manehis21", url: "https://www.instagram.com/manehis21/", blurb: "Photos, clips and behind-the-scenes." },
  { id: "tiktok", name: "TikTok", icon: "tiktok", category: "Video & social", handle: "@manehis21", url: "https://www.tiktok.com/@manehis21", blurb: "Short-form football and AI clips." },
  { id: "threads", name: "Threads", icon: "threads", category: "Video & social", handle: "@manehis21", url: "https://www.threads.com/@manehis21", blurb: "Conversations alongside Instagram." },
  { id: "bluesky", name: "Bluesky", icon: "bluesky", category: "Video & social", handle: "ehisoghina.bsky.social", url: "https://bsky.app/profile/ehisoghina.bsky.social", blurb: "Where much of the AI and research crowd now posts." },
  { id: "kaggle", name: "Kaggle", icon: "kaggle", category: "Code & competitions", handle: "ehisoghina", url: "https://www.kaggle.com/ehisoghina", blurb: "Notebooks, datasets and competition rankings." },
  { id: "huggingface", name: "Hugging Face", icon: "huggingface", category: "Code & competitions", handle: "ehisoghina", url: "https://huggingface.co/ehisoghina", blurb: "Models and demos I have published." },
  { id: "stackoverflow", name: "Stack Overflow", icon: "stackoverflow", category: "Code & competitions", handle: "ehis-oghina", url: "https://stackoverflow.com/users/33337372/ehis-oghina", blurb: "Answers and reputation as a developer." },
  { id: "hackerrank", name: "HackerRank", icon: "hackerrank", category: "Code & competitions", handle: "ehisoghina", url: "https://www.hackerrank.com/profile/ehisoghina", blurb: "Skill badges and certifications." },
  { id: "devpost", name: "Devpost", icon: "devpost", category: "Code & competitions", handle: "ehisoghina", url: "https://devpost.com/ehisoghina", blurb: "Hackathon projects, including the datathon." },
  // No url yet: a Scholar profile link looks like https://scholar.google.com/citations?user=XXXX
  // and only exists after the profile is created (it also needs a verified university email to
  // appear in Scholar search).
  { id: "scholar", name: "Google Scholar", icon: "scholar", category: "Research", handle: "ehisoghina", blurb: "Papers and citation counts." },
  { id: "orcid", name: "ORCID", icon: "orcid", category: "Research", handle: "0009-0007-8250-3339", url: "https://orcid.org/0009-0007-8250-3339", blurb: "A permanent researcher ID linking my work." },
  { id: "researchgate", name: "ResearchGate", icon: "researchgate", category: "Research", handle: "Ehis-Oghina", url: "https://www.researchgate.net/profile/Ehis-Oghina", blurb: "Preprints and research updates." },
  { id: "discord", name: "Discord", icon: "discord", category: "Community", handle: "ehis_73189", url: "https://discord.com/users/1548391032788361308", blurb: "Follow me and say hi on Discord." },
  { id: "spotify", name: "Spotify", icon: "spotify", category: "Community", handle: "ehismode", url: "https://open.spotify.com/user/ehismode", blurb: "A podcast or audio version of my videos." },
];

export const categoryOrder: PlatformCategory[] = [
  "Professional",
  "Writing",
  "Video & social",
  "Code & competitions",
  "Research",
  "Community",
];
