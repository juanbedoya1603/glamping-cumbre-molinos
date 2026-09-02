import { site, whatsappMessages, type WhatsappSection } from '../config/site';

interface BuildWhatsappUrlOptions {
  /** Extra tracking context appended only to the outgoing analytics event, never to the visible message. */
  campaign?: string;
}

/**
 * Builds a wa.me link with a contextual, prefilled message for the given
 * section. This is the single source of truth for WhatsApp CTAs — every
 * button in the app should call this instead of hand-building a link.
 */
export function buildWhatsappUrl(section: WhatsappSection, _options: BuildWhatsappUrlOptions = {}): string {
  const message = whatsappMessages[section];
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/**
 * Fires the `click_whatsapp` analytics event (if a tracker is present) and
 * returns the URL to navigate to. Call this from onClick handlers instead
 * of buildWhatsappUrl directly so every CTA is measured consistently.
 */
export function trackAndBuildWhatsappUrl(section: WhatsappSection): string {
  const url = buildWhatsappUrl(section);
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'click_whatsapp', { section });
  }
  return url;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
