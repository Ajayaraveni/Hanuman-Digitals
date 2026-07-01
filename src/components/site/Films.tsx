import { useEffect, useState } from "react";
import { Reveal, SectionLabel } from "./Reveal";
import { Play, Youtube } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type Film = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

const CHANNEL_URL = "https://www.youtube.com/@hanumandigitals1";

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function Films() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState<Film | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("youtube-films");
        if (cancelled) return;
        if (error) {
          setFailed(true);
        } else {
          const list: Film[] = (data?.films ?? []).slice(0, 6);
          setFilms(list);
          if (!list.length && data?.error) setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-sm overflow-hidden border border-border bg-background">
                <Skeleton className="aspect-video w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : films.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => setActive(f)}
                  className="group block w-full text-left rounded-sm overflow-hidden border border-border hover:border-gold/50 transition-all duration-500 bg-background"
                >
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img
                      src={f.thumbnail}
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
                    <h3 className="font-serif text-lg group-hover:text-gold transition-colors line-clamp-2">
                      {f.title}
                    </h3>
                    {f.publishedAt && (
                      <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                        {formatDate(f.publishedAt)}
                      </p>
                    )}
                  </div>
                </button>
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
                {failed ? "Videos are temporarily unavailable" : "Our latest films live on YouTube"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {failed
                  ? "Please visit our YouTube channel to view our latest cinematic films."
                  : "New films from the Hanuman Digitals channel will appear here soon."}
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

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-4xl p-0 border-gold/30 bg-background overflow-hidden">
          {active && (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
