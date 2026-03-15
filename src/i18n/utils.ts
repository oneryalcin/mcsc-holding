import en from './en.json';

const translations: Record<string, Record<string, string>> = { en };

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
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}
