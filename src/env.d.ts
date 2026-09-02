/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** GA4 measurement ID (e.g. "G-XXXXXXXXXX"). Leave unset to ship no analytics script at all. */
  readonly PUBLIC_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  gtag?: (...args: unknown[]) => void;
}
