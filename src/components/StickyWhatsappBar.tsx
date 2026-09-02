import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { springs } from '../lib/motion-tokens';
import { buildWhatsappUrl } from '../lib/whatsapp';

/**
 * Persistent mobile WhatsApp CTA. Appears once the visitor scrolls past the
 * hero (which already has its own CTA) so it never fights for attention on
 * first paint. Stays available for the rest of the scroll.
 */
export default function StickyWhatsappBar() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const heroHeight = window.innerHeight;
    const onScroll = () => {
      setVisible(window.scrollY > heroHeight * 0.75);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sticky-whatsapp"
          className="safe-bottom fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden"
          initial={{ y: reduce ? 0 : 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 72, opacity: 0 }}
          transition={springs.gentle}
        >
          <a
            href={buildWhatsappUrl('sticky')}
            target="_blank"
            rel="noopener noreferrer"
            data-whatsapp-cta
            data-section="sticky_bar"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gold-500 font-sans text-base font-semibold text-forest-950 shadow-lg shadow-forest-950/20 transition-transform active:scale-[0.97]"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12.01 2C6.48 2 2 6.48 2 12.01c0 1.98.58 3.83 1.58 5.39L2 22l4.75-1.55a9.96 9.96 0 0 0 5.26 1.5c5.53 0 10.01-4.48 10.01-10.01C22.02 6.48 17.54 2 12.01 2Zm0 18.13c-1.7 0-3.28-.5-4.61-1.36l-.33-.2-2.82.92.93-2.75-.21-.35a8.1 8.1 0 0 1-1.24-4.38c0-4.5 3.66-8.16 8.16-8.16s8.28 3.66 8.28 8.16-3.78 8.12-8.16 8.12Zm4.48-6.13c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34 1 2.5.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
            </svg>
            <span>Consultar disponibilidad</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
