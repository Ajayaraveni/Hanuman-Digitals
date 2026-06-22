
# Auto-Updating Portfolio: Architecture Analysis

Goal: client uploads images into 5 category folders; the Cloudflare Pages site reflects new images automatically, with zero developer involvement and minimal client effort.

Site constraint: pure static hosting (Cloudflare Pages / Netlify / Vercel) — no SSR, no Node server, no Workers required.

---

## Option 1 — Google Drive API (direct, client-side)

How it works: browser calls `drive.files.list` with an API key, filtered by folder IDs, and renders thumbnails via `https://drive.google.com/thumbnail?id=...` or `lh3.googleusercontent.com` URLs.

- Complexity: Medium. Needs a Google Cloud project, API key, each folder shared "Anyone with link", folder IDs hard-coded per category.
- Cost: Free (well under Drive API quotas for a small studio).
- Reliability: Medium. Google throttles hotlinked Drive image URLs; thumbnails sometimes 403 under load or get rate-limited. Drive is not a CDN.
- Client ease: Excellent. Drag-and-drop into a Drive folder; done.
- Static-host suitability: Works (pure client fetch), but exposes API key in the bundle (restrict by HTTP referrer).
- Risk: Drive image hotlinking has historically broken (Google has changed `uc?export=view` and `thumbnail` endpoints more than once).

## Option 2 — Google Apps Script + JSON feed

How it works: an Apps Script bound to the Drive folders publishes a web app returning JSON `[{category, id, name, thumbnailLink}]`. Site fetches that JSON at runtime (or at build time).

- Complexity: Low–Medium. One script, one deploy, one URL.
- Cost: Free.
- Reliability: Medium. Same underlying Drive image-serving issue; Apps Script web apps have daily quotas and occasional cold-start latency (1–3s).
- Client ease: Excellent (same as Option 1 — just drop files in Drive).
- Static-host suitability: Great — pure `fetch()` from the static site.
- Note: Best paired with a small client-side cache; still depends on Drive URLs for the actual image bytes.

## Option 3 — Google Photos

How it works: Google Photos Library API + shared albums per category.
- Complexity: High. OAuth required (no API-key mode), tokens must be refreshed server-side → needs a Worker/Function, which violates the "no backend" constraint.
- Cost: Free.
- Reliability: Medium; Google has deprecated parts of the Photos API for third-party apps in 2025.
- Client ease: Good (upload to album).
- Static-host suitability: Poor — needs a token broker. Not recommended.

## Option 4 — Cloudflare R2 (+ optional Worker or static manifest)

How it works: client uploads via a simple admin page (or rclone/Cyberduck) to an R2 bucket with category prefixes; site reads from a public R2 bucket or via Cloudflare's image transformations.

- Complexity: Medium-High. R2 has no "drag here" UI for non-technical clients; needs either a custom upload page (requires auth + Worker) or a desktop S3 client.
- Cost: Very low. R2 has zero egress; storage ~$0.015/GB/mo. Pennies for a studio.
- Reliability: Excellent. Served from Cloudflare's CDN, no hotlink throttling.
- Client ease: Poor out of the box (no native folder UI the client will love).
- Static-host suitability: Excellent — same platform.

## Option 5 (recommended) — Drive as source of truth + build-time sync to repo/R2

How it works: a scheduled GitHub Action (cron, e.g. hourly) runs a small Node script using a Google service account that:
1. Lists each category folder in Drive.
2. Downloads new/changed images.
3. Optimizes them (sharp → WebP, multiple sizes).
4. Either commits them to `public/portfolio/<category>/` and triggers a Pages rebuild, OR uploads them to R2 and writes a `portfolio.json` manifest.

The site reads a static `portfolio.json` (or imports a generated manifest) — no runtime Drive calls.

- Complexity: Medium one-time setup; zero ongoing.
- Cost: Free (GitHub Actions free tier + Cloudflare Pages free + optional R2 pennies).
- Reliability: Excellent. Images are served as static assets from Cloudflare's CDN. No Drive hotlinking, no API quotas at request time, no broken thumbnails.
- Client ease: Excellent — they keep using Drive folders exactly as today.
- Static-host suitability: Perfect — site stays 100% static.
- Bonus: automatic responsive images, lazy loading, SEO-friendly URLs, works offline in preview.

---

## Comparison summary

| Option | Client ease | Reliability | Cost | Static-host fit | Long-term maintenance |
|---|---|---|---|---|---|
| 1. Drive API (client) | A | C | Free | B (API key exposed) | Medium (Drive URL changes) |
| 2. Apps Script JSON | A | C+ | Free | A | Medium |
| 3. Google Photos | B | C | Free | D (needs backend) | High |
| 4. R2 only | C | A | ~$0 | A | Low |
| 5. Drive → CI sync → static/R2 | A | A | Free–$0 | A | Very low |

---

## Recommendation

**Option 5: Google Drive as the client-facing upload surface, with a scheduled GitHub Action that syncs to the repo (or R2) and rebuilds the Cloudflare Pages site.**

Why it wins for a small studio uploading hundreds of images over time:
- Client workflow stays "drop into the Drive folder" — what they already understand.
- Images are served by Cloudflare's CDN as real static files → fastest LCP, best SEO, no Drive throttling.
- No runtime dependency on Google = no surprise outages or API deprecations affecting visitors.
- Automatic image optimization (WebP + responsive sizes) is impossible with Options 1–3.
- Free at this scale; trivially scales to thousands of images.

Fallback if you want zero CI setup: **Option 2 (Apps Script JSON feed)** is the simplest "live" approach and acceptable for a low-traffic portfolio, with the caveat that Drive-hosted image URLs can be flaky.

---

## Proposed implementation outline (for the next step, once you approve)

1. Google Cloud: create a service account, share the 5 Drive folders with its email (Viewer).
2. Repo: add `scripts/sync-portfolio.mjs` (Drive list → download → sharp resize → write `public/portfolio/<category>/<slug>.webp` + `src/data/portfolio.json`).
3. GitHub Action: cron every hour + manual trigger; commits changes; Cloudflare Pages auto-deploys on push.
4. Frontend: replace hard-coded imports in `Portfolio.tsx` with `import portfolio from "@/data/portfolio.json"` and map by category.
5. Optional: switch storage target from repo to R2 if total image weight grows beyond ~500 MB.

No code changes will be made until you approve this direction (and pick: commit-to-repo vs upload-to-R2).
