import en from './en.json';
import fr from './fr.json';
import it from './it.json';

const translations: Record<string, Record<string, string>> = { en, fr, it };

export type Locale = 'en' | 'fr' | 'it';
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'fr', 'it'];

export function t(key: string, locale: Locale = defaultLocale): string {
  const dict = translations[locale] ?? translations[defaultLocale];
  return dict[key] ?? translations[defaultLocale][key] ?? key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  if (locales.includes(segment as Locale)) return segment as Locale;
  return defaultLocale;
}

export function getLocalePath(path: string, locale: Locale): string {
  const localized = locale === defaultLocale ? path : `/${locale}${path}`;
  // Netlify serves directory URLs with a trailing slash; emit links in that
  // form so internal navigation doesn't bounce through a 301.
  if (localized.includes('#') || localized.includes('?') || localized.endsWith('/')) return localized;
  return `${localized}/`;
}

type LocalizedOptionalText = Partial<Record<Locale, string>>;

export function getDisplayName(
  name: string,
  honorific: string | LocalizedOptionalText | undefined,
  locale: Locale,
): string {
  let prefix = typeof honorific === 'string' ? '' : honorific?.[locale];

  // Backwards compatibility for older content that used one shared string.
  if (typeof honorific === 'string') {
    if (locale === 'fr') prefix = 'Me';
    if (locale === 'it') prefix = honorific;
  }

  const trimmedPrefix = prefix?.trim();
  return trimmedPrefix ? `${trimmedPrefix} ${name}` : name;
}
