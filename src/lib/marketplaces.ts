export type Locale = 'es' | 'en' | 'fr' | 'it' | 'de';

export const LOCALES: readonly Locale[] = ['es', 'en', 'fr', 'it', 'de'];

export const DEFAULT_LOCALE: Locale = 'es';

export const MARKETPLACES = {
  es: { tld: 'es',    locale: 'es-ES', currency: 'EUR' },
  fr: { tld: 'fr',    locale: 'fr-FR', currency: 'EUR' },
  it: { tld: 'it',    locale: 'it-IT', currency: 'EUR' },
  en: { tld: 'co.uk', locale: 'en-GB', currency: 'GBP' },
  de: { tld: 'de',    locale: 'de-DE', currency: 'EUR' },
} as const satisfies Record<Locale, { tld: string; locale: string; currency: string }>;

export function formatPrice(value: number, lang: Locale, currency?: string): string {
  const mp = MARKETPLACES[lang];
  return new Intl.NumberFormat(mp.locale, {
    style: 'currency',
    currency: currency ?? mp.currency,
  }).format(value);
}

export function formatNumber(value: number, lang: Locale): string {
  return new Intl.NumberFormat(MARKETPLACES[lang].locale).format(value);
}
