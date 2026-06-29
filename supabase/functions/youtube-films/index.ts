// Edge function: fetches videos from a YouTube playlist via YouTube Data API v3.
// Returns normalized film list. 10-min in-memory cache.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const API_KEY = Deno.env.get("YOUTUBE_API_KEY");
const PLAYLIST_ID = Deno.env.get("YOUTUBE_PLAYLIST_ID");
const CACHE_MS = 10 * 60 * 1000;

type Film = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

let cache: { at: number; films: Film[] } | null = null;

async function fetchFilms(): Promise<Film[]> {
  if (!API_KEY || !PLAYLIST_ID) throw new Error("YOUTUBE_API_KEY or YOUTUBE_PLAYLIST_ID not configured");

  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("maxResults", "25");
  url.searchParams.set("playlistId", PLAYLIST_ID);
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YouTube API ${res.status}: ${await res.text()}`);
  const data = await res.json();

  return (data.items ?? [])
    .map((item: any): Film | null => {
      const videoId = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
      if (!videoId) return null;
      const s = item.snippet ?? {};
      const thumbs = s.thumbnails ?? {};
      const thumbnail =
        thumbs.maxres?.url ?? thumbs.standard?.url ?? thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      return {
        id: videoId,
        title: s.title ?? "",
        description: s.description ?? "",
        thumbnail,
        publishedAt: s.publishedAt ?? item.contentDetails?.videoPublishedAt ?? "",
      };
    })
    .filter((f: Film | null): f is Film => f !== null && !!f.title && f.title !== "Private video" && f.title !== "Deleted video");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return Response.json({ films: cache.films }, { headers: corsHeaders });
    }
    const films = await fetchFilms();
    cache = { at: Date.now(), films };
    return Response.json({ films }, { headers: corsHeaders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("youtube-films error:", msg);
    return Response.json({ films: [], error: msg }, { status: 200, headers: corsHeaders });
  }
});
