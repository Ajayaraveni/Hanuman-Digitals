import { motion } from "framer-motion";
import whatsappIcon from "@/assets/whatsapp-icon.png.asset.json";

/**
 * Floating WhatsApp button — fixed to the bottom-right corner on every viewport.
 * Uses the official WhatsApp glyph supplied by the client (CDN-hosted asset).
 */
export function WhatsAppFloat() {
  const phone = "918885526529";
  const text = encodeURIComponent(
    "Hi Hanuman Digitals, I'd like to enquire about a shoot.",
  );

  return (
    <motion.a
      href={`https://wa.me/${phone}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Hanuman Digitals on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed z-[60] h-14 w-14 md:h-16 md:w-16 flex items-center justify-center drop-shadow-[0_10px_25px_rgba(37,211,102,0.45)]"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 1.25rem)",
      }}
    >
      <span className="absolute inset-[10%] rounded-full bg-[#25D366] opacity-40 animate-ping" />
      <img
        src={whatsappIcon.url}
        alt=""
        width={64}
        height={64}
        loading="eager"
        decoding="async"
        className="relative h-full w-full object-contain"
      />
    </motion.a>
  );
}
