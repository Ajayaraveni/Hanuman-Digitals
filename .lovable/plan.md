# Films Auto-Update — Architecture Analysis

Same goal as the Drive portfolio: client publishes content, site updates with zero developer involvement. Key twist: the client uploads *everything* to YouTube (short promos + 3–6h raw wedding videos), but only **curated, portfolio-grade films** should appear on the site.

---

## Option A — YouTube Data API, Channel uploads feed

How: resolve `@hanumandigitals1` → channel ID → `uploads` playlist → `playlistItems.list`.

- Complexity: Low.
- Static Cloudflare Pages: ✅ works (call from an edge function to hide the key, or from the browser with a referrer-restricted key).
- Google Cloud project: ✅ required.
- API key: ✅ required.
- Free quota: 10,000 units/day. `playlistItems.list` = 1 unit. Effectively unlimited for a studio.
- Performance: Fast (<300 ms), cacheable.
- Maintenance: Very low.
- **Pro:** zero client effort beyond uploading.
- **Con (deal-breaker here):** shows **every** upload, including 3–6 hour raw wedding videos. No curation. Client would have to keep raw footage off YouTube or rely on Unlisted, which is fragile.

## Option B — YouTube Data API, dedicated Playlist

How: client creates one playlist (e.g. "Website — Featured Films") and adds chosen videos to it. Site calls `playlistItems.list?playlistId=...`.

- Complexity: Low.
- Static Cloudflare Pages: ✅.
- Google Cloud project: ✅.
- API key: ✅.
- Free quota: same as A — trivially sufficient.
- Performance: Fast, cacheable.
- Maintenance: Very low.
- **Pro:** **client controls curation** with one click ("Add to playlist → Website Featured"). Raw 6-hour videos simply aren't added. Reordering = drag in YouTube Studio. Removing = one click.
- **Con:** client has to remember to add new films to the playlist (this is the *feature*, not a bug).

## Option C — YouTube RSS feed

How: `https://www.youtube.com/feeds/videos.xml?channel_id=...` returns latest 15 uploads as XML.

- Complexity: Lowest (no auth).
- Static Cloudflare Pages: ⚠️ CORS-blocked from the browser — needs an edge function proxy anyway.
- Google Cloud project: ❌ not needed.
- API key: ❌ not needed.
- Free quota: unlimited.
- Performance: Fast.
- Maintenance: Low, but Google has quietly changed/removed feed endpoints before.
- **Pro:** no API key, no quotas.
- **Con:** **channel-wide only** (same curation problem as A), capped at 15 items, no playlist variant, no duration/thumbnail metadata richness, undocumented/unsupported endpoint.

## Option D — Manual `films[]` array in code

Current state. Reliable, zero runtime deps, but every change is a developer task → fails the "no code changes" requirement.

## Option E — Drive-style: YouTube IDs in a Google Sheet / Drive JSON

Client maintains a sheet of video IDs + titles; site fetches via the existing Drive/Sheets pattern. Works, but adds a second workflow (upload to YouTube *and* edit a sheet) — worse client UX than Option B.

---

## Comparison

| Option | Client effort | Curation | Static fit | Needs API key | Quota risk | Reliability |
|---|---|---|---|---|---|---|
| A. Channel uploads | None | ❌ shows everything | ✅ | Yes | None | High |
| **B. Featured Playlist** | **1 click/video** | **✅ explicit** | **✅** | **Yes** | **None** | **High** |
| C. RSS | None | ❌ + 15-item cap | ✅ (via proxy) | No | None | Medium (undocumented) |
| D. Hardcoded | High (dev) | ✅ | ✅ | No | — | Highest |
| E. Sheet of IDs | Double entry | ✅ | ✅ | No | None | High |

---

## Recommendation — Option B: YouTube Data API + a dedicated "Website Featured" playlist

This is the YouTube equivalent of the Drive-folder pattern already used for the portfolio: **the client curates by putting items in a known container, and the site reads that container.**

Why it wins for this studio specifically:
- Solves the raw-wedding-video problem cleanly — long unedited uploads simply aren't added to the playlist.
- Client workflow stays inside YouTube Studio (one familiar tool, no second CMS).
- Ordering, hiding, and removing are all native YouTube actions — no developer involvement, ever.
- Free quota is ~10,000× what this site will use.
- Same architectural shape as the existing `drive-portfolio` edge function → consistent codebase.

---

## Implementation plan (build later, on approval)

1. **Client setup (one-time, ~2 minutes)**
   - In YouTube Studio, create a public playlist named e.g. "Hanuman Digitals — Featured Films".
   - Add the current showcase videos to it. Share the playlist URL with us so we can capture the playlist ID.

2. **Google Cloud (one-time)**
   - Create a Google Cloud project, enable **YouTube Data API v3**, generate an API key, restrict it by HTTP referrer (`*.hanumandigitals.com`, `*.pages.dev`, localhost) and to that single API.

3. **Edge function `youtube-films`** (mirrors `drive-portfolio`)
   - Reads `YOUTUBE_API_KEY` and `YOUTUBE_FEATURED_PLAYLIST_ID` from secrets.
   - Calls `playlistItems.list?part=snippet,contentDetails&maxResults=25&playlistId=...`.
   - Optionally calls `videos.list?part=contentDetails,statistics` for duration/view count.
   - Returns a normalized JSON: `{ id, title, description, thumbnail, publishedAt, duration }[]`.
   - 5–10 minute in-memory / `Cache-Control` cache to keep quota usage near zero.

4. **`Films.tsx` rewrite** (same pattern as `Portfolio.tsx`)
   - Fetches the edge function on mount, renders the existing card grid.
   - Keeps the current empty-state when the playlist is empty.
   - No changes to design, animations, or section layout.

5. **Ongoing client workflow**
   - Upload video to YouTube as usual (raw or short — doesn't matter).
   - For films to feature: open the video → "Save to playlist" → "Hanuman Digitals — Featured Films".
   - Site reflects the change within the cache window (≤10 min). No deploys, no PRs, no developer.

6. **Fallback / resilience**
   - If the API call fails, the section renders the existing "Visit Our YouTube Channel" empty-state so the page never breaks.

## Why not the others, in one line each
- **A (channel feed):** can't keep 6-hour raw videos out of the site.
- **C (RSS):** same curation problem + undocumented + 15-item ceiling.
- **D (hardcoded):** violates the "no code changes" requirement.
- **E (Sheet):** adds a second tool the client must remember to update.

No code will be written until you approve this direction.
