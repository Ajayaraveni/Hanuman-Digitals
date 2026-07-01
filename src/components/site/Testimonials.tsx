import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionLabel } from "./Reveal";
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

type Review = { n: string; l?: string; t: string };
const reviews: Review[] = [
  {
    n: "Rahul & Sneha",
    t: "Hanuman Digitals beautifully captured every emotion of our wedding. The photos and cinematic film exceeded our expectations.",
  },
  {
    n: "Kiran Kumar",
    t: "Our pre-wedding shoot was creative, fun, and professionally managed. Every frame tells a story.",
  },
  {
    n: "Anusha Reddy",
    t: "The entire team was incredibly patient and delivered stunning portraits. We couldn't be happier.",
  },
  {
    n: "Praveen & Meghana",
    t: "From photography to album design, everything was delivered with exceptional quality and attention to detail.",
  },
  {
    n: "Srinivas Family",
    t: "They captured our baby's first birthday perfectly. Every special moment was preserved beautifully.",
  },
  {
    n: "Corporate Event Client",
    t: "Professional team, excellent coordination, and outstanding event coverage. Highly recommended.",
  },
];

function useVisibleCount() {
  const [n, setN] = useState(2);
  useEffect(() => {
    const update = () => {
      setN(window.innerWidth >= 768 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return n;
}

export function Testimonials() {
  const visible = useVisibleCount();
  const [index, setIndex] = useState(0);
  const max = reviews.length;
  const hasReviews = max > 0;

  const next = () => setIndex((i) => (i + 1) % Math.max(max, 1));
  const prev = () => setIndex((i) => (i - 1 + Math.max(max, 1)) % Math.max(max, 1));

  useEffect(() => {
    if (!hasReviews) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [max, hasReviews]);

  const shown = hasReviews
    ? Array.from({ length: Math.min(visible, max) }, (_, k) => reviews[(index + k) % max])
    : [];

  return (
    <section id="testimonials" className="py-28 md:py-40 px-6 bg-card/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <Reveal><SectionLabel>Testimonials</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Words from <span className="italic text-gradient-gold">our families</span>
            </h2>
          </Reveal>
        </div>

        {hasReviews ? (
          <div className="relative">
            <div
              className={`grid gap-8 ${
                visible === 2 ? "md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {shown.map((r, i) => (
                  <motion.div
                    key={`${index}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="relative p-10 border border-border rounded-sm bg-background hover:border-gold/40 transition-all duration-500 h-full group"
                  >
                    <Quote className="w-10 h-10 text-gold/20 absolute top-6 right-6 group-hover:text-gold/40 transition-colors" />
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="font-serif text-xl leading-relaxed mb-8 text-foreground/90">
                      "{r.t}"
                    </p>
                    <div className="pt-6 border-t border-border">
                      <div className="font-serif text-lg text-gold">{r.n}</div>
                      {r.l && (
                        <div className="text-xs tracking-[0.25em] uppercase text-muted-foreground mt-1">
                          {r.l}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full border border-border hover:border-gold hover:text-gold transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                {String(index + 1).padStart(2, "0")} / {String(max).padStart(2, "0")}
              </div>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full border border-border hover:border-gold hover:text-gold transition-all flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <Reveal>
            <div className="border border-dashed border-gold/30 rounded-sm bg-background/60 p-12 md:p-16 text-center max-w-3xl mx-auto">
              <div className="flex gap-1 justify-center mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">
                Trusted by 5000+ families across Telangana
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Verified client testimonials will appear here shortly. If we've captured your
                wedding or studio session, we'd love to hear about your experience.
              </p>
              <a
                href="https://wa.me/918885526529?text=I%27d%20like%20to%20share%20my%20experience%20with%20Hanuman%20Digitals"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold btn-outline-gold-hover px-8 py-4 rounded-full inline-flex items-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Share Your Experience
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
