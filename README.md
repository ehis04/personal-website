# Ehis Oghina: personal website

The personal website of **Ehis Oghina**, an AI Engineer (BSc Computer Science, Dublin City University; MSc Artificial Intelligence, University of Birmingham) who also works as a data scientist, software engineer and football analyst, and builds and creates content. Live at **https://ehisoghina.com** once deployed.

It is a dark, forest-green, tile-based multimedia site: a full-screen snapped home page, expandable experience cards, a project strip, research and platform pages, and a chat assistant that answers questions about Ehis.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v3 · framer-motion (experience and projects only) · Anthropic SDK (`claude-haiku-5-5` for the chat).

Performance is a hard requirement: scroll and entrance effects are plain CSS (scroll-driven animations), most components are server components, at most two videos play at once, and nothing blurs moving content.

## Pages

| Route | What it is |
|---|---|
| `/` | Home: six full-screen sections (mosaic, experience, projects, research, ask, contact) |
| `/experience` | Stacked role cards that expand into a full-screen detail view |
| `/projects` | Horizontal pill strip with a focus lens and a detail panel |
| `/research` | Research, video previews (YouTube facades) and social links |
| `/ask` | Chat assistant with typed or dictated questions and spoken answers |
| `/platforms` | Everywhere Ehis can be found |
| `/api/chat` | Streaming chat endpoint (server-side API key, rate limited) |
| `/api/contact` | Contact relay to a Google Form (no page uses it yet) |

## Run it

```bash
npm install
cp .env.example .env     # if you have one; otherwise create .env (see below)
npm run dev              # http://localhost:3000
```

```bash
npm run build && npm start   # production check
npx tsc --noEmit             # types
npx eslint .                 # lint
```

### Environment variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Powers `/ask`. Server-side only: never prefix it with `NEXT_PUBLIC_`. Set a monthly spend limit for the key in the Anthropic Console. |
| `NEXT_PUBLIC_SITE_URL` | Optional. Overrides the default `https://ehisoghina.com` for canonical links, the sitemap and Open Graph. |
| `NEXT_PUBLIC_RESUME_LINK` | Optional `https://` link that activates the résumé tile. |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Optional Google Analytics id. |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Optional Search Console verification token. |
| `GOOGLE_FORM_LINK`, `GOOGLE_FORM_FIELD_ID_NAME/EMAIL/MESSAGE/SOCIAL` | Only for `/api/contact`. |

`.env` is git-ignored. The `ideas/` folder (references and raw media) is git-ignored too and is never committed.

## Where the content lives

| File | Holds |
|---|---|
| `config/studio.ts` | Degrees, experience, projects (from Ehis's CV), plus placeholder papers, videos and socials |
| `config/platforms.ts` | Every platform Ehis can be found on; add a `url` and the tile becomes a link |
| `config/knowledge.ts` | The **verified facts** the chat assistant may use. Only add true facts here, never placeholders |
| `config/site.ts` | Site name, description, domain, social image |
| `public/media/` | Web-ready photos and short clips |

Photos and clips on the site are currently Ehis's own pictures used as placeholders. Projects are not hosted yet, so their pages link to GitHub where a public repo exists and say "Live demo coming soon".

### Adding a video clip

```bash
scripts/make-clip.sh <source-video> <name> [start-seconds] [portrait|landscape]
```

Makes a 6-second, silent, compressed clip and a poster in `public/media/`. Needs `ffmpeg` (or set `FFMPEG=/path/to/ffmpeg`). Host long videos on a CDN, not in the repo.

## Project layout

```
app/
  (site)/        the pages above, the .studio layout, nav and studio.css (all styling)
  api/           chat and contact routes
components/studio/   tiles, scroller, experience stack, project strip, chat ...
config/          content and site settings
public/media/    photos and clips
scripts/         make-clip.sh
```

## Hosting

Nothing is deployed yet. Recommendation, checked against current docs:

**Cloudflare Workers via the OpenNext adapter, with the domain on Cloudflare DNS.**

- The free plan allows 100,000 requests per day and 10 ms of CPU per request ([limits](https://developers.cloudflare.com/workers/platform/limits)). Waiting on network calls does not count as CPU, so the streaming chat is fine. Every page here is prerendered static, so CPU use is tiny.
- Ehis already deploys Social Olympics this way, so the tooling is familiar.
- **Vercel Hobby** is the easiest for Next.js but is restricted to non-commercial personal use ([fair use policy](https://vercel.com/docs/platform/fair-use-policy)). A portfolio used to find paid work sits in a grey area, so it is not the first pick.
- Next.js 16 is supported by the adapter, but Cloudflare now points brand-new Next.js apps at its own `vinext` ([docs](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)), so check the current guidance when you set it up.

Things to do when deploying:

1. Set `ANTHROPIC_API_KEY` as a server-side secret, and a monthly spend cap in the Anthropic Console.
2. The chat and contact rate limits are in-memory, which resets per instance and does not hold across Workers. Move them to Upstash Redis (already used by Social Olympics) or Cloudflare's rate limiting.
3. Put large videos on Cloudflare R2 (free tier) rather than in `public/`.
4. The football prediction demo needs a small Python service. Free options: Hugging Face Spaces (CPU) or Render's free tier (cold starts). The site would call it through a server route so keys stay server-side.
5. Swap the placeholder social image (`/media/photo-3.jpg`) for a 1200×630 card.

## Status

- Real content: education, experience and projects, from Ehis's CV.
- Placeholder: papers, videos, social handles, the contact email, the résumé link, and all photos and clips used as images.
- Not hosted: none of the projects have live demos yet.

## Licence

MIT. The project started from the open-source `minimal-next-portfolio` template by Naman Barkiya, whose copyright notice is kept in [LICENSE](LICENSE). The design, pages, components and content here are new.
