import { useState } from "react";
import { Reveal, SectionLabel } from "./Reveal";
import {
  MapPin, Phone, Mail, MessageCircle, ArrowRight, Instagram, Youtube,
} from "lucide-react";

const SERVICES = [
  "Wedding Photography",
  "Wedding Cinematography",
  "Pre-Wedding Shoot",
  "Portrait Photography",
  "Album Design",
  "Maternity Shoot",
  "Baby Shoot",
  "Birthday Event",
  "Corporate Event",
];

const SERVICE_CITIES = [
  { city: "Hyderabad", note: "Studio · Chikkadapally" },
  { city: "Adilabad", note: "Studio · Cinema Road" },
  { city: "Nirmal", note: "Studio · Narayan Reddy Market" },
  { city: "Nizamabad", note: "Studio · Beside Bus Stand" },
];

/**
 * Enquiry form.
 *
 * Submissions are delivered to sanjayuttoor07@gmail.com via a `mailto:` draft —
 * this keeps the site fully static (Cloudflare Pages friendly) and avoids any
 * server dependency. When a backend is added (Lovable Cloud / Formspree / etc.)
 * swap the `mailto:` handler for a `fetch` POST without touching the markup.
 */
const TO_EMAIL = "sanjayuttoor07@gmail.com";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const data = new FormData(f);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const subject = `New Enquiry — ${get("service") || "Photography"} — ${get("name")}`;
    const body =
      `Name: ${get("name")}\n` +
      `Phone: ${get("phone")}\n` +
      `Email: ${get("email")}\n` +
      `Event Date: ${get("date")}\n` +
      `Event Location: ${get("location")}\n` +
      `Service Required: ${get("service")}\n\n` +
      `Message:\n${get("message")}\n`;

    window.location.href =
      `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSent(true);
    f.reset();
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <section id="contact" className="py-28 md:py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <Reveal><SectionLabel>Get In Touch</SectionLabel></Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl">
              Let's create <span className="italic text-gradient-gold">something beautiful</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <Reveal>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <input name="name" required maxLength={100} placeholder="Your Name" className="bg-card border border-border focus:border-gold rounded-sm px-5 py-4 w-full outline-none transition-colors" />
                <input name="phone" required type="tel" maxLength={20} placeholder="Phone Number" className="bg-card border border-border focus:border-gold rounded-sm px-5 py-4 w-full outline-none transition-colors" />
              </div>
              <input name="email" required type="email" maxLength={255} placeholder="Email" className="bg-card border border-border focus:border-gold rounded-sm px-5 py-4 w-full outline-none transition-colors" />
              <div className="grid sm:grid-cols-2 gap-6">
                <input name="date" type="date" placeholder="Event Date" className="bg-card border border-border focus:border-gold rounded-sm px-5 py-4 w-full outline-none transition-colors text-muted-foreground" />
                <input name="location" maxLength={120} placeholder="Event Location" className="bg-card border border-border focus:border-gold rounded-sm px-5 py-4 w-full outline-none transition-colors" />
              </div>
              <select name="service" defaultValue="" required className="bg-card border border-border focus:border-gold rounded-sm px-5 py-4 w-full outline-none transition-colors text-muted-foreground">
                <option value="" disabled>Service Required</option>
                {SERVICES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <textarea name="message" required maxLength={1000} placeholder="Tell us about your event..." rows={5} className="bg-card border border-border focus:border-gold rounded-sm px-5 py-4 w-full outline-none transition-colors resize-none" />
              <button type="submit" className="btn-gold btn-gold-hover px-8 py-4 rounded-full inline-flex items-center gap-2 text-sm">
                {sent ? "Thank you — your enquiry has been prepared. Please send the email to confirm." : <>Send Enquiry <ArrowRight className="w-4 h-4" /></>}
              </button>
              {sent && (
                <p className="text-xs text-muted-foreground">
                  Your default mail app should open with the details. If it didn't, write to{" "}
                  <a href={`mailto:${TO_EMAIL}`} className="text-gold hover:underline">{TO_EMAIL}</a>.
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-8">
              <div className="p-8 border border-border rounded-sm bg-card/50">
                <h3 className="font-serif text-2xl mb-6">Reach Out To Us</h3>
                <div className="space-y-5 text-sm">
                  <a href="tel:+918885526529" className="flex gap-4 hover:text-gold transition-colors">
                    <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span>+91 88855 26529</span>
                  </a>
                  <a href="https://wa.me/918885526529" target="_blank" rel="noopener" className="flex gap-4 hover:text-gold transition-colors">
                    <MessageCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a href={`mailto:${TO_EMAIL}`} className="flex gap-4 hover:text-gold transition-colors">
                    <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <span>{TO_EMAIL}</span>
                  </a>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                  <a href="https://www.instagram.com/hanuman_digitals/" target="_blank" rel="noopener" aria-label="Instagram" className="w-10 h-10 rounded-full border border-border hover:border-gold hover:text-gold transition-all flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://www.youtube.com/@hanumandigitals1" target="_blank" rel="noopener" aria-label="YouTube" className="w-10 h-10 rounded-full border border-border hover:border-gold hover:text-gold transition-all flex items-center justify-center">
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div>
                <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-4">Service Locations</div>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_CITIES.map((l) => (
                    <div
                      key={l.city}
                      className="p-5 border border-border rounded-sm bg-card/40 hover:border-gold/50 hover:bg-card transition-all duration-500"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                        <div>
                          <div className="font-serif text-lg">{l.city}</div>
                          <div className="text-[11px] text-muted-foreground mt-1">{l.note}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
