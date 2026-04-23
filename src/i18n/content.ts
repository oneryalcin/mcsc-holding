import { getCollection } from 'astro:content';
import type { Locale } from './utils';

/**
 * Derives a base slug from the entry ID by stripping any locale suffix.
 * Uses the `locale` frontmatter field when available for reliable detection.
 * Falls back to filename heuristics for older entries without the field.
 */
function getBaseSlug(id: string, entryLocale?: string): string {
  // If we know the locale from frontmatter, strip it from the end of the ID
  if (entryLocale && id.endsWith(entryLocale)) {
    return id.slice(0, -entryLocale.length);
  }
  // No locale suffix — the ID itself is the slug
  return id;
}

/**
 * Returns insights for a given locale with EN fallback.
 * - If a locale-specific version exists and has a title, use it
 * - Otherwise fall back to the EN version
 * - Articles without any EN version are skipped
 */
export async function getLocalizedInsights(locale: Locale = 'en') {
  const all = await getCollection('insights');

  // Group entries by base slug
  const grouped = new Map<string, Map<string, typeof all[0]>>();
  for (const entry of all) {
    const entryLocale = (entry.data as any).locale || 'en';
    const slug = getBaseSlug(entry.id, entryLocale);

    if (!grouped.has(slug)) grouped.set(slug, new Map());
    grouped.get(slug)!.set(entryLocale, entry);
  }

  // Resolve: pick locale version if it has content, else EN
  const resolved: Array<{ entry: typeof all[0]; slug: string }> = [];

  for (const [slug, versions] of grouped) {
    const en = versions.get('en');
    if (!en || !en.data.title) continue;

    if (locale === 'en') {
      resolved.push({ entry: en, slug });
      continue;
    }

    const localized = versions.get(locale);
    if (localized && localized.data.title) {
      // Merge: locale fields override EN, empty fields fall back to EN
      const merged = {
        ...localized,
        data: {
          ...en.data,
          ...Object.fromEntries(
            Object.entries(localized.data).filter(([_, v]) => v !== '' && v != null)
          ),
        },
      };
      resolved.push({ entry: merged as typeof all[0], slug });
    } else {
      resolved.push({ entry: en, slug });
    }
  }

  return resolved.sort(
    (a, b) => new Date(b.entry.data.publishDate!).getTime() - new Date(a.entry.data.publishDate!).getTime()
  );
}
