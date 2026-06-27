## Films Section — Auto-Sync from YouTube Channel

Pull latest uploads from **@hanumandigitals1** and **hide any video longer than 6 minutes** so raw wedding footage never appears. Zero client curation; matches the auto-update pattern already used by the Drive portfolio.

### Architecture

```text
YouTube Data API v3
        │
        ▼
Edge Function: youtube-films  ──(10 min cache)──▶  Films.tsx
        │                                                │
        └── filters: duration ≤ 6 min, public only       └── existing card grid (no design change)
```

### Implementation Steps

1. **Secret**: request `YOUTUBE_API_KEY` via `add_secret` (user creates one in Google Cloud Console → enable YouTube Data API v3 → API key, restricted to YouTube Data API).
2. **Edge function `supabase/functions/youtube-films/index.ts`**:
   - Resolve channel handle `@hanumandigitals1` → channel ID → uploads playlist ID (`channels.list` with `forHandle`).
   - `playlistItems.list` to fetch latest ~50 video IDs.
   - `videos.list` with `part=contentDetails,snippet,status` to get duration + privacy.
   - Parse ISO 8601 duration; keep videos where `duration ≤ 360s` AND `privacyStatus = public`.
   - Return normalized `{ id, title, description, thumbnail, publishedAt, duration }[]`, max 12.
   - In-memory 10-minute cache; CORS headers; graceful error → returns `{ films: [] }` so UI falls back to empty state.
3. **`Films.tsx` rewrite** (presentation only, same visual design):
   - On mount, `supabase.functions.invoke('youtube-films')`.
   - Loading skeleton → grid of existing video cards → existing empty-state if list is empty or fetch fails.
   - Click opens video in modal/new tab (keep current behavior).
4. **Verification**: deploy function, hit it once to confirm playlist resolves, load `/` and check Films grid renders only short videos.

### Caveats Acknowledged

- Legitimate films longer than 6 min won't appear. If that becomes a problem later, easiest upgrade is switching to a curated playlist (same function, smaller change).
- YouTube API daily quota is 10,000 units; this uses ~3 units per cache miss → effectively unlimited.

### What You Need to Provide

- Approve this plan.
- After approval, I'll request the `YOUTUBE_API_KEY` secret with instructions for generating it.
