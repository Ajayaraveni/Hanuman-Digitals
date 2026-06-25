import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Reveal, SectionLabel } from "./Reveal";

type Category = { id: string; name: string };
type DriveImage = { id: string; name: string; thumb: string; url: string };

const CATEGORY_ORDER = [
  "Wedding Photography",
  "Wedding Cinematography",
  "Pre Wedding",
  "Pre-Wedding",
  "Portrait Photography",
  "Album Design",
];

function sortCategories(cats: Category[]): Category[] {
  return [...cats].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.name);
    const bi = CATEGORY_ORDER.indexOf(b.name);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function Portfolio() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState<Category | null>(null);
  const [imagesByCat, setImagesByCat] = useState<Record<string, DriveImage[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Load categories once
  useEffect(() => {
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/drive-portfolio?action=categories`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load categories");
        const sorted = sortCategories(json.categories ?? []);
        setCategories(sorted);
        if (sorted[0]) setActive(sorted[0]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load portfolio");
      }
    })();
  }, []);

  // Load images for the active category (cached)
  useEffect(() => {
    if (!active || imagesByCat[active.id]) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/drive-portfolio?action=images&folderId=${active.id}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load images");
        setImagesByCat((prev) => ({ ...prev, [active.id]: json.images ?? [] }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    })();
  }, [active, imagesByCat]);

  const images = active ? imagesByCat[active.id] ?? [] : [];

  return (
    <section id="portfolio" className="py-28 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <Reveal>
            <SectionLabel>Portfolio</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Moments, <span className="italic text-gradient-gold">framed forever</span>
            </h2>
          </Reveal>
        </div>

        {categories.length > 0 && (
          <Reveal>
            <div className="flex flex-wrap justify-center gap-2 mb-14">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c)}
                  className={`px-5 py-2 text-[11px] tracking-[0.25em] uppercase rounded-full border transition-all ${
                    active?.id === c.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {error && (
          <div className="text-center text-sm text-muted-foreground py-10">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        )}

        {!loading && !error && active && images.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-20">
            No images uploaded yet in {active.name}.
          </div>
        )}

        {!loading && images.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] gap-4"
          >
            <AnimatePresence mode="popLayout">
              {images.map((img, idx) => (
                <motion.button
                  layout
                  key={img.id}
                  onClick={() => setLightbox(img.url)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.02, 0.3) }}
                  className={`group relative overflow-hidden rounded-sm cursor-zoom-in ${
                    idx % 7 === 0 ? "row-span-2" : ""
                  }`}
                >
                  <img
                    src={img.thumb}
                    alt={img.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-xs tracking-[0.25em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    {active?.name}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-6 right-6 text-foreground p-3"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox}
              alt="Portfolio detail"
              referrerPolicy="no-referrer"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
