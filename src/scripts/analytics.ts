/**
 * Central analytics wiring. Every WhatsApp CTA, gallery open, and FAQ open
 * fires here via event delegation — no per-component tracking code needed.
 * No-ops safely when no analytics provider is configured yet (gtag is
 * undefined until a real GA4 ID is wired in).
 */

function track(event: string, params: Record<string, string> = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

document.addEventListener('click', (e) => {
  const target = (e.target as HTMLElement).closest<HTMLElement>('[data-whatsapp-cta]');
  if (target) {
    track('click_whatsapp', { section: target.dataset.section ?? 'unknown' });
    return;
  }

  const galleryTile = (e.target as HTMLElement).closest<HTMLElement>('[aria-label^="Ampliar foto"]');
  if (galleryTile) {
    track('gallery_open', { photo: galleryTile.getAttribute('aria-label') ?? 'unknown' });
  }
});

document.addEventListener(
  'toggle',
  (e) => {
    const details = e.target as HTMLElement;
    if (!details.matches('.faq-item') || !(details as HTMLDetailsElement).open) return;
    const question = details.querySelector('summary span')?.textContent ?? 'unknown';
    track('faq_open', { question });
  },
  true
);
