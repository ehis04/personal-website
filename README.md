# Ehis Oghina: personal website

The personal website of **Ehis Oghina**, an AI Engineer (BSc Computer Science, Dublin City University; MSc Artificial Intelligence, University of Birmingham) who also works as a data scientist, software engineer and football analyst, and builds and creates content. Live at **https://ehisoghina.com**.

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
| `/cv` | Interactive CV: hover a section to highlight it, click to expand the detail |
| `/ask` | Chat assistant with typed or dictated questions and spoken answers |
| `/platforms` | Everywhere Ehis can be found |
| `/api/chat`, `/api/speak` | The only server code (`worker/index.ts`): streaming chat (Claude) and natural text-to-speech (Workers AI). Server-side keys, same-site only, rate limited |

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
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Optional. Makes the API rate limits global (recommended on Workers). |
| `NEXT_PUBLIC_SITE_URL` | Optional. Overrides the default `https://ehisoghina.com` for canonical links, the sitemap and Open Graph. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional public contact email, shown on the Contact tile and in the footer. Kept in `.env` so it never lands in the public repo. Unset = no email is shown. |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Optional Google Analytics id. |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | Optional Search Console verification token. |

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

### Adding or changing photos

```bash
node scripts/make-image-variants.mjs
```

Next.js cannot resize images on Cloudflare Workers, so every photo in `public/media/` (and the CV page images in `public/cv/`) is pre-sized into small WebP files. Run this after adding or replacing a photo, then commit the generated `-384/-640/-828/-1200.webp` files.

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

## Hosting: Cloudflare (static files + one tiny Worker)

Every page is **static**. `npm run build` writes plain files to the `out/` folder and Cloudflare serves them straight from its edge, with no code running, so there is no cold start and no CPU limit on the free plan. The only server code is `worker/index.ts` (the Ask assistant), which Cloudflare runs **only for `/api/*`** (`assets.run_worker_first` in `wrangler.jsonc`). It talks to Anthropic with plain `fetch`, so it stays light.

> Why not Next.js on Workers (OpenNext)? It worked, but each fresh Worker had to boot the whole Next server. On the free plan (10 ms CPU per request) that failed about 1 request in 8 with Cloudflare error 1102, including some chat messages. Static files plus a tiny API Worker fixed it: 0 failures in 80 page requests and 12 simultaneous chats, and the server wait fell from a median of 159 ms (worst 762 ms) to about 60 ms.

```bash
npm run build        # static site into out/
npm run preview:cf   # build, then run site + API locally on the Workers runtime
npm run deploy:cf    # build and deploy to Cloudflare
```

### First deploy (one-time)

1. `npx wrangler login` (opens a browser to sign in to Cloudflare).
2. Set the chat key as a Worker secret (it never goes in git):
   `npx wrangler secret put ANTHROPIC_API_KEY`
3. `npm run deploy:cf`. The site appears at `https://ehisoghina.<your-subdomain>.workers.dev`.
4. `ehisoghina.com` and `www.ehisoghina.com` are attached through the `routes` in `wrangler.jsonc` once the domain is a zone on your Cloudflare account.
5. **www to the main domain:** a static site cannot redirect by host name, so add the free Cloudflare template: Rules → Redirect Rules → "Redirect from WWW to root". Pages already name `ehisoghina.com` as their canonical address, so search engines are not confused in the meantime.
6. Optional: a free Upstash Redis database and the secrets `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` make the chat's rate limits hold across every Worker instance (`lib/rate-limit.ts`); without them they are per instance.
7. Set a monthly spend limit on the API key in the Anthropic Console. This is the real ceiling.

For local Worker testing, put secrets in `.dev.vars` (git-ignored). Security and cache headers live in `public/_headers`.

### Later

- Put large videos on Cloudflare R2 (free tier) rather than in `public/`.
- The football prediction demo needs a small Python service. Free options: Hugging Face Spaces (CPU) or Render's free tier (cold starts). The Worker would call it so keys stay server-side.

## Status

- Real content: education, experience and projects, from Ehis's CV.
- Placeholder: papers, videos, social handles, the contact email, the résumé link, and all photos and clips used as images.
- Not hosted: none of the projects have live demos yet.

## Licence

MIT. The project started from the open-source `minimal-next-portfolio` template by Naman Barkiya, whose copyright notice is kept in [LICENSE](LICENSE). The design, pages, components and content here are new.
