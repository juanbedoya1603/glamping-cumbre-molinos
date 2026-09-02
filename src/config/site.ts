/**
 * Central site configuration.
 * Change business facts here — never hardcode them in components.
 * Anything not yet confirmed by the business stays `null` and must not be
 * rendered as fact anywhere in the UI.
 */

export const site = {
  brandName: 'Glamping Cumbre de los Molinos',
  shortName: 'Cumbre de los Molinos',
  tagline: 'Escápate de la rutina sin irte lejos.',
  location: {
    city: 'Dosquebradas',
    department: 'Risaralda',
    country: 'Colombia',
    nearby: 'Cerca de Pereira',
    mapUrl: 'https://maps.app.goo.gl/Uor7NRuJD3yLPp2VA',
    /** Confirmed coordinates, resolved from the business's own Google Maps pin. */
    latitude: 4.832406,
    longitude: -75.64903,
  },
  /** Canonical production URL. Update once the Cloudflare Pages / custom domain is final. */
  siteUrl: 'https://glamping-cumbre-molinos.pages.dev',
  whatsapp: {
    /** E.164 without the leading "+", as required by wa.me links. Provisional per business request. */
    number: '573218727000',
    displayNumber: '+57 321 872 7000',
  },
  social: {
    /** Fill in once the official account exists. */
    instagram: null as string | null,
    facebook: null as string | null,
  },
  /** Registro Nacional de Turismo — only render when confirmed. */
  rnt: null as string | null,
  checkIn: '3:00 p. m.',
  /** Checkout is the day after arrival. */
  checkOut: '12:00 m. del día siguiente',
  parking: true,
  petFriendly: true,
  paymentMethods: ['Efectivo', 'Transferencia'] as const,
} as const;

/**
 * Contextual WhatsApp message templates, keyed by the section/CTA that
 * triggers them. Keep each one short, natural, and specific to intent —
 * this is what makes the conversation start warm instead of generic.
 */
export const whatsappMessages = {
  hero: 'Hola, vi la página de Glamping Cumbre de los Molinos y quiero consultar disponibilidad para una estadía.',
  sticky: 'Hola, quiero consultar disponibilidad en Glamping Cumbre de los Molinos.',
  accommodation: 'Hola, quiero conocer las opciones de alojamiento disponibles para mi fecha.',
  jacuzzi: 'Hola, quiero conocer las opciones con tina de agua caliente disponibles.',
  celebration: 'Hola, quiero preparar una sorpresa en Glamping Cumbre de los Molinos. ¿Qué opciones de decoración y precios tienen?',
  horseback: 'Hola, quiero información sobre alojamiento y cabalgata.',
  atv: 'Hola, quiero conocer las opciones de alojamiento y recorrido en cuatrimoto.',
  massage: 'Hola, quiero información sobre los masajes disponibles.',
  nature: 'Hola, quiero más información sobre las experiencias con animales y naturaleza.',
  food: 'Hola, quiero saber qué opciones de comida puedo pedir durante mi estadía.',
  gallery: 'Hola, vi las fotos de Glamping Cumbre de los Molinos y quiero consultar disponibilidad.',
  location: 'Hola, quiero confirmar la ubicación exacta de Glamping Cumbre de los Molinos.',
  faq: 'Hola, tengo una pregunta sobre Glamping Cumbre de los Molinos.',
  final: 'Hola, quiero contarles la fecha que tengo en mente para mi escapada.',
} as const;

export type WhatsappSection = keyof typeof whatsappMessages;
