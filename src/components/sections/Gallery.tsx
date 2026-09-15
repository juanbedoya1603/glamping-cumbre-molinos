import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { motionTokens, springs } from '../../lib/motion-tokens';

export interface GalleryImage {
  id: string;
  alt: string;
  span: 'feature' | 'wide' | 'tall' | 'normal';
  thumbSrc: string;
  thumbSrcSet: string;
  thumbWidth: number;
  thumbHeight: number;
  fullSrc: string;
  fullWidth: number;
  fullHeight: number;
}

interface GalleryProps {
  images: GalleryImage[];
  /** How many images stay visible on mobile before "Ver más fotos" reveals the rest. Desktop always shows all. */
  mobileVisibleCount: number;
  contactUrl?: string;
}

const SPAN_CLASSES: Record<GalleryImage['span'], string> = {
  feature: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  normal: 'col-span-1 row-span-1',
};

/**
 * Editorial masonry/collage grid with a click-to-open lightbox. Not a
 * carousel — nothing auto-plays. Follows the motion-patterns modal contract:
 * AnimatePresence + stable key + exit always defined, role="dialog" +
 * aria-modal, Escape-to-close, focus trap, scroll lock.
 */
export default function Gallery({ images, mobileVisibleCount, contactUrl }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = useReducedMotion();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const isOpen = openIndex !== null;
  const activeImage = isOpen ? images[openIndex] : null;

  const closeLightbox = useCallback(() => setOpenIndex(null), []);

  const openLightbox = useCallback((index: number, trigger: HTMLElement) => {
    lastFocusedRef.current = trigger;
    setOpenIndex(index);
  }, []);

  const showPrev = useCallback(() => {
    setOpenIndex((idx) => (idx === null ? idx : (idx - 1 + images.length) % images.length));
  }, [images.length]);

  const showNext = useCallback(() => {
    setOpenIndex((idx) => (idx === null ? idx : (idx + 1) % images.length));
  }, [images.length]);

  // Scroll lock while the lightbox is open, and move focus into the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
    };
  }, [isOpen]);

  // Restore focus to whatever triggered the lightbox once it closes.
  useEffect(() => {
    if (!isOpen && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [isOpen]);

  // Escape closes, arrow keys navigate, Tab is trapped inside the dialog.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrev();
        return;
      }
      if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeLightbox, showNext, showPrev]);

  const panelInitial = {
    opacity: 0,
    y: reduceMotion ? 0 : motionTokens.distance.sm,
    scale: reduceMotion ? 1 : motionTokens.scale.press,
  };
  const panelAnimate = { opacity: 1, y: 0, scale: 1 };

  return (
    <>
      <div className="grid auto-rows-[130px] grid-cols-2 gap-2 sm:auto-rows-[150px] sm:gap-3 md:auto-rows-[170px] md:grid-cols-4 md:gap-3">
        {images.map((image, index) => {
          const isExtra = index >= mobileVisibleCount;
          return (
            <button
              key={image.id}
              type="button"
              onClick={(event) => openLightbox(index, event.currentTarget)}
              className={`group relative overflow-hidden rounded-xl bg-forest-900/10 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${SPAN_CLASSES[image.span]} ${
                isExtra && !revealed ? 'hidden md:block' : 'block'
              }`}
              aria-label={`Ampliar foto: ${image.alt}`}
            >
              <img
                src={image.thumbSrc}
                srcSet={image.thumbSrcSet}
                sizes="(min-width: 768px) 25vw, 50vw"
                width={image.thumbWidth}
                height={image.thumbHeight}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-forest-950/0 transition-colors duration-300 group-hover:bg-forest-950/10"
              />
            </button>
          );
        })}
      </div>

      {images.length > mobileVisibleCount && (
        <div className="mt-5 flex justify-center md:hidden">
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-expanded={revealed}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-forest-700/30 px-5 py-2.5 font-sans text-sm font-semibold text-forest-800 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-forest-950/5 active:scale-[0.97]"
          >
            {revealed ? 'Ver menos fotos' : 'Ver más fotos'}
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && activeImage && (
          <motion.div
            key="gallery-lightbox"
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }}
          >
            <div
              className="absolute inset-0 bg-forest-950/92"
              onClick={closeLightbox}
              aria-hidden="true"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-forest-950"
              initial={panelInitial}
              animate={panelAnimate}
              exit={panelInitial}
              transition={springs.gentle}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                <p id={titleId} className="truncate font-sans text-sm text-cream-100/80">
                  {activeImage.alt}
                </p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cream-50 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-cream-50/10 active:scale-90"
                  aria-label="Cerrar galería"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden bg-forest-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage.id}
                    src={activeImage.fullSrc}
                    width={activeImage.fullWidth}
                    height={activeImage.fullHeight}
                    alt={activeImage.alt}
                    initial={{ opacity: 0, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                    className="mx-auto max-h-[65vh] w-auto object-contain"
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 text-cream-50 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-forest-950/80 active:scale-90"
                      aria-label="Foto anterior"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 text-cream-50 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-forest-950/80 active:scale-90"
                      aria-label="Foto siguiente"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="font-sans text-xs text-cream-100/60">
                  {openIndex !== null ? openIndex + 1 : 0} / {images.length}
                </p>
                {contactUrl && <a
                  href={contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-whatsapp-cta
                  data-section="gallery_lightbox"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gold-500 px-5 text-sm font-semibold text-forest-950 transition-transform active:scale-[0.97] hover:bg-gold-400"
                >
                  Consultar disponibilidad
                </a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
