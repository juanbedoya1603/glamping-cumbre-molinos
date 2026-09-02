import { site, whatsappMessages, type WhatsappSection } from '../config/site';

/**
 * Builds a wa.me link with a contextual, prefilled message for the given
 * section. This is the single source of truth for WhatsApp CTAs — every
 * button in the app should call this instead of hand-building a link.
 *
 * Click tracking is handled separately by the delegated listener in
 * src/scripts/analytics.ts, keyed off the `data-whatsapp-cta` /
 * `data-section` attributes every CTA renders — not from this function.
 */
export function buildWhatsappUrl(section: WhatsappSection): string {
  const message = whatsappMessages[section];
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
