import { Reveal, SectionLabel } from "./Reveal";
import { Play, Youtube } from "lucide-react";

/**
 * Featured Cinematic Films — sourced from the Hanuman Digitals YouTube channel:
 *   https://www.youtube.com/@hanumandigitals1
 *
 * AUTOMATIC INTEGRATION (not yet wired):
 * To auto-fetch the latest uploads, the YouTube Data API v3 is required:
 *   1. Create a Google Cloud project and enable "YouTube Data API v3".
 *   2. Generate an API key restricted to the production domain.
 *   3. Resolve the channel ID from the @hanumandigitals1 handle via:
 *        GET https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=hanumandigitals1&key=API_KEY
 *      then read `items[0].contentDetails.relatedPlaylists.uploads` for the
 *      uploads playlist ID.
 *   4. Fetch the latest videos via:
 *        GET https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=UPLOADS_ID&key=API_KEY
 *      and map each `items[].snippet` into the `Film` shape below.
 *
 * Until the API key is available, populate `films` manually with real video IDs
 * from the channel. The component renders an empty-state CTA when the list is
 * empty, so the section degrades gracefully.
 */
type Film = { id: string; title: string };

const CHANNEL_URL = "https://www.youtube.com/@hanumandigitals1";

// TODO: Replace with real Hanuman Digitals YouTube video IDs (or wire up the
// YouTube Data API as documented above). Each entry must be the `?v=` ID.
const films: Film[] = [];

export function Films() {
  return (
    <section id="films" className="py-28 md:py-40 px-6 bg-card/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <Reveal><SectionLabel>YouTube Channel</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Featured <span className="italic text-gradient-gold">Cinematic Films</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-muted-foreground">
              A curated selection of our recent wedding films and cinematic stories.
            </p>
          </Reveal>
        </div>

        {films.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map((f, i) => (
              <Reveal key={`${f.id}-${i}`} delay={i * 0.06}>
                <a
                  href={`https://www.youtube.com/watch?v=${f.id}`}
                  target="_blank"
                  rel="noopener"
                  className="group block rounded-sm overflow-hidden border border-border hover:border-gold/50 transition-all duration-500 bg-background"
                >
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={`https://i.ytimg.com/vi/${f.id}/hqdefault.jpg`}
                      alt={f.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-background/70 backdrop-blur border border-gold/60 flex items-center justify-center group-hover:bg-gold group-hover:text-background transition-all">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg group-hover:text-gold transition-colors">
                      {f.title}
                    </h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="border border-dashed border-gold/30 rounded-sm bg-background/60 p-12 md:p-16 text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-6">
                <Youtube className="w-7 h-7 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">
                Our latest films live on YouTube
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Real wedding films from the Hanuman Digitals channel will appear here once the
                YouTube integration is connected. In the meantime, browse the full library on
                our official channel.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="text-center mt-14">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold btn-outline-gold-hover px-8 py-4 rounded-full inline-flex items-center gap-2 text-sm"
            >
              <Youtube className="w-4 h-4" /> Visit Our YouTube Channel
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
