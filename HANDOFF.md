# HANDOFF: Ehis Oghina personal website redesign

> Written 2026-11-24 by the previous Claude Code session so a fresh session can continue with zero lost context.
> Read this whole file before touching anything. Then follow **Section 14 (Do this first)**.
> Project root: `/home/eo4/projects/personal_website/minimal-next-portfolio` (git repo, branch `redesign-prototype`).

---

> ## UPDATE 2026-11-26 (placeholder video swapped; history cleaned). Newest note.
> - The gym clips (`gym-a`, `gym-b`) were removed and replaced with `mic-a` / `mic-b`, cut from the user's `ideas/DJI_20260616135203_0149_D.MP4` (starts 238 s and 213.5 s). Video media now takes an optional `position` (CSS object-position) so the face stays in frame in wide tiles. Still placeholders.
> - The user ran the history rewrite: `main` holds only their own commits; `master` and `redesign-prototype` are deleted (full backup bundle is in the parent folder, not in git). Open Dependabot PRs predate the rewrite: do not merge them as they are.

> ## UPDATE 2026-11-25 (more natural voice). Newest note.
> - The user found the Aura-1 voice broken up and robotic. `/api/speak` now uses `@cf/deepgram/aura-2-en`; the voice list, default (Draco) and pronunciation fixes (`forSpeech`) live in `config/voices.ts`, shared by page and Worker. Previews are static files in `public/media/voices/` (`scripts/make-voice-samples.sh`), so trying voices uses no allowance (previewing 12 voices used to hit the per-visitor limit and drop to the robot device voice). Aura-2 costs twice as much: the free 10,000 neurons/day is about 3,600 characters, roughly 15 spoken answers, then the device voice. Caps: 12 per IP per 10 min, 60 per day. Privacy page mentions the speech processing.
> - The user confirmed the Cloudflare security steps are done and that the AI-crawler rules are fine as they are.

> ## UPDATE 2026-11-25 (user's 7-point review + security + search pass). 
> - **Footer:** removed "Built with Next.js / Hosted on Cloudflare"; now "(c) 2026 Ehis Oghina. All rights reserved." + Privacy link.
> - **Ask page:** the assistant now answers in the FIRST person but still says plainly it is an AI that speaks for Ehis if asked (system prompt in `config/knowledge.ts`; UI copy "Ask me about my work", "an AI assistant that answers in my voice"). The prompt gets today's date and request-time wording for the MSc/BSc (`{{msc}}`/`{{bsc}}` placeholders; a Worker's clock is unreliable at startup, so never compute dates at module level). **Voice:** new `/api/speak` (Workers AI `@cf/deepgram/aura-1`, 12 voices, mp3) with a voice picker, Preview button and speed slider (saved in localStorage); falls back to the best installed device voice when over the free allowance (10,000 neurons/day ~ 7,000 characters ~ 30 answers; on the Free plan it errors and never charges). Server caps: 500 chars/request, 8 per IP per 10 min, 30 per day. Needs the `ai` binding in `wrangler.jsonc`.
> - **Projects page:** subheading "Investigate the public projects in more detail...", a slider above the strip (appears only when cards overflow, mirrors and drives the strip scroll), more space above the footer. **Dialogs** (experience, project, CV) now render through `components/studio/dialog-portal.tsx` into the `.studio` wrapper so they sit above the footer (the footer used to paint over an open card because the page content has its own stacking context).
> - **Experience covers:** a cover is now either a real picture or a PLAYING clip (`Experience.video` -> `LazyVideo`); never a frozen video frame. EPAM no longer uses a webcam poster (now `grad-crop.jpg`).
> - **Security:** `public/_headers` now sends a Content-Security-Policy (self-only; inline scripts/styles allowed because Next's static export needs them; frame-src youtube-nocookie for future videos), X-Frame-Options DENY, COOP same-origin, tighter Permissions-Policy, and CORP same-site on /media and /cv (anti-hotlinking); PDFs carry no CSP (it can break the PDF viewer). API: browsers from other websites are refused (Origin allow-list), JSON content-type required, Cloudflare's per-IP burst limiter (`ratelimits` binding `API_LIMITER`, 12/min) plus the existing per-IP and daily caps. `robots.txt` turns away AI-TRAINING crawlers (GPTBot, ClaudeBot, anthropic-ai, CCBot, Google-Extended, Applebot-Extended, Bytespider, Meta-ExternalAgent, cohere-ai, Diffbot, ImagesiftBot, omgili, Amazonbot) but not search engines or on-demand AI fetchers. **Email scraping:** the address never appears in the HTML/JS: the server sends it base64-encoded (`config/site.ts` is server-only; `navLinks` moved to `config/nav.ts`) and `components/studio/email-link.tsx` decodes it in the browser; no-JS visitors see "hello [at] ehisoghina.com". `.github/dependabot.yml` added.
> - **Search (SEO):** richer default title/description, JSON-LD `@graph` (Person with alumniOf/affiliation/worksFor/knowsAbout/sameAs, WebSite with alternateName) plus a `ProfilePage` on the home page, twitter creator, per-page descriptions for experience/projects/research/ask/platforms.
> - **Dashboard steps given to the user (cannot be done from code):** Bot Fight Mode, block AI scrapers (AI Crawl Control), Minimum TLS 1.2 (was 1.0), Hotlink Protection, optional WAF rate-limit rule on /api/*, DMARC TXT record, Bing Webmaster Tools, link to the site from every profile (the strongest ranking signal for name searches).

> ## UPDATE 2026-11-25 (Cloudflare edge settings done). Newest note.
> - The user set, and I verified live: Redirect Rule "Redirect from WWW to root" (301, path and query kept), **Always Use HTTPS** on (http -> https 301), **HSTS** on with max-age 15552000 (6 months), no includeSubDomains, no preload. Security headers from `public/_headers` appear once each. Site, assets and chat unaffected. Consider raising HSTS to 1 year after a few quiet weeks. The "still open for the user" item (1) and (2) in the previous note are now DONE; remaining: re-read Web Analytics in a few days, and the four content items in memory.

> ## UPDATE 2026-11-25 (final numbers after the static rebuild). Newest note.
> - **Live phone test (390x844, 4x CPU, 1.6 Mbps/150 ms), LCP before -> after:** Home 4.5 -> 1.9 s, Experience 4.6 -> 2.1 s, Projects 3.1 -> 1.6 s, Research 1.3 s, CV 5.0 -> 2.6 s, Ask 1.2 s, Platforms 1.4 s, paper page 1.3 s. CLS 0.000 everywhere. Desktop LCP 0.3 to 0.64 s. Server wait (TTFB minus TLS) median ~60 ms (was 159 ms uncached, worst 762 ms).
> - **Regression caught and fixed:** my nav fix used `scrollIntoView`, which made Chrome start Tab navigation after the active tab (first Tab skipped "Skip to content" and Home). Replaced by setting `scrollLeft` directly; verified live: Tab order = Skip to content > Ehis Oghina > Home > Experience.
> - **Still open for the user:** (1) Cloudflare Redirect Rule "Redirect from WWW to root" (a static site cannot redirect by host); (2) optional HSTS in SSL/TLS > Edge Certificates (the site sends no Strict-Transport-Security header; http already redirects to https); (3) re-read Cloudflare Web Analytics in a few days (INP had no data); (4) the four content items in memory (real photos/clips, YouTube videos, xgGaffer + demos, SSRN link then Scholar).
> - **QA tooling** (scratchpad, recreate when needed): playwright-core + @axe-core/playwright scripts for a 10-page x 6-size crawl (console, failed requests, broken images, overflow, titles/descriptions/canonicals/og, h1 count, duplicate ids, JSON-LD), axe accessibility, dialog/nav/chat flow tests, wheel/keyboard tests, throttled-phone LCP, stress tests (80 page requests, 12 simultaneous chats).

> ## UPDATE 2026-11-25 (BIG: static export + tiny API Worker, 1102 bug). Newest note, overrides every Cloudflare/OpenNext statement below.
> - **Bug found by the QA crawl:** the OpenNext Worker returned Cloudflare error 1102 ("Worker exceeded resource limits", free-plan 10 ms CPU) or 500 on ~1 in 8 requests that reached the Next server (cold isolates), including ~2 of 12 simultaneous CHAT messages. Not visible in normal browsing because cached HTML hid it.
> - **Fix = new architecture (deployed):** `next.config.js` has `output: "export"` (site is plain files in `out/`, served by Cloudflare assets with no code); `worker/index.ts` is the only server code, runs ONLY for `/api/*` via `assets.run_worker_first: ["/api/*"]`, calls Anthropic with plain `fetch` (no SDK, no zod). `@opennextjs/cloudflare`, `@anthropic-ai/sdk`, `zod`, `worker.ts` (edge cache), `open-next.config.ts` and `app/api/*` are REMOVED. `/api/contact` was dropped (unused; email is live). Scripts: `build`/`build:cf` = `next build`; `preview:cf` = build + `wrangler dev`; `deploy:cf` = build + `wrangler deploy` (permission rule unchanged). `out/` is git-ignored.
> - **Results live:** 80/80 page requests OK (was ~12% failing), 12/12 simultaneous chats OK, server wait median 159 -> ~60 ms (worst 762 -> ~100 ms), Worker size 1.4 MB -> 15 KB. QA crawl (10 pages x 6 sizes + dialogs + links) found no real errors; only harmless "ERR_ABORTED" lines (Next cancels its own background page fetches).
> - **LOST in the move:** Next `redirects()` and `headers()` do not exist in a static export. Security + cache headers moved to `public/_headers`. The www -> apex 308 redirect is GONE: the user must add Cloudflare's free "Redirect from WWW to root" Redirect Rule in the dashboard (www currently serves the site; pages have canonical tags so SEO is safe meanwhile).
> - **Other fixes this round:** 320 px phones: top tab bar scrolls the active tab into view and fades at the edges; home hero heading no longer slides under the bar (`min-h-[max(70svh,36rem)]`, `pt-20`); expanded-card labels clear the close button; dialogs now trap Tab focus (`components/studio/dialog-utils.ts`); Bricolage font loads only weight 700.
> - **Web Analytics report (Cloudflare RUM, 24 h, ~11 views):** LCP 64% good / 9% NI / 27% poor, P75 4.4 s; TTFB P75 916 ms; render delay P75 2.76 s; CLS 100% good; INP no data. Old `/_next/image` LCP URLs mean part of it predates the image fix. Re-check the report in a few days for the new numbers.
> - **Rollback:** `git revert` the commit "feat: implemented static site build and API worker" and redeploy (restores OpenNext).

> ## UPDATE 2026-11-25 (Web Analytics report + edge cache + font diet). Newest note.
> - **Report read** (`ideas/Web analytics ... .pdf`, Cloudflare Web Analytics, 24 h, tiny sample of ~11 real page views): LCP 64% good / 9% needs improvement / 27% poor; P50 1.7 s, P75 4.4 s, P90 4.9 s. P75 sub-parts: TTFB 916 ms, resource load delay 144 ms, resource load duration 262 ms, element render delay 2,764 ms; LCP element was `img.object-cover` loaded via the OLD `/_next/image` path (so partly measured before the image fix). CLS 100% good. INP: no data yet.
> - **Findings:** (1) cold-start TTFB: each new Worker isolate boots the whole Next server (lab 0.9 s cold vs 0.16 s warm); (2) on a slow link three font files (~100 KB), the hero image and ~160 KB JS all download at once.
> - **Fixes:** `worker.ts` is now the Worker entry (`wrangler.jsonc` "main"): it wraps the OpenNext handler and caches the finished HTML of the static pages in the edge Cache API (key = URL path + BUILD_ID fetched once from ASSETS; TTL 24 h; only plain GET text/html with no query string, no RSC/prefetch/range headers; redirects/404s/api never cached; response header `x-edge-cache: HIT` on hits). The Cache API does NOT run on *.workers.dev, only on the custom domain. `tsconfig.json` excludes `worker.ts` and `.open-next`. Bricolage Grotesque now loads only weight 700 (single static file instead of the full variable font).
> - **Rollback if the cache ever misbehaves:** set `"main": ".open-next/worker.js"` back in `wrangler.jsonc` and `npm run deploy:cf`.

> ## UPDATE 2026-11-25 (accessibility, privacy page, error pages, CI, analytics placeholder bug). Newest note.
> - **BUG FOUND AND FIXED:** `.env` still held the template placeholder `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-XXXXXXXXXX`, so the LIVE site was loading Google's gtag script for a fake id (privacy + weight). Blanked the value and `app/layout.tsx` now only enables Google Analytics for a real-looking id (placeholders like G-XXXX are ignored). If analytics is ever turned on, update `/privacy`.
> - **Accessibility (axe-core, all pages, desktop + phone):** fixed `aria-label` on `<p>` headings (AnimatedHeading only labels real headings now), button names (experience/project cards now named by their visible content; YouTube facade label starts with its visible text), contrast (white text on green buttons on /research), decorative react-icons now `aria-hidden`. Re-run `axe.mjs`-style checks after big UI changes (tooling lives in the scratchpad, recreate with `npm i @axe-core/playwright playwright-core`).
> - **New pages:** `/privacy` (factual: no cookies/analytics; chat text goes to Anthropic and is not saved; IP used for rate limiting; Cloudflare hosting and Email Routing). Drafted by Claude from how the site works: the user should read it once. Linked from both footers and the sitemap. `app/(site)/error.tsx` + `app/global-error.tsx` added.
> - **CI:** `.github/workflows/ci.yml` runs tsc, eslint and build on pushes to main and pull requests (no secrets needed). If GitHub rejected the push for missing `workflow` scope, the user must run `gh auth refresh -s workflow`.

> ## UPDATE 2026-11-25 (professional email live). Newest note.
> - **`hello@ehisoghina.com` is live** via Cloudflare Email Routing (forwards to the user's Gmail). Verified by an SMTP RCPT probe against `route1/2.mx.cloudflare.net`: `hello@` accepted (250), a made-up address rejected (550). `.env` has `NEXT_PUBLIC_CONTACT_EMAIL=hello@ehisoghina.com` (replaced the personal Gmail); redeployed. Forwarding only: replies go out from the user's Gmail unless they set up Gmail "Send mail as".

> ## UPDATE 2026-11-25 (merged to main). Newest note.
> - **GitHub default branch is `main` and it now holds the new site.** `origin/main` used to be a single unrelated "Initial commit" (a 2-line README); the real history grew from `master`. Merged with `git merge -s ours --allow-unrelated-histories origin/main` (tree unchanged) and pushed to `main` as a normal fast-forward, no force. Work on `main` from now on. `redesign-prototype` (identical, can be deleted on GitHub) and the old `master` (old template) still exist. Verified on GitHub: README shows the new project; `.env`, `ideas/` and `public/papers/` are not in the repo.
> - **Professional email:** the user is setting up Cloudflare Email Routing (hello@ehisoghina.com forwarding to Gmail). When they give the address: put it in `.env` as `NEXT_PUBLIC_CONTACT_EMAIL`, then `npm run deploy:cf`. Note Email Routing only forwards incoming mail; replying FROM that address needs Gmail "Send mail as" (SMTP) or a paid mailbox.
> - Blurbs (Hugging Face, Scholar, Kaggle, TikTok): the user said to keep them written as if content exists behind the links. No change needed.

> ## UPDATE 2026-11-25 (perf results after fixes + open list). Newest note.
> - **Live phone numbers after the image fixes** (throttled phone, noisy because the dev machine was loaded): Home LCP 4.5 s -> ~2.5 s, Experience 4.6 -> ~2.3 s, Projects 3.1 -> ~1.6 s (also 848 -> 459 KB), CV 5.0 -> ~3.3 s. What remains is bandwidth: on the 1.6 Mbps test the JS (~230 KB), fonts and images share one link. Further gains need a JS/font diet (framer-motion is the big one) and are diminishing; real 4G is much faster. The user can check real-world numbers with pagespeed.web.dev.
> - **Open list for the user:** real photos/clips (current ones are stand-ins), YouTube videos, xgGaffer code + demos, SSRN link then Google Scholar, confirm four blurbs (Hugging Face, Scholar, Kaggle, TikTok), merge `redesign-prototype` into the GitHub default branch (master still shows the old template), set up a professional email via Cloudflare Email Routing (then set `NEXT_PUBLIC_CONTACT_EMAIL`), turn on Cloudflare Web Analytics (free, no cookies), back up `ideas/` and `public/papers/` (neither is in git), re-request indexing for the new paper page in Search Console.

> ## UPDATE 2026-11-25 (performance + placeholder cleanup). Newest note.
> - **Measured on the live site (throttled phone: 390x844, 4x CPU, 1.6 Mbps/150 ms):** LCP was 4.3 to 5.0 s on Home, Experience and CV. Cause: `next/image` does NOT resize on Cloudflare Workers, so phones downloaded the 1400 px originals (hero 122 KB, experience photo 221 KB, CV pages 184 + 227 KB) at once over a slow link. Desktop was fine (LCP 0.3 to 0.9 s except one cold first hit).
> - **Fix:** `scripts/make-image-variants.mjs` (uses `sharp`, already in node_modules via Next) pre-generates `<name>-{384,640,828,1200}.webp` for every `public/media/*.jpg|png` and `page-N-{640,900,1251}.webp` for the CV pages; `lib/image-loader.ts` (set via `images.loader/loaderFile` in `next.config.js`) picks the smallest at least as wide as requested. **Re-run `node scripts/make-image-variants.mjs` whenever a photo in `public/media` or a CV page image changes.** Hero is now ~35 KB, experience photo ~70 KB, CV page 1 ~92 KB. Variants are committed so a fresh clone still builds.
> - **Placeholders removed from live pages:** fake video titles ("Video title placeholder"), "Channel name", "Latest: placeholder title", "Sample answer" descriptions. Home/Research social tiles now come from `config/platforms.ts` (real handles, real links); the chat sample on Home now shows real example answers (labelled "Example answer"); the Research video tiles say "First video coming soon" and "Build logs and explainers to follow". `socials` export removed from `config/studio.ts`.
> - **Lighthouse not run:** auto mode blocked `npx lighthouse` (remote download-and-run) and it was not retried. The user can run Chrome DevTools > Lighthouse (mobile) on the live URL. Use `node live.mjs`-style Playwright measurements (see git history of this note) as the fallback.

> ## UPDATE 2026-11-25 (first paper on the site). Newest note.
> - **Paper added:** "Remote and Hybrid Work in Software Engineering: Productivity, Collaboration, Wellbeing and Organisational Design" (literature review, 15 pages, byline "E.Oghina", no email/phone inside). Source file: `ideas/E_Oghina_Remote_Hybrid_Work_Final.pdf` (private, git-ignored).
> - **Hosted but NOT in git (the user's request):** the site copy lives in `public/papers/` which is git-ignored (`.gitignore`). It is served by the deployed Worker because deploys build from the local folder. Consequence: a fresh clone or a Cloudflare Git-connected build will NOT have the PDF or cover; deploy from this machine. The site copy has title/author/keywords metadata embedded (the original had none); content is untouched.
> - **Pages:** `/research` features it (cover image from page 1); `/research/<slug>` (`app/(site)/research/[slug]/page.tsx`) is the paper's landing page with Highwire Press meta tags (`citation_title`, `citation_author`, `citation_publication_date`, `citation_pdf_url`, keywords, abstract URL), ScholarlyArticle JSON-LD, abstract, Read/Download buttons, "Cite as". Added to the sitemap. `Paper` in `config/studio.ts` gained slug/subtitle/authors/date/fullAbstract/keywords/pdf/cover/ssrnUrl/doi. The chat knows about the paper.
> - **TODO when SSRN approves:** set `ssrnUrl` (and `doi` if any) on the paper in `config/studio.ts`, redeploy. Then create the Google Scholar profile (public, verified UNIVERSITY email) and set the Scholar `url` in `config/platforms.ts`. The byline "E.Oghina" has no affiliation or ORCID; mention to the user that adding them to a later version helps Scholar match authorship.
> - TechRxiv submissions are closed (platform migration); OSF's service list had no general server; SSRN was chosen (awaiting approval).

> ## UPDATE 2026-11-24 (Discord linked). Newest note.
> - **Discord** now links to the profile `https://discord.com/users/<numeric id>` (id supplied by the user); handle `ehis_73189` shown. `handleOnly` is no longer used by any platform but remains supported.
> - **Google Scholar still has no url.** The user cannot create the profile yet and has an article ready. Advice given: Scholar does not accept uploads; it indexes papers that are public as PDFs. arXiv is reliably indexed (first-time authors need an endorsement; a university email helps); Zenodo gives an instant DOI but its Google Scholar indexing is reported as unreliable; a university repository also works. A Scholar profile must be public and have a verified UNIVERSITY email (Gmail does not count) to appear in Scholar search. Once the profile exists, set `url` to `https://scholar.google.com/citations?user=XXXX`, and add the paper to `papers` in `config/studio.ts` with its link.

> ## UPDATE 2026-11-24 (auto-deploy permission, Stack Overflow link). Newest note.
> - **Deploy permission:** the user asked for hands-off deploys. Added `Bash(npm run deploy:cf)`, `Bash(npx wrangler deploy)` and `Bash(npx wrangler deploy --dry-run)` to `/home/eo4/projects/personal_website/.claude/settings.local.json` (outside the git repo, never committed). Earlier the auto-mode classifier had blocked `wrangler deploy --temporary`. Flow now: tsc + eslint + `build:cf` pass, commit, push, `npm run deploy:cf`, verify live with curl.
> - **Alternative (not set up):** Cloudflare "Workers Builds" (dashboard: Workers & Pages > ehisoghina > Settings > Builds > connect GitHub) would deploy on every push, but `.env` is not in git so `NEXT_PUBLIC_CONTACT_EMAIL` must be added as a build variable there.
> - **Platforms:** Stack Overflow url set (`stackoverflow.com/users/33337372/ehis-oghina`). Google Scholar: the user's link was the profile CREATION page (`...citations?view_op=new_profile`), not a public profile; a real one looks like `scholar.google.com/citations?user=XXXX` and exists only after the profile is created. Discord: a profile link needs the numeric user id (`https://discord.com/users/<id>`); a username alone cannot be linked. Both stay without `url` until the user supplies them.

> ## UPDATE 2026-11-24 (platform links + email). Newest note.
> - **Deployed state:** the user redeployed; live `/cv` is 200 and live subpages now have their own canonical URLs. The user requested indexing for `/`, `/projects` and `/cv` in Search Console (base page indexed OK).
> - **`config/platforms.ts` rewritten** from the handles the user saved (they gave handles, not URLs). Built each `url` from the handle using each site's standard pattern; `status` removed from the type; `handleOnly` added (Discord shows the username as a "Username" chip, no link); tiles without a url and not handleOnly show a "Link soon" chip. Blurbs changed from "your" to "my". Main five (LinkedIn, YouTube, GitHub, Substack, X) are `mainIds` in `platforms/page.tsx`. JSON-LD `sameAs` is built from every platform with a url (20 now).
> - **Unverified links** (the site blocks automated checks, so a human must click them): LinkedIn (999), Facebook (400), LeetCode, Medium, ResearchGate (403). A 200 from other sites does not prove the profile exists (several return 200 for any name), so ALL links should be clicked once. **Stack Overflow and Google Scholar have no url**: their links need a numeric id, so the user must paste the real profile links into `url`.
> - **Blurb claims to confirm with the user:** Hugging Face "Models and demos I have published", Scholar "Papers and citation counts", Kaggle/HackerRank ("competition rankings", "skill badges and certifications"), TikTok "Short-form football and AI clips". These describe content that may not exist yet.
> - **Contact email:** `NEXT_PUBLIC_CONTACT_EMAIL` is set in `.env`; verified on the local Workers build that the Contact tile and footer show a mailto link (3 on home, 1 on /cv). Needs `npm run deploy:cf` to go live. Never print or commit the address.

> ## UPDATE 2026-11-24 (CV tab, share image, demo placeholders, canonical fix). Newest note.
> - **Interactive CV tab `/cv`:** `components/studio/cv-viewer.tsx` + `config/cv.ts`. Two CV page images (`public/cv/page-1.webp`, `page-2.webp`, `thumb.webp`) with 13 hotspots positioned from the PDF's text coordinates (percent rects). Hover highlights, click opens a morphing dialog whose content comes from `config/studio.ts` (experiences, projects, degrees, `skillGroups`) plus related links (`cvLinks`). Added "CV" to the nav (`navLinks`), sitemap and footer; the home résumé tile is now an interactive-CV tile with a real page thumbnail. `NEXT_PUBLIC_RESUME_LINK` is retired.
> - **PRIVACY DECISION (revisit if the user wants):** the published CV (`public/cv/Ehis-Oghina-CV.pdf` and the page images) has the phone number and email REMOVED from the PDF text (verified, not just covered) and replaced by `ehisoghina.com`. The original is only in the git-ignored `ideas/CV1126.pdf`. To publish the full version, regenerate from the original without the redaction step.
> - **Contact email:** `contactEmail` in `config/site.ts` reads `NEXT_PUBLIC_CONTACT_EMAIL` from `.env` (git-ignored; the repo is public). Unset = the Contact tile says "Find me on LinkedIn, GitHub and more" and links to /platforms, the footer shows no email. The user must add the line to `.env` and redeploy.
> - **Share image:** `public/og.jpg` is 1200x630, cropped from `ideas/_DSC1803 (2).jpg` (which is 5472x3648, 3:2, so it needed a crop). `og:image` width/height set.
> - **Demo placeholders:** `StudioProject.demoUrl?`. Without it the expanded project view shows a dashed "Interactive demo coming soon" panel; with it, a "Launch live demo" button. xgGaffer and the other projects' repos are still linked on GitHub; remove `repo` from a project in `config/studio.ts` to hide its link.
> - **SEO BUG FIXED:** the root layout set `canonical: "/"` so EVERY subpage declared the homepage as its canonical (confirmed on the live site). Removed it; each page now sets its own canonical. Needs redeploy; then request re-indexing for /projects, /experience etc. in Search Console.
> - **Platforms page:** now five main tiles (LinkedIn, YouTube, GitHub, Substack, X, ids in `mainIds` inside `platforms/page.tsx`) and a "More places" section for the rest; tiles without a `url` show a "Username" chip (for example Discord). The dashed "Suggested" styling is gone.
> - **(resolved, see the newer note above)** platforms.ts was unsaved at that time.
> - **Sitemap:** the user confirmed Search Console now shows Success.

> ## UPDATE 2026-11-24 (redeployed and verified live). Newest note.
> - **Redeployed by the user** (version d849e199). Verified on the live domain: all 6 pages 200, 404 page, sitemap/robots, new project cards + footer + `site-bar` present, security headers present, static JS `immutable` 1-year cache, media 1-day cache, chat answers from the CV facts.
> - **www redirect works in production:** `https://www.ehisoghina.com/research?a=1` returns 308 to `https://ehisoghina.com/research?a=1` (path and query kept). No Cloudflare Redirect Rule needed.
> - Remaining work is mostly the user's material: real photos/clips, videos, social links, contact email, résumé link, xgGaffer demo, a 1200x630 social image, then re-submit the sitemap in Search Console in 1 to 2 days.

> ## UPDATE 2026-11-24 (projects expand view, footer, fading header). Newest note.
> - **Projects page redesigned** (`components/studio/project-strip.tsx`): every card shows a short overview (`summary`) plus dates; clicking opens a full-screen dialog (layoutId morph, dimmed background, same technique as Experience) with the full explanation (`highlights` from the CV), tags, real metrics, GitHub button and "Live demo coming soon". The old below-strip detail panel is gone. From ~1340px wide all 5 cards fit with no cut-off; below that it is a swipeable strip with the focus lens. Hover sets the active card when nothing scrolls. `StudioProject` now has `summary`, `highlights`, `metrics?` (no `description`).
> - **Smoothness safeguards:** the card unmounts while its dialog is open (no video behind the animation), the dialog shows the poster first and starts the clip after 800 ms, no new scroll listeners, no blur, no new dependencies. Measured on the Workers build: opening a project card is in the same range as opening an Experience card (machine was loaded, load avg 4.5 to 5.4, so treat as indicative; check on a real phone).
> - **Header bars fade:** `.site-bar` (name pill + nav pill) fades to 10% opacity as the page scrolls (CSS scroll-driven animation, `animation-timeline: scroll(root)`; the home page uses a named timeline from `.home-scroller`) and returns to full on hover or focus. Only on hover-capable devices; touch devices and reduced-motion keep the bars. Bars are hidden while a dialog is open (`body[data-dialog]`) because they used to sit on top of it. Verified numerically in Chrome: 1 at top, 0.1 scrolled, 1 on hover, 1 on touch.
> - **Footer:** `components/studio/site-footer.tsx`, full version after every page (layout), compact one-line version inside the last home screen (`Chapter footer` prop; the layout one is hidden on home via CSS because home is a fixed-height scroller). `navLinks` now lives in `config/site.ts`. Experience page bottom padding cut from 20svh to 4svh so there is no empty gap above the footer.
> - **Operational:** `next.config.js` redirects www.ehisoghina.com to the apex (308). NOT verifiable locally (host header includes a port): after deploy run `curl -sI https://www.ehisoghina.com/projects` and expect `308` and `location: https://ehisoghina.com/projects`; if it does not redirect, add a Cloudflare Redirect Rule instead. `wrangler.jsonc` compatibility_date bumped to 2026-11-01 (tested on workerd).
> - **Search Console "Couldn't fetch" on the sitemap:** the sitemap itself is fine (200, application/xml, valid, 6 URLs, fetchable with a Googlebot user agent). This status right after submitting is usually transient; retry in 1 to 2 days. The URL Inspection indexing request is the right fallback.
> - **Needs redeploy:** `npm run deploy:cf`.

> ## UPDATE 2026-11-24 (hardening pass, NOT yet redeployed). Newest note.
> - **Added:** `public/_headers` (immutable 1-year cache for `/_next/static/*`, 1-day + SWR for `/media/*`; live site previously sent `max-age=0, must-revalidate`) and baseline security headers in `next.config.js` (nosniff, SAMEORIGIN, referrer policy, Permissions-Policy with `microphone=(self)` so dictation still works). Verified on the local Workers runtime. No CSP yet (risk of breaking the JSON-LD/GA inline scripts).
> - **Security:** upgraded `zod` 3 to 4.6.7 (high advisory: memory exhaustion on oversized arrays). Chat and contact validation re-tested on workerd: all expected 400/503 results unchanged. `npm audit fix` applied; 3 moderate advisories remain, all `glob`/`minimatch` inside `@opennextjs/cloudflare` build tooling (never shipped to visitors; the offered fix is a breaking downgrade).
> - **Found, not fixed:** `next/image` does no resizing on Workers (the live `/_next/image?...w=640` returned the original 124,464 B file). Photos are ~125 KB each so it is acceptable now; when real photos arrive, export them at about 1600 px wide and under 200 KB, or enable the Cloudflare Images binding.
> - **The user must run `npm run deploy:cf` again** for these changes to go live.
> - All 5 CV projects are on the live Projects page (verified in the live HTML); the 5th pill sits off the right edge of the strip on wide screens until you scroll or press the arrow.

> ## UPDATE 2026-11-24 (LIVE). Newest note.
> - **The site is live at https://ehisoghina.com** (and www.ehisoghina.com, which serves the same pages; canonical URLs point at the apex). After the redeploy both domains show under Connected Workers. Verified from here: valid TLS, HTTP 200, sitemap and canonical use `https://ehisoghina.com`. The user's own browser initially failed on the apex only because of a stale local DNS cache (public resolvers 1.1.1.1 and 8.8.8.8 already returned Cloudflare IPs).
> - The user set the monthly spend limit in the Anthropic Console (confirmed 2026-11-24).
> - **Next ideas:** redirect www to the apex (Cloudflare Redirect Rule), submit the sitemap in Google Search Console, optional Upstash for global rate limits, real photos/clips, videos, social links, contact email, résumé link, xgGaffer demo, Lighthouse on the live URL.

> ## UPDATE 2026-11-24 (first deploy). Newest note.
> - **Deployed by the user** to `https://ehisoghina.ehisoghina.workers.dev` (Worker `ehisoghina`, secret `ANTHROPIC_API_KEY` set). Verified live: 6 pages, 404, sitemap, icon, video all OK and the chat answers from the real key.
> - **Bug found and fixed:** the custom-domain `routes` were only in a comment in `wrangler.jsonc`, so `ehisoghina.com` was not attached ("no workers connected"). Now real routes for `ehisoghina.com` and `www.ehisoghina.com`, plus `workers_dev: true` and `preview_urls: false`. Config validated with `wrangler deploy --dry-run`. The user must run `npm run deploy:cf` once more to attach the domain.
> - Open: `ehisoghina.com` did not resolve from this machine before the route existed; re-check after the redeploy. If the deploy errors that the zone is not active, the nameserver change at the registrar is not complete yet.

> ## UPDATE 2026-11-24 (Cloudflare Workers). Newest note.
> - **Pushed** `redesign-prototype` to `origin` (github.com/ehis04/personal-website). The user authorised future commits+pushes without asking when tsc/eslint/build pass, the message follows rule 9, and `.gitignore` covers secrets (see memory `feedback-push-rules`).
> - **Cloudflare Workers set up** with `@opennextjs/cloudflare` + `wrangler` (`wrangler.jsonc`, `open-next.config.ts`, scripts `build:cf`, `preview:cf`, `deploy:cf`). Installing the adapter also upgraded **Next to 16.4.6**; build, tsc and eslint all pass on it. Removed the stale Tailwind `safelist` that warned.
> - **Verified on the local Workers runtime (workerd):** all pages 200, 404 page, robots, sitemap, manifest, icon, images, video, chat streamed a real Haiku answer, bad body 400, rate limit 429 after 15 messages.
> - **Rate limiting** moved to `lib/rate-limit.ts`: optional Upstash Redis over plain `fetch` (`UPSTASH_REDIS_REST_URL/TOKEN`), memory fallback, uses `cf-connecting-ip`. Chat and contact routes use it.
> - **NOT deployed.** `wrangler whoami` says not authenticated; `wrangler login` needs the user's browser. A `wrangler deploy --temporary` attempt was blocked by the auto-mode classifier and was not retried or worked around. Remaining one-time steps are in README "First deploy": `wrangler login`, `wrangler secret put ANTHROPIC_API_KEY`, `npm run deploy:cf`, then add the ehisoghina.com zone and route.
> - `.dev.vars` (contains the API key for local Worker testing) is git-ignored; never commit it.

> ## UPDATE 2026-11-24 (research + metrics pass). Newest note.
> - **Chat verified live** against the CV facts (5 questions): correct answers for xgGaffer, 2025 roles, Birmingham research; declined the phone number; correctly said nothing is hosted. The model uses he/him, which the user approved.
> - **Experience dialog:** the scaffold "00 / Metric one..." tiles are gone. `Experience.metrics?` holds real CV numbers (Optum: 7 hrs, 70%, 56%; DCU Soccer: 500+ members) and the block is hidden when a role has none.
> - **Research page/home:** placeholder papers replaced by real entries (SemEval 2027 in progress; Trivium and xgGaffer with GitHub links). `Paper` now has optional `href` + `status`. Headings changed from "papers/written" to "research/investigating". Videos and socials are still placeholders (GitHub handle is ehis04).
> - **Perf note:** a post-change measurement showed slower cold loads and 250 to 300 ms long tasks, including on `/ask` which barely changed. The machine was loaded (load average 3.3, docker + local Supabase + other sessions), so this is treated as noise; re-measure on an idle machine. Last clean numbers (before the CV content): tab switch 63 to 189 ms, 0 long tasks, cold home ~356 ms.
> - **Work style:** the user wants uninterrupted progress: do not ask permission to run tests; stop only for major issues, finished work, or commits.

> ## UPDATE 2026-11-24 (CV content pass). Newest note, wins over everything below.
> - **Real content added from `ideas/CV1126.pdf`:** `config/studio.ts` now has `degrees` (MSc Birmingham Sep 2026 to Sep 2027; BSc DCU Aug 2022 to May 2026), 5 `experiences` (NLP Researcher, R.V. Uncovered, Optum, EPAM, DCU Soccer) and 5 `studioProjects` (xgGaffer flagship, Trivium, Social Olympics, Little by Little, Financial Risk Dashboard). Home page, experience and projects pages read from it. `config/knowledge.ts` has the matching verified facts (no phone/email). Chat prompt buttons updated.
> - **Project repos reviewed (read-only, via gh):** `ehis04/xggaffer`, `ehis04/trivium`, `ehis04/social-olympics` are public and the READMEs match the CV. **Little by Little has no repo** (`/home/eo4/projects/lbl` is an empty folder) and Financial Risk Dashboard is not on GitHub: both show "Code not public yet". The project strip now shows the period, "Live demo coming soon" and a "View on GitHub" link when `repo` is set. GitHub lists vercel.app homepages for xggaffer/morphmatch/ronaldo-freekick-analysis: the user says nothing is hosted, so NO demo links were added.
> - **Not on the CV, so not on the site:** morphmatch, ronaldo-freekick-analysis, Coaching-App and other repos. The xgGaffer README lists a second author (a teammate); the site does not name them. Ask the user before crediting.
> - **Template leftovers replaced:** `public/profile-img.jpg` (a photo of the template author) and `public/logo.png` ("n" monogram) deleted; `app/favicon.ico` replaced by `app/icon.png` + `app/apple-icon.png` cropped from the user's `photo-1.jpg`; manifest points at `/icon.png`. `components.json` (shadcn) removed. README rewritten (stack, content map, env, hosting review). `.env.example` added.
> - **Hosting review result:** Cloudflare Workers + OpenNext recommended (see README "Hosting"). In-memory rate limits must move to Redis/Cloudflare when deployed.
> - **Still placeholder:** papers, videos, socials, contact email, résumé link, all photos/clips (they are the user's own pictures standing in), research page. Home "Research" featured tile now describes the real SemEval 2027 work (no paper link).
> - **Verified:** tsc clean, eslint 0 problems, build passes (15 pages), 0 console errors, screenshots of home/experience/projects checked. **Not verified:** the chat answering from the new facts (no live API call was made after the change), mobile screenshots of the new content, the expanded experience dialog with the long highlights.

> ## UPDATE 2026-11-24 (later): PROMOTED. READ THIS FIRST, it overrides older sections.
> The `/preview` prototype is now the real site. Where this note conflicts with Sections 3, 5, 6, 10, 13 below, this note wins.
> - **Routes:** `app/(site)/` (layout with `.studio`, nav, skip link; `template.tsx`; `studio.css`; pages `/`, `/experience`, `/projects`, `/research`, `/ask`, `/platforms`). All `/preview/...` hrefs became `/...`. `noindex` removed.
> - **Deleted (all still in git history):** `app/(root)` (legacy pages), `app/api/github-stars`, legacy `components/*` except `studio/`, legacy `config/*` except `studio|platforms|knowledge|site`, `content/`, `information/`, `lib/blogs.ts`, `providers/`, `hooks/`, template images in `public/` (blogs, experience, projects, next.svg, vercel.svg, old robots.txt).
> - **Rewritten:** `config/site.ts` (domain `https://ehisoghina.com` by default, `NEXT_PUBLIC_SITE_URL` overrides; description/keywords from verified facts only; OG image is the placeholder `/media/photo-3.jpg`), `app/layout.tsx` (dark, Inter only, Person JSON-LD whose `sameAs` lists platforms that have a real `url`), `app/globals.css` (now ~10 lines), new `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/not-found.tsx` (styled 404).
> - **Removed packages:** @hookform/resolvers, all @radix-ui/*, @vercel/analytics (+ its component), class-variance-authority, gray-matter, next-themes, react-hook-form, remark*, zustand. Cal Sans font no longer loaded (files remain in `assets/fonts`, unused).
> - **Wired:** Contact chapter CTA now links to `/platforms`; the résumé tile links to `NEXT_PUBLIC_RESUME_LINK` only when it is a real `https://` URL (currently not, so it is inert). The email on the Contact tile is still a placeholder. `/api/contact` still exists but has no UI.
> - **Verified after promotion:** `tsc` clean; `eslint .` 0 errors AND 0 warnings; `next build` passes (14 pages); 0 console errors on home/projects/mobile; screenshots of home and the 404 look right; perf unchanged in practice (tab switch 63 to 189 ms, 0 long tasks; cold home FCP/LCP ~356 ms; total transfer rose ~70 KB, cause not investigated).
> - **Still open:** real OG image + favicon (`app/favicon.ico` and `public/logo.png`, `public/profile-img.jpg` may still be the template author's: check and replace), real content, résumé link, contact email, xgGaffers demo (waiting on user), README still describes the template, Lighthouse/real-device pass, commit (only when asked).

## 0. TL;DR

- **The task:** turn a cloned open-source template portfolio (Naman Barkiya's `minimal-next-portfolio`) into a rich, fast, beautiful multimedia personal website for **Ehis Oghina** (AI Engineer; football analyst; creator; builder).
- **Where it stands:** a working, performance-tuned prototype lives under the route **`/preview`** (home, experience, projects, research, ask/chat, platforms). The old template pages still exist under `app/(root)` and are untouched except for lint/type fixes.
- **Everything is placeholder content except the user's identity facts** (name, roles, degrees, platforms they named, and the existence of the xgGaffers project). The user has **not** prepared real content yet and said to leave placeholders for now.
- **Committed locally (2026-11-24)** on branch `redesign-prototype`: `feat: implemented redesigned portfolio site and removed template` and `docs: rewrote README and added handoff notes and clip script`. NOT pushed. The user now allows committing when work is verified (messages per CLAUDE.md rule 9); still ask before pushing.
- **Blocked on user:** (a) ~~saving `ANTHROPIC_API_KEY`~~ **DONE: the key is now saved in `.env` (line 14, format verified 2026-11-24: correct name, `sk-ant-` prefix, no quotes/spaces). Restart the dev server to load it, then run the live chat test (Section 13.1).** (b) the user updating their xgGaffers project code before the football-prediction demo is built, (c) real content, (d) a decision on the next step (Section 13).

---

## 1. The user and how to work with them

- Name: **Ehis Oghina**. The user confirmed (2026-11-24) that **he/him is fine** for referring to them, including in the chat assistant's replies. Do not infer pronouns for other people from a name.
- Personal details (email etc.) are private: never send them to external services.
- Roles (their words): **AI Engineer is the main role**. Education: **BSc Computer Science, MSc Artificial Intelligence** (do not assume completion dates; a photo suggests the BSc class of 2026, but no dates were given and none should be written). Additional roles: **Data Scientist, Software Engineer, Football Analyst, Creator, Builder**. They described themselves as "all 3" of sports analytics, data science and creator.
- They type fast and with typos ("dont" meant "font"; "grids" = tiles/cards). When a message is ambiguous, state your interpretation in the reply (as the previous session did) rather than interrogating them. Use `AskUserQuestion` only for real decisions.
- They want an **audit-first, show-me-before-big-changes** style for large decisions, but once they said "begin with the prototype" they expect autonomous progress with screenshots and honest reporting.
- They said: "you don't need to stop working to answer the question just follow through with the work".
- Report honestly: say what was tested, what was not, and what is placeholder. The previous session twice corrected itself in front of the user (a bogus "lint is clean" claim; broken Tailwind opacity classes). Keep doing that.
- Do not commit, push, delete the user's files, or call external services without asking. Do not paste secrets anywhere.
- Commit attribution: follow whatever attribution instruction your harness gives for commits/PRs when (and only when) the user asks you to commit.

### The user's design vision (their words, paraphrased closely; this is the acceptance test for all UI)

- "More than just simple boxes and links": a proper website with pictures, videos, beautiful design, interactive tools.
- A main **home page that highlights the most important things**, plus separate tabs/pages for each area.
- **Experience:** summary of the work in each job; when clicked, expands with smooth animation to the full detail with company logo and any pictures.
- **Projects:** explanations, interactive demos, video demos. Example: the xgGaffers football prediction models, where a visitor could run a prediction for a real upcoming fixture ("Arsenal vs Man Utd"). **Must be dynamic / current, not stale.**
- **Research/socials:** previews for papers, YouTube videos they are working on.
- **Query/chat tab:** type or dictate; answer as text or spoken. **Questions should only be about Ehis.** Use the Haiku API (they expect it to cost a few cents).
- Reference sites they LIKE: `markclennon.com` (dark edge-to-edge tile mosaic, smooth page transitions), `colin-moy.webflow.io` (tall pill-shaped cards in a horizontal strip, focused one in colour, others greyed). Reference they dislike: `nickvelten.nl`, `marlonwayans.com`, `sophiaamoruso.com` ("big text, empty spaces, boring colours", "plain background with straight lines dividing sections", "images just placed onto the screen, not part of it").
- Their Nike screenshot of **flat** layered cards = "too flat". They want tiles that look **embedded into the screen (recessed windows)** and **layered on top of each other**, not static flat squares. For experience: a series of cards; selecting one **expands over the others, fills the screen, and the rest of the screen dims**.
- **Never leave large empty/white/plain areas.** It "looks less professional".
- **Performance is key:** must not slow down on a phone or normal laptop. markclennon buffers because ~3 videos play at once; theirs must not. No more than 1 to 2 videos playing at once; short clips only.
- Palette: **dark, accent colour forest green.**
- Fonts: the current display font (Bricolage Grotesque) "is good" and fine for now; they wanted **dynamism in the text** (shadows, depth), not "flat and bold". They noted there are "surely more expressive fonts" but said this is OK for now.
- **Home page = full-screen sections.** "One section, then an animation to the next section, and the entire thing is on the screen so the user doesn't have to manually scroll and get everything on the screen themselves." The user approved the implemented transitions and text treatment.
- Hosting: free tier preferred, **not necessarily Vercel**.
- They will **update their xgGaffers project code first**, and only then have you build the prediction demo.
- A **"Social Exploits / Platforms" page** listing every platform they can be found on: they named **LinkedIn, Substack, X, Facebook, LeetCode** "etc."; extra suggested platforms should be placeholders. (Built; see Section 6.)
- Their latest asks (all done except where noted): smooth/fast tab switching ("switching between tabs at the top is very slow"), "focus on optimisation", "anything else in terms of building / feature improvement" (see Section 13), Platforms page.

---

## 2. Environment facts

- OS: Linux under **WSL2** (`Linux 6.18.58.1-microsoft-standard-WSL2`). The user views the site in Windows Chrome via `localhost`.
- Node `v26.3.0`, npm `11.16.0`. Next `^16.0.10` (installed 16.2.x), React `19.2.0`, Tailwind `3.4.x` (NOT v4), TypeScript 5, framer-motion `^12.5.0`, `@anthropic-ai/sdk ^1.12.0`, zod 3, lucide-react, react-icons 5.
- Browsers for testing: `/usr/bin/google-chrome` exists. Playwright browsers also exist under `~/.cache/ms-playwright` but the `playwright` package is not installed in the repo; the previous session used `playwright-core` installed in a scratch folder (see Appendix A).
- **No system ffmpeg.** The previous session got one via `pip install imageio-ffmpeg` in a throwaway venv (Appendix B).
- Dev server port used: **3100** (`npx next dev -p 3100`). Production test port: **3101** (`npx next start -p 3101`). At the time of writing **nothing is listening** on either; restart as needed.
- Git: remote `origin` = `https://github.com/ehis04/personal-website.git`. Local branch `redesign-prototype` was created off `master`/HEAD `263950f` ("New nav: community link added"). Pre-existing uncommitted change from before the session: `.env.copy` is deleted (the user did that; leave it).
- `.env` is git-ignored. It currently contains only the template's **placeholder** values (verified: they equal the template's `.env.copy` values): `GOOGLE_FORM_LINK`, `GOOGLE_FORM_FIELD_ID_NAME/EMAIL/MESSAGE/SOCIAL`, `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID`, `NEXT_PUBLIC_RESUME_LINK`. **`ANTHROPIC_API_KEY` IS now saved on disk** (line 14; the file has 13 lines; verified 2026-11-24 08:5x: name correct, value starts with `sk-ant-`, no quotes or trailing whitespace). It was briefly missing earlier because the editor change was unsaved; any earlier statement that it is missing is out of date. Never print `.env` values; check presence with `grep -c '^ANTHROPIC_API_KEY=.\+' .env` (prints a count only).
- A `.venv/` directory exists inside the project (and one in the parent folder): both are git-ignored / not part of the app.
- The `ideas/` folder (git-ignored) holds the user's reference screenshots and raw media (3.4 GB, including DJI/MVI source videos and a 46 MB screen recording). **Do not commit it. Do not delete it. The screenshots show the user's open browser tabs: treat as private.**
- Some `*:Zone.Identifier` files in `ideas/` are Windows download metadata; ignore (git-ignored).

### Shell gotchas that bit the previous session (important)

1. **`pkill -f "<pattern>"` can kill your own shell** if the pattern text appears in the command line you are running (exit code 144). Kill by PID found via `ss -ltnp | grep :3100 | grep -o 'pid=[0-9]*'` instead, or use the `[n]ext` bracket trick only when the literal pattern is not otherwise in your command.
2. Two stale `next-server` processes (PIDs 1561, 1779, "Operation not permitted" on kill) exist from earlier; they are harmless and do not hold port 3100/3101.
3. `next build` and `next dev`/`next start` share `.next/`. **Stop any running server before `next build`.** A full build takes ~20 to 60 s. Run long builds with `run_in_background`.
4. The `Write` tool refuses to overwrite a file you have not `Read` in the current session, and also refuses if the file changed on disk since you read it (many files were edited via Python scripts). Re-`Read` then `Write`, or use `Edit`.
5. The scratchpad directory (`/tmp/claude-1000/.../scratchpad`) was **wiped on session restart**; anything the previous session kept there (perf script, mock server, ffmpeg venv, screenshot scripts) is gone. Re-create from the appendices.

---

## 3. Repository layout (what matters)

```
minimal-next-portfolio/
  CLAUDE.md                      short always-loaded rules (points here)
  HANDOFF.md                     this file
  app/
    layout.tsx                   ROOT layout (html/body, fonts, ThemeProvider, Analytics, GA). Shared by old AND new site.
    (root)/                      LEGACY template site (home, skills, projects, experience, contributions, contact, blogs, resume, community). Has its own layout with Toaster + ModalProvider.
    api/chat/route.ts            NEW: streaming Claude Haiku chat endpoint
    api/contact/route.ts         REWRITTEN: safe Google-Form relay
    api/github-stars/route.ts    legacy
    preview/                     NEW SITE (all under /preview/*)
      layout.tsx                 .studio wrapper, fonts, skip link, StudioNav, noindex metadata
      template.tsx               <main id="main" class="page-in"> CSS fade per navigation
      studio.css                 ALL new-site styling (design tokens + effects + perf layer + a11y)
      page.tsx                   HOME: Scroller with 6 full-screen Screens
      experience/page.tsx        renders <ExperienceStack/>
      projects/page.tsx          renders <ProjectStrip/>
      research/page.tsx          papers, videos (YouTube facades), socials
      ask/page.tsx               renders <Chat/>
      platforms/page.tsx         all platforms
    sitemap.ts, manifest.ts      legacy (point at nbarkiya.xyz; see Section 11)
  components/
    studio/                      NEW design system (see Section 5)
    common, ui, forms, ...       LEGACY template components
  config/
    studio.ts                    PLACEHOLDER content: profile, experiences, projects, papers, videos, socials
    knowledge.ts                 chat assistant's VERIFIED facts + system prompt builder
    platforms.ts                 platforms list (yours vs suggested)
    site.ts, projects.ts, ...    LEGACY template config (still Naman Barkiya's content)
  public/media/                  web-ready media (Section 8)
  ideas/                         git-ignored references + raw media (do not touch)
  eslint.config.mjs              FIXED flat config (lints TS now)
  next.config.js                 images formats avif/webp; legacy CORS block removed
```

---

## 4. What has been DONE (chronological, with outcomes)

### 4.1 Audit (first request)
- Verdict reported to the user: **keep the repo and stack (Next App Router, TS, Tailwind, shadcn/Radix, framer-motion, next-themes); replace the design layer and content system.** The project was a clone of Naman Barkiya's open-source template with his name/content everywhere.
- Findings: no media layer; content as config arrays; blog was plain markdown; no interactive-tools infrastructure; unsafe contact route; unused dependencies; `app/layout.tsx` threw if the GA id was missing; a third-party chat widget (Convot) with the template author's token was loaded on every page; `config/site.ts` etc. point at `nbarkiya.xyz`.
- **Correction the previous session had to make:** its first audit claimed `tsc` and `eslint` were clean; ESLint was silently skipping every `.tsx` file (config had no `files`). Fixed later.

### 4.2 Reference research
- Downloaded raw HTML of `markclennon.com` and `colin-moy.webflow.io`. markclennon: Webflow + custom code, Barba.js page transitions, Lenis smooth scroll, Lottie, and every thumbnail is a `<video class="js-plane" loop muted playsinline>` with its own mp4 on a CDN (explains the user's buffering observation). colin-moy: Webflow native interactions only; no video/slider markup found in the HTML (could not determine how the effect the user saw is built).
- Searched for free templates (Astro/Next/Lexington Themes): nothing free matched; decision = **custom build on the existing repo**.

### 4.3 Media preparation
- From the user's raw videos in `ideas/` (3.4 GB total) made 6-second compressed clips into `public/media/`: `gym-a.mp4` (portrait 540x960), `gym-b.mp4` (portrait), `talk-a.mp4` (landscape 960x540) plus posters `*.jpg`. Total ~0.9 MB. Names reflect content (the DJI files are gym footage, MVI is a webcam recording of the user).
- Web-sized photos `photo-1..5.jpg` (1400px wide) and `grad-crop.jpg` (760x460 pre-cropped graduation photo for the education tiles).
- Photo content (all the user): `photo-1` name-badge portrait on white background (badge says "EHIS OGHINA", datathon); `photo-2` hand pointing at a chart (wide); `photo-3` speaking at an event with a green banner; `photo-4` graduation ("CLASS OF 2026"); `photo-5` smiling in a DCU Soccer Club jacket (wide).
- Source files NOT used: `_DSC1803 (2).jpg` (5 MB), `DSC_0238 (1).NEF` (RAW, browsers can't show it), `cameraman.png` (256x256, too small).

### 4.4 Cleanup (done)
- **ESLint config fixed** (`eslint.config.mjs` uses `eslint-config-next/core-web-vitals` + `/typescript`, ignores `.next`, `node_modules`, `ideas`, `.venv`, `next-env.d.ts`; `*.config.js` allowed `require`). It then found 17 errors in legacy code, all fixed (typed `any`s, `Date.now()` in render, setState-in-effect in `providers/modal-provider.tsx` replaced with `useSyncExternalStore`, empty interfaces, etc.). Current result: **0 errors, 1 warning** (`components/ui/use-toast.ts` `actionTypes`, standard shadcn). `npx tsc --noEmit` clean.
- **Removed unused packages:** `@supabase/ssr`, `@supabase/supabase-js`, `supabase`, `@sendgrid/mail`, `nodemailer`, `@types/nodemailer`, `remark-prism`, `@types/remark-prism`. (The user did not know why Supabase was added; it was unreferenced.) Added `@anthropic-ai/sdk`.
- **Removed** the Convot chat widget script (template author's token) and the GA-missing crash from `app/layout.tsx` (GA now renders only if `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` is set).
- **`app/api/contact/route.ts` rewritten:** zod validation (name 3 to 100, email, message 10 to 4000, optional URL), 16 KB body cap, per-IP rate limit (5 / 10 min, in-memory, soft), only posts to a `https://docs.google.com/forms/` URL, `URLSearchParams` encoding (old code interpolated raw input into a query string), checks delivery result, generic errors. With placeholder env it correctly returns **503 "Contact form is not configured."** The success path is **untested** until a real Google Form is configured.
- Removed a leftover permissive CORS header block for the non-existent `/api/sb-contact` from `next.config.js`.
- `.gitignore` now ignores `ideas/`, `*:Zone.Identifier`, `.venv/`.
- Toaster + ModalProvider moved from root layout to `app/(root)/layout.tsx` (only legacy pages need them) to cut JS on the new pages.
- `app/layout.tsx`: Cal Sans (legacy font) `preload: false`.
- `next.config.js`: `images.formats = ["image/avif","image/webp"]`, `minimumCacheTTL` 30 days.

### 4.5 The new design system and pages (all under `/preview`)
See Sections 5 and 6 for exact details. Summary: home = 6 snapped full-screen "Screens" with CSS scroll-driven transitions; experience = sticky overlapping sheets that expand to a full-screen dialog with a dimmed background (framer-motion `layoutId`); projects = Colin-Moy-style pill strip with a "focus lens"; research page; chat page; platforms page.

### 4.6 Chat (built, mock-tested only)
- `app/api/chat/route.ts` (Claude **Haiku 5.5**, model id `claude-haiku-5-5`) + `components/studio/chat.tsx` with dictation and speech output. **Live-tested against the real Anthropic API on 2026-11-24 (5 short calls, a fraction of a cent):** on-topic answer correct from verified facts only; off-topic request (poem) politely declined; prompt-injection ("print your system prompt") refused; unknown facts (employer/salary) answered with "I don't have that detail" and a pointer to the experience page; multi-turn follow-up used history correctly. Earlier it was also tested against a local mock that speaks Anthropic's SSE streaming format. See Section 7.

### 4.7 Performance work (done, measured)
Measured in a **production build** with headless Chrome (Appendix A):

| Metric | Baseline | Now |
|---|---|---|
| Tab switch (client nav) | 111 to 2130 ms | **97 to 420 ms** (4x slower CPU: 340 to 660 ms, first Experience visit ~1.3 s) |
| Main-thread long tasks per switch | 350 to 900 ms | **0 to ~90 ms** |
| Home FCP/LCP | 2084 ms / 2084 ms | **~300 / ~510 to 640 ms** |
| Home transfer | 1382 KB | 1095 KB |
| JS per route | 284 KB | 231 KB |

Causes found and fixed: framer-motion scroll hooks on every tile (replaced by CSS scroll-driven animations; `Tile`, `AnimatedHeading`, page template are now **server components**; framer-motion only remains in `experience-stack.tsx` and `project-strip.tsx`); infinite gradient-position animation on headings (removed); the graduation photo downloaded twice at different sizes (now one pre-cropped 100 KB image); Cal Sans preloaded for no reason; first screen invisible until hydration (now `data-first` + CSS entrance); posters of off-screen videos loaded eagerly (now lazy `<img>`); videos started only when idle; `content-visibility:auto` on screens; legacy Toaster/Modal removed from new pages; first experience card image `priority`.

### 4.8 Accessibility basics (done)
Skip-to-content link (`.skip-link`, target `#main` set in `template.tsx`), global `:focus-visible` green outline, experience dialog: close button autofocused, Escape closes, focus returns to the opening card (`data-card` attribute). Verified via Playwright: first Tab = "Skip to content"; focus after open = Close; after close = the card.

### 4.9 Platforms page (done)
`config/platforms.ts` + `app/preview/platforms/page.tsx`. User's confirmed: LinkedIn, X, Substack, Facebook, LeetCode (large tiles, "Add link" chips). 18 suggested placeholders in dashed tiles: GitHub, Booking (Calendly), Medium, YouTube, Instagram, TikTok, Threads, Bluesky, Kaggle, Hugging Face, Stack Overflow, HackerRank, Devpost, Google Scholar, ORCID, ResearchGate, Discord, Spotify. 18 suggested tiles = 3 even rows of 6 at `lg`. Verified visually (desktop + mobile).

---

## 5. The design system (`app/preview/studio.css` and `components/studio/*`)

All new-site CSS is scoped under the `.studio` class (set in `app/preview/layout.tsx`) so the legacy site is unaffected.

### Tokens (hard-coded hex; see the gotcha below)
`#060908` bg, `#0c110f` surface, `#121a16` surface-2, `#e9f0ea` ink, `#8c9a91` ink-dim, **`#2f7d50` forest green accent**, `#123a26` green-deep, `#46b07a` green-glow. CSS variables exist (`--green`, `--green-deep`, `--green-glow`, `--surface`, `--surface-2`, `--ink-dim`) and are fine for plain `bg-[var(--x)]` but see gotcha 1.

### Fonts
Root layout: Inter (`--font-sans`, body), Cal Sans local (`--font-heading`, legacy). `app/preview/layout.tsx` adds **Bricolage Grotesque** (`--font-display`, class `.font-display`, weight 700, tight tracking) and **Instrument Serif italic** (`--font-accent`, class `.font-accent`, used for one accent word per heading).

### CSS building blocks (class names)
- `.recess`: the recessed "window" tile (rounded 22px, dark surface, `::after` overlay with inset shadows so media looks set into the page). `.sheet`: extra upward shadow for stacked sheets.
- `.reveal`: tile entrance; inside `.screen` it is hidden until `[data-active="true"]`; staggered via `:nth-child` `--i` delays. `.screen[data-first]` variant plays on load from CSS (no JS needed).
- `.words .word`: word-by-word heading entrance (see `AnimatedHeading`).
- Text effects: `.text-extrude` (stacked hard shadows = 3D), `.text-sheen` (light-to-green gradient, static, with drop-shadow), `.text-shimmer` (animated green gradient; used only on the hero "AI"), `.text-accent-glow`, `.legible` (shadow for text on photos).
- Performance layer: `.page-in` (fade), `.screen{content-visibility:auto; contain-intrinsic-size:auto 100svh}`, `@supports (animation-timeline: view())` blocks for `.screen-inner` (rise/scale/fade between screens) and `.parallax` (media drift). Firefox lacks scroll-driven CSS, so it simply skips the motion (progressive enhancement).
- `prefers-reduced-motion` disables all of the above motion.
- Chat helpers: `.wave-bar`, `.wave-paused`, `.wave-dot`. Accessibility: `:focus-visible`, `.skip-link`.
- `.studio-scroll-hide`: hides scrollbars.

### Components (`components/studio/`)
| File | Type | Purpose |
|---|---|---|
| `tile.tsx` | server | Recessed tile. Props: `href?`, `media?` (`StudioMedia`: image `{src, position, zoom?}` or video `{src, poster}`), `alt`, `sizes`, `scrim`, `priority`, `className`. Media sits in a `.parallax` wrapper (CSS). Always has `reveal group block recess`. Renders `Link` if `href` else `section`. |
| `lazy-video.tsx` | client | Muted looping clip. Lazy `<img>` poster; file requested only when wanted and the browser is idle; global cap **MAX_PLAYING = 2**; skipped for reduced-motion/save-data; optional `playing` prop to control from a parent (project strip). |
| `scroller.tsx` | client | `Scroller`: `h-svh overflow-y-auto` snap container (`snap-proximity`, `lg:snap-mandatory`, proximity again when height < 760px), focus on mount for keyboard, **desktop wheel handler** (one gesture = exactly one section; needs `min-width:1024px and min-height:761px`; 750 ms lock; waits for a 140 ms pause so trackpad inertia can't skip), right-edge dot nav. `Screen`: full-screen section; IntersectionObserver with `rootMargin:-20% 0` sets `data-active`; `first` prop = visible in SSR. Context `useScrollerRef`. |
| `chapter.tsx` | server | A home Screen: header (kicker, `AnimatedHeading` title, CTA button) + 12-col tile grid; `rows` prop e.g. `lg:grid-rows-[3fr_2fr]`. |
| `animated-heading.tsx` | server | CSS word-by-word rise. `*asterisk*` words become serif accent. `wordClassName` is applied per word (gradient text + transforms don't mix on a parent). `delay` prop. |
| `doc-preview.tsx` | server | Stylised paper/résumé page placeholder (`compact` variant). |
| `experience-stack.tsx` | client (framer) | Sticky overlapping sheets (each `sticky`, `top = 4.5rem + i*3.4rem`); click expands via `layoutId` to a centered dialog over a `bg-black/80` dim layer; Escape; body scroll lock; focus management. Gallery uses 3 placeholder photos. |
| `project-strip.tsx` | client (framer for the detail panel) | Pill cards in a horizontal scroller. **Focus lens**: active pill = the one under a point that travels from the first pill (scroll 0) to the last (scroll end), so pills fill the screen with no empty padding; clicking pill / arrows / arrow keys call `goTo` (inverse formula). Drag to scroll (mouse). Active pill plays its video; others greyed. Detail panel below. |
| `lite-youtube.tsx` | client | YouTube facade: poster + play; loads the real `youtube-nocookie` iframe only on click and only if `youtubeId` matches `/^[\w-]{11}$/`; otherwise disabled "Coming soon". |
| `chat.tsx` | client | Chat UI: streaming reader, 8-message history sent, abort/stop, prompts, dictation (Web Speech API `SpeechRecognition`), speech output (`speechSynthesis`), "speak next reply aloud if the question was dictated", error display, privacy note. |
| `nav.tsx` | client | Floating pill nav: Home, Experience, Projects, Research, Ask, Platforms. Active state via `usePathname`. z-30 (so the experience dialog z-50 covers it). |

### Design gotchas (learned the hard way)
1. **Tailwind v3 silently drops opacity modifiers on CSS-variable colours.** `bg-[var(--green)]/80` generates NOTHING. Always use a hex for any class with a `/NN` opacity (`bg-[#2f7d50]/80`, `from-[#123a26]/70`). A regex pass converted 16 of these once; some `bg-[var(--surface-2)]` etc. without `/NN` still use vars on purpose.
2. `background-clip:text` on a parent breaks when children have transforms (text vanishes). Hence per-word effect classes.
3. Overflow-hidden masks clip text-shadows; the heading animation avoids masks.
4. `framer-motion` `useScroll` default container is `window`; inside the custom scroller it would never fire (this is why scroll effects moved to CSS).
5. The scroller means **the document itself does not scroll on the home page** (`docH == 900`); don't use `window.scrollTo` there in tests: scroll the element with `tabindex=-1`/use wheel events.
6. `backdrop-filter`/blur on moving or video content was deliberately avoided (phone cost).

---

## 6. Pages (routes) and their current content

All content is PLACEHOLDER unless noted. All in `/preview/...`. (`robots: noindex` is set in `app/preview/layout.tsx`; **remove when promoting to the real site**.)

- **`/preview` (home).** `Scroller` with 6 screens; labels `["Home","Experience","Projects","Research","Ask","Contact"]`.
  1. **Mosaic** (`<Screen first>`): hero tile (photo-3, `AnimatedHeading` name with `text-extrude`, "AI *Engineer*" shimmer, degrees line, role chips, 2 buttons), experience tile (photo-5, "4 roles"), projects tile (gym-a video), research list tile (links to `/preview/research`), ask tile (links to `/preview/ask`), latest-video tile (talk-a video), education tile (`grad-crop.jpg`).
  2. **Experience chapter:** large "Company One" tile (photo-3), education tile, "Also" list (Data Scientist / Software Engineer / Football Analyst with placeholder company names).
  3. **Projects chapter:** "Match Predictor" flagship (gym-b video), prototype-data fixture tile (**demo numbers**: 1.8 to 1.1 xG, 46/27/27), 3 mini project tiles.
  4. **Research chapter** (rows `3fr_2fr`): featured paper + `DocPreview`, video tile, 3 social tiles linking to `/preview/platforms`.
  5. **Ask chapter:** sample conversation (labelled "Sample"), prompts, waveform tile. CTA links to `/preview/ask`.
  6. **Contact chapter:** large tile (photo-2) "Have a project, a role or a question?", email placeholder `hello@your-domain.com`, résumé `DocPreview`. **Contact/résumé buttons are not wired.**
- **`/preview/experience`:** 4 stacked placeholder roles (`config/studio.ts` `experiences`), expandable.
- **`/preview/projects`:** 6 placeholder projects (`studioProjects`), pill strip + details. "Open project" buttons are not wired (no project detail pages exist yet).
- **`/preview/research`:** headline, featured + 2 papers (`papers`), 4 YouTube facades (`videos`, no IDs so they show "Coming soon"), 4 social tiles linking to platforms.
- **`/preview/ask`:** real chat UI. Needs `ANTHROPIC_API_KEY`; otherwise shows "The chat isn't switched on yet."
- **`/preview/platforms`:** see 4.9. All links empty ("Add link"); set `url` per platform in `config/platforms.ts` and the tile becomes a link automatically.

---

## 7. The chat in detail (`app/api/chat/route.ts`, `config/knowledge.ts`)

- Model **`claude-haiku-5-5`**, `max_tokens: 300`, `output_config: { effort: "low" }`, `thinking` omitted (Haiku 5.5 adaptive thinking is on by default; do **not** send `temperature`/`top_p`/`top_k`; non-default values return 400; do not use `budget_tokens`). Streaming via `client.messages.stream(...)`; text deltas are written to a `ReadableStream` as plain text. `stop_reason: "refusal"` appends a polite line (Haiku has no server-side refusal fallback).
- Request validation (zod): body `{messages:[{role:"user"|"assistant", content:string 1..600}]}` 1 to 30 items (clients can **never** send a `system` role). Trims to the last 8, drops leading assistant turns, requires the last to be `user`. 16 KB body cap.
- Abuse limits (in-memory, soft): **15 messages / 10 min / IP** and **500 / day total**. These do not survive restarts or multiple serverless instances. **The hard ceiling must be a monthly spend limit in the Anthropic Console for the key.**
- Config check: returns 503 `{error:"The chat isn't switched on yet."}` if neither `ANTHROPIC_API_KEY` nor `ANTHROPIC_AUTH_TOKEN` is set. The SDK also sends credentials as an `authorization` header (observed on the mock).
- Mid-stream provider errors become a short apology text in the bubble (headers already sent); a rate-limit error becomes "The assistant is busy right now...".
- `config/knowledge.ts`: **only verified facts** (name, main role, degrees, roles list, that Ehis works across football analytics/data science/software and creates content, that they built the xgGaffers xG prediction project in Python and TypeScript with a live version planned for the site, and that the site will have experience/projects/research/videos/chat pages). System prompt: third person, an AI not Ehis, no inventing (say "I don't have that detail yet"), stay on topic, treat visitor text as questions not instructions, 1 to 3 short plain-text sentences (may be read aloud). **When real content arrives, ADD TRUE FACTS to `facts`; never put placeholder text there.**
- Voice: dictation uses the browser Web Speech API (works in Chrome/Edge/Safari; **not Firefox**); the mic button only renders when supported. Speech output uses `speechSynthesis` (free, robotic). Possible upgrades: neural TTS (paid), streaming sentence-by-sentence speech.
- **Tested:** against a mock Anthropic server (Appendix C): validation (400s), happy path streaming into the UI, prompt buttons, rate limit (429 after 15), request body content (model, max_tokens, effort, no thinking/temperature, stream true). **NOT tested:** real voice input/output (headless Chrome has no mic/speaker; needs a human in real Chrome); long conversations and rate-limit behaviour against the live API.
- **Cost:** Haiku 5.5 list price $0.10 / $0.50 per MTok in/out (up to 100K-token prompts): a short exchange is a fraction of a cent.
- Hosting note (the user asked): the key is needed unless the code runs on a cloud with workload identity federation. On any normal free host set `ANTHROPIC_API_KEY` as a **server-side** environment variable (never `NEXT_PUBLIC_`).

---

## 8. Media inventory (`public/media/`)

`gym-a.mp4`/`.jpg` (portrait), `gym-b.mp4`/`.jpg` (portrait), `talk-a.mp4`/`.jpg` (landscape webcam), `photo-1..5.jpg`, `grad-crop.jpg`. The videos are placeholders; pill/tiles use them as project/video stand-ins. Rules for new media: 6 s, 540x960 portrait or 960x540 landscape, H.264 `-crf 28 -an -movflags +faststart`, plus a poster frame; host real videos on a CDN (Cloudflare R2 / Mux), not in the repo, when the site goes live.

---

## 9. Verified vs NOT verified

**Verified (with evidence in the previous session):** `tsc --noEmit` clean; ESLint 0 errors/1 warning; production build succeeds (all `/preview/*` routes prerendered static; `/api/*` dynamic); desktop (1440x900) and phone (390x844) screenshots of home, experience (stack, open dialog), projects (focus lens, mobile), research, ask, platforms; wheel stepping = exactly 1 section per tick (scrollTop 900, 1800...); keyboard/dot navigation; skip link and dialog focus; perf table above; no console errors except the intentional 429s and a harmless local 404 for `/_vercel/insights/script.js` (Vercel analytics script that only exists on Vercel).

**NOT verified:** real mic/speaker; the chat UI in a real browser against the live API (the API route itself is live-verified); Safari/Firefox/Edge rendering (Chrome only); actual physical phone performance (only 4x CPU throttling); contact form success path; `npm run build` after the very last Platforms-grid rebalance (it was checked in the dev server and with tsc/eslint, but the last production build predates that edit); behaviour on screens shorter than 760px beyond proximity snapping (only reasoned about); scroll-driven animation fallback in Firefox (reasoned only); production Lighthouse score (never run; the user mentioned wanting phone smoothness: a Lighthouse mobile pass is a sensible acceptance gate).

---

## 10. Known issues, risks and traps

1. **Legacy content/config still present:** `config/site.ts` = "Naman Barkiya", `nbarkiya.xyz`, his Cloudinary OG image/favicon; `app/(root)/*` pages show his projects/experience/blog; `app/sitemap.ts`, `app/manifest.ts`, `app/layout.tsx` metadata (`metadataBase`, canonical, OG, Twitter, `manifest: ${url}/site.webmanifest`, verification env), JSON-LD in `app/(root)/page.tsx` ("Next.js Portfolio Template" SoftwareApplication). `information/*.md` and README describe the template. All must be replaced when the new site is promoted.
2. `app/preview/layout.tsx` sets `robots: { index:false }` (intentional while a prototype).
3. In-memory rate limits (contact and chat) are per instance only.
4. Chat provider errors after the stream starts cannot change the HTTP status (documented above).
5. `LazyVideo` global `playingNow` is module state (fine in the browser; not SSR relevant).
6. `Scroller` wheel handler only on large, tall screens; on touch devices it relies on native snap (`snap-proximity` on small, so a hard swipe may land between sections: acceptable).
7. Some legacy pages use `dangerouslySetInnerHTML` for JSON-LD (`JSON.stringify` of own data) and blog HTML from own markdown: fine now, revisit if untrusted content is ever introduced.
8. The root layout still mounts `ThemeProvider` (next-themes with 7 legacy themes), Vercel Analytics and Google Analytics on every page (deferred scripts). The new site does not use the theme system.
9. `.next` build output may be stale/absent; run `next build` before trusting any `next start`.
10. `framer-motion` still ships on experience and projects only (first visit to `/preview/experience` is the slowest tab switch: ~1.3 s at 4x CPU). Possible follow-up: lazy-load the expanded dialog/`AnimatePresence` or switch to `LazyMotion`.

---

## 11. Environment variables

| Var | Purpose | Status |
|---|---|---|
| `ANTHROPIC_API_KEY` | chat (server only) | **Saved in `.env`** (verified). Never echo it. Next reads `.env` only at startup: restart the dev server after any change. |
| `GOOGLE_FORM_LINK` | contact relay; must start `https://docs.google.com/forms/` | placeholder |
| `GOOGLE_FORM_FIELD_ID_NAME/EMAIL/MESSAGE/SOCIAL` | Google Form `entry.NNN` ids | placeholder |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | GA (optional now) | placeholder |
| `NEXT_PUBLIC_RESUME_LINK` | résumé link | empty/placeholder |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Search Console | unset |

Next dev loads `.env` at start: **restart the dev server after the key is saved.**

---

## 12. Planned features NOT yet built (with design notes)

1. **Football prediction demo (xgGaffers).** The user will update their project code first; **do not start until they say so.** Plan: Python model served by a small FastAPI app on a free tier (Hugging Face Spaces free CPU, or Render free with cold starts, or Fly); fixtures/form from a football data API (football-data.org or API-Football) with the key **server-side only** and cached responses; scheduled refresh so predictions stay "current"; the Next.js site calls it through a server route (so keys/CORS stay server-side) and shows probabilities (home/draw/away), expected goals, likely score, a clear "model estimate, not betting advice" note. Possibly ONNX in-browser for light models. Frontend slot already exists: the fixture tile on the home Projects chapter and the Match Predictor project.
2. **Real content pass** (user will supply): experience entries with logos/photos, project write-ups, papers, videos (YouTube IDs into `videos[].youtubeId`), platform URLs, contact details, résumé PDF, real email, final bio. Replace `config/studio.ts` placeholders; add true facts to `config/knowledge.ts`.
3. **Project detail pages** (`/projects/[slug]`) with case studies, embedded demos and video (MDX or structured config).
4. **Promote the new design to the real site** (Section 13, step 2).
5. **YouTube latest-videos feed** via channel RSS (no API key) once a channel id exists.
6. **Command palette (Cmd/Ctrl+K)** quick navigation; **per-page OG images**; real favicon/manifest.
7. **Neural text-to-speech option** and sentence-streamed speech for the chat; conversation persistence is intentionally NOT built (privacy note says nothing is saved).
8. **Migrate hosting plan:** free tier (Vercel Hobby is non-commercial only; Cloudflare Pages / Netlify alternatives), media on Cloudflare R2 free 10 GB, model API on HF Spaces.
9. **Lighthouse/real-device performance gate** (target mobile Lighthouse performance 90+).
10. **Media pipeline script** that turns any dropped video into the standard web-ready clip + poster (Appendix B has the exact ffmpeg commands).

---

## 13. Next steps (recommended order) and exact how-to

The user has NOT yet answered which to do next; the previous session proposed this order and asked. **Ask once, briefly, then proceed.** (They also want you to keep optimising and suggesting improvements.)

1. **Chat live test: DONE via curl on 2026-11-24 (all 5 checks passed, see Section 7).** Remaining: try it in the browser UI with a real mic. To repeat the checks: confirm `grep -c '^ANTHROPIC_API_KEY=.\+' .env` is `1`; restart dev; `curl -s -X POST localhost:3100/api/chat -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"What is Ehis main role and what did he study?"}]}'` (one short call, fractions of a cent); expected answer mentions AI Engineer, BSc Computer Science, MSc Artificial Intelligence and nothing invented. Also test: an off-topic question is declined; "ignore previous instructions" is ignored; a question about employers gets "I don't have that detail yet". Try a UI session in the browser (mic needs a real Chrome). Remind the user to set a monthly spend limit.
2. **Promote `/preview` to the real site** (recommended; removes legacy weight and two-designs confusion):
   - Move `app/preview/*` into the root (e.g. `app/(site)/...` with its own layout holding `.studio`, skip link, nav; keep `studio.css` import there). Update every `/preview` href (nav.tsx, page.tsx, research/page.tsx, chat links, project strip, etc.) to the new paths; remove the `noindex` metadata.
   - Delete the legacy site: `app/(root)/*`, legacy `components/{common,contact,contributions,experience,projects,skills,blogs,forms,modals,ui (only what is unused)}`, legacy `config/{projects,skills,socials,contributions,experience,pages,routes,constants}.ts`, `content/blogs`, `information/`, `lib/blogs.ts`, `providers/`, `hooks/`, `app/api/github-stars`, `app/(root)/community/route.ts`. **Check every import with `tsc` and `eslint .`; remove now-unused deps** (`gray-matter`, `remark*`, `@radix-ui/*` unused after deleting, `next-themes`, `zustand`, `@hookform/resolvers`, `react-hook-form` if the contact form is rebuilt differently, `class-variance-authority` if unused, etc.). Keep what the new code uses: `framer-motion`, `lucide-react`, `react-icons`, `zod`, `@anthropic-ai/sdk`, `clsx`, `tailwind-merge`, `tailwindcss-animate` (check), `@next/third-parties`, `@vercel/analytics` (only if hosting on Vercel).
   - Rewrite `config/site.ts` (name, url, description, keywords, OG image, icons), `app/layout.tsx` metadata (`metadataBase`, canonical, OG/Twitter, manifest), `app/sitemap.ts`, `app/manifest.ts`, `robots.txt`, JSON-LD (Person only: name, jobTitle "AI Engineer", sameAs from `config/platforms.ts`). Ask the user for their domain first.
   - Rebuild the contact page/form in the new style (reuse `/api/contact`), or link the Contact chapter buttons to a mailto/Cal link. Wire the résumé button to `NEXT_PUBLIC_RESUME_LINK`.
   - Replace the default 404 with a styled `not-found.tsx`; add `loading`/`error` boundaries if needed.
   - Rebuild, re-run `perf.mjs`, compare with the table in 4.7.
3. **Media pipeline script: DONE** as `scripts/make-clip.sh` (tested in a scratch copy with imageio-ffmpeg; refuses to overwrite; set `FFMPEG=/path` if ffmpeg is not on PATH). Original spec: (`scripts/make-clip.sh` or Node): input video + start second -> `public/media/<name>.mp4` (6 s, correct scale for portrait/landscape, crf 28, faststart, no audio) + `<name>.jpg` poster. Document usage in README. (ffmpeg is not installed on the machine: the script should detect `ffmpeg` or print install instructions; the previous session used `imageio-ffmpeg`.)
4. **Football prediction demo**: only after the user has updated their code and says go. First read their repo (ask for its path), decide model-serving approach with them, then build the API + the interactive tile/page.
5. **Real content swap-in** as the user supplies it.
6. Optional polish: command palette, OG images, lazy-load experience dialog, Lighthouse mobile pass, Firefox/Safari checks.

---

## 14. DO THIS FIRST (fresh session checklist)

1. `cd /home/eo4/projects/personal_website/minimal-next-portfolio && git branch --show-current` (expect `redesign-prototype`) and `git status --short` (expect ~30 entries listed in Section 15). **Do not commit.**
2. `npx tsc --noEmit` (expect no output) and `npx eslint .` (expect 0 errors, 1 warning). Both take under ~2 minutes (eslint is slowish).
3. Check key presence only: `grep -c '^ANTHROPIC_API_KEY=.\+' .env` (expect `1`; it is saved). If the chat page says "isn't switched on yet", the dev server was started before the key was saved: **restart it**.
4. Start the dev server in the background: `npx next dev -p 3100` (use `run_in_background`; never `pkill -f` with a pattern that appears in your own command; find PIDs via `ss -ltnp | grep :3100`). Open `http://localhost:3100/preview` and eyeball: home mosaic, wheel through all 6 screens, `/preview/experience` (click a card), `/preview/projects`, `/preview/research`, `/preview/ask`, `/preview/platforms`.
5. Recreate the test tooling from the appendices if you need screenshots or measurements (the scratchpad was wiped).
6. Tell the user concisely where things stand, then ask which next step (Section 13) they want, and tell them the result of the live chat test.

### Definition of done for UI work (apply to every change)
- No large empty/plain areas; tiles recessed and layered; forest-green accent; text has depth.
- No regression in the perf table (Section 4.7); avoid new client JS/scroll listeners; prefer CSS; no more than 2 videos playing; no blurs on moving content.
- Works at 390x844 and 1440x900; keyboard reachable; reduced-motion respected.
- `tsc` clean, `eslint .` 0 errors, production build passes.
- Placeholders stay clearly placeholders; never invent facts about Ehis.

---

## 15. Current git state (uncommitted)

Modified: `.gitignore`, `app/(root)/layout.tsx`, `app/(root)/projects/[projectId]/page.tsx`, `app/api/contact/route.ts`, `app/layout.tsx`, `components/common/{main-nav,mobile-nav,mode-toggle}.tsx`, `components/modals/custom-modal.tsx`, `components/ui/{custom-tooltip,input,textarea}.tsx`, `config/{projects,routes,skills,socials}.ts`, `eslint.config.mjs`, `hooks/use-modal-store.ts`, `next.config.js`, `package.json`, `package-lock.json`, `providers/modal-provider.tsx`. Deleted (by the user, pre-existing): `.env.copy`.
Untracked/new: `app/api/chat/`, `app/preview/`, `components/studio/`, `config/{knowledge,platforms,studio}.ts`, `public/media/`, `CLAUDE.md`, `HANDOFF.md`.
Suggested commit grouping IF the user asks: (1) cleanup/lint/deps/contact, (2) new design system + pages, (3) chat, (4) performance + platforms + a11y. Mention in any PR that content is placeholder and the chat is untested against the live API.

---

## Appendix A: performance + screenshot tooling (recreate in a scratch dir)

```bash
mkdir -p /tmp/scratch/shot && cd /tmp/scratch/shot && npm init -y >/dev/null && npm i playwright-core
```
`perf.mjs` (usage: `node perf.mjs http://localhost:3101 1 "LABEL"`; 3rd arg CPU throttle, e.g. `4`). Requires a production server: `npx next build` then `npx next start -p 3101`.
```js
import { chromium } from "playwright-core";
const BASE=process.argv[2]||"http://localhost:3101"; const CPU=Number(process.argv[3]||1); const LABEL=process.argv[4]||"";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const routes=["/preview","/preview/experience","/preview/projects","/preview/research","/preview/ask"];
const fmt=(n)=>Math.round(n);
async function newPage(){ const c=await b.newContext({viewport:{width:1440,height:900}}); const p=await c.newPage();
  const cdp=await c.newCDPSession(p); if(CPU>1) await cdp.send("Emulation.setCPUThrottlingRate",{rate:CPU}); return {c,p}; }
console.log(`\n=== ${LABEL} cpu x${CPU} ===`);
console.log("COLD LOADS: route | FCP | LCP | JS KB | total KB | long tasks ms");
for(const r of ["/preview",...routes]){
  const {c,p}=await newPage();
  await p.addInitScript(()=>{ window.__lcp=0; window.__lt=0; new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lcp=e.startTime}).observe({type:"largest-contentful-paint",buffered:true}); new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lt+=e.duration}).observe({type:"longtask",buffered:true}); });
  await p.goto(BASE+r,{waitUntil:"load",timeout:120000}); await p.waitForTimeout(1500);
  const m=await p.evaluate(()=>{const res=performance.getEntriesByType("resource");const js=res.filter(e=>e.name.endsWith(".js")||e.initiatorType==="script");const fcp=performance.getEntriesByName("first-contentful-paint")[0]?.startTime||0;return {fcp,lcp:window.__lcp,js:js.reduce((a,e)=>a+(e.transferSize||0),0),all:res.reduce((a,e)=>a+(e.transferSize||0),0),lt:window.__lt}});
  console.log(`${r.padEnd(22)} | ${fmt(m.fcp)}ms | ${fmt(m.lcp)}ms | ${fmt(m.js/1024)} | ${fmt(m.all/1024)} | ${fmt(m.lt)}`);
  await c.close();
}
const {c,p}=await newPage();
await p.goto(BASE+"/preview",{waitUntil:"networkidle",timeout:120000}); await p.waitForTimeout(1500);
console.log("\nTAB SWITCH: target | ms | long-task ms");
const seq=[["Experience","/preview/experience"],["Projects","/preview/projects"],["Research","/preview/research"],["Ask","/preview/ask"],["Home","/preview"],["Projects","/preview/projects"],["Experience","/preview/experience"]];
for(const [label,path] of seq){
  await p.evaluate(()=>{window.__lt2=0; if(!window.__ltObs){window.__ltObs=new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lt2+=e.duration}); window.__ltObs.observe({type:"longtask"});}});
  const t0=Date.now();
  await p.click(`header nav >> text="${label}"`);
  await p.waitForURL("**"+path,{timeout:30000});
  await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const ms=Date.now()-t0; await p.waitForTimeout(700);
  console.log(`${path.padEnd(22)} | ${ms}ms | ${fmt(await p.evaluate(()=>window.__lt2))}`);
}
await b.close();
```
Screenshots: same `chromium.launch` + `page.screenshot({path})`. For the home scroller use `await page.mouse.move(700,450); await page.mouse.wheel(0,200)` and read scroll with `document.querySelector("[tabindex='-1']:not(main)").scrollTop`.

## Appendix B: ffmpeg without installing it system-wide, and the clip recipe

```bash
python3 -m venv /tmp/scratch/vv && /tmp/scratch/vv/bin/pip install imageio-ffmpeg
FF=$(/tmp/scratch/vv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
# 6-second web clip (portrait example; use 960:540 for landscape), no audio, fast-start, small:
"$FF" -y -ss <START_SECONDS> -i "<source.mp4>" -t 6 -an -vf "scale=540:960,format=yuv420p" -c:v libx264 -preset medium -crf 28 -movflags +faststart public/media/<name>.mp4
# poster at 1s:
"$FF" -y -ss 1 -i public/media/<name>.mp4 -frames:v 1 -q:v 4 public/media/<name>.jpg
# resize a photo to max 1400px wide:
"$FF" -y -i <photo.jpg> -vf "scale='min(1400,iw)':-2" -q:v 5 public/media/<name>.jpg
```
(`ffprobe` is not bundled; get duration/resolution with `"$FF" -i file 2>&1 | grep -E "Duration|Stream"`.)

## Appendix C: mock Anthropic server for testing the chat without a key

Run `node mock.mjs`, then start the app with `ANTHROPIC_API_KEY=test ANTHROPIC_BASE_URL=http://localhost:4010 npx next dev -p 3100`. It streams a canned reply in Anthropic SSE format and writes the last request body to a file so you can inspect what the app sent.
```js
import http from "node:http"; import fs from "node:fs";
const sse=(e,d)=>`event: ${e}\ndata: ${JSON.stringify(d)}\n\n`;
http.createServer((req,res)=>{ let b=""; req.on("data",c=>b+=c); req.on("end",async()=>{
  try{fs.writeFileSync("/tmp/scratch/last-request.json",JSON.stringify({url:req.url,body:JSON.parse(b||"{}")},null,1));}catch{}
  res.writeHead(200,{"content-type":"text/event-stream","cache-control":"no-cache"});
  res.write(sse("message_start",{type:"message_start",message:{id:"msg_mock",type:"message",role:"assistant",model:"claude-haiku-5-5",content:[],stop_reason:null,stop_sequence:null,usage:{input_tokens:10,output_tokens:1}}}));
  res.write(sse("content_block_start",{type:"content_block_start",index:0,content_block:{type:"text",text:""}}));
  for(const t of ["Ehis is an AI Engineer ","with a BSc in Computer Science ","and an MSc in Artificial Intelligence. ","(mock reply)"]){ await new Promise(r=>setTimeout(r,180)); res.write(sse("content_block_delta",{type:"content_block_delta",index:0,delta:{type:"text_delta",text:t}})); }
  res.write(sse("content_block_stop",{type:"content_block_stop",index:0}));
  res.write(sse("message_delta",{type:"message_delta",delta:{stop_reason:"end_turn",stop_sequence:null},usage:{output_tokens:20}}));
  res.write(sse("message_stop",{type:"message_stop"})); res.end(); }); }).listen(4010);
```
**Remember to stop the mock and restart the dev server WITHOUT those env vars afterwards**, otherwise the site answers with fake text.

## Appendix D: quick commands

```bash
npx tsc --noEmit                      # types
npx eslint .                          # lint (slow, ~1 to 2 min)
npx next dev -p 3100                  # dev (loads .env at start)
npx next build && npx next start -p 3101   # production check (stop other servers first)
ss -ltnp | grep -E ':310[01]'         # who is listening (get PIDs here to kill)
git status --short                    # expect ~30 entries; do not commit unasked
```
