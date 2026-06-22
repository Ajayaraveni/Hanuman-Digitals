import { motion } from "framer-motion";

/**
 * Floating WhatsApp button — fixed to the bottom-right corner on every viewport.
 * Uses the official WhatsApp glyph (inline SVG) so it stays crisp at every DPR
 * and never depends on an external asset.
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
      className="fixed z-[60] bottom-5 right-5 md:bottom-6 md:right-6 h-14 w-14 md:h-16 md:w-16 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] flex items-center justify-center"
      style={{
        // Respect iOS safe-area insets so the button never sits under the home indicator.
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 1.25rem)",
      }}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
      <svg
        viewBox="0 0 32 32"
        className="relative h-7 w-7 md:h-8 md:w-8"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.682.244-1.05 0-.43-1.518-1.156-1.847-1.243zm-2.305 7.034a8.31 8.31 0 0 1-4.246-1.16l-3.045.984.99-2.985a8.34 8.34 0 0 1-1.318-4.49c0-4.622 3.768-8.39 8.39-8.39 4.62 0 8.39 3.768 8.39 8.39s-3.77 8.39-8.39 8.39zm0-18.41c-5.534 0-10.02 4.486-10.02 10.02 0 1.733.45 3.43 1.304 4.92L6.21 26.04a.673.673 0 0 0 .68.88l5.4-1.013a10 10 0 0 0 4.514 1.08c5.534 0 10.022-4.488 10.022-10.022 0-5.534-4.488-10.02-10.022-10.02z" />
      </svg>
    </motion.a>
  );
}
