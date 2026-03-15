import { getCollection } from 'astro:content';
import type { Locale } from './utils';

/**
 * Astro's glob loader sanitizes IDs: dots are stripped.
 * "test-title-sports.en.md" → ID "test-title-sportsen"
 * "test-title-sports.fr.md" → ID "test-title-sportsfr"
 * "nil-rights-european-football.md" → ID "nil-rights-european-football"
 *
 * We detect locale by checking if the ID ends with a known locale suffix.
 */
function parseEntry(id: string): { slug: string; locale: string } {
  // Check for locale suffix (no dot — Astro strips it)
  for (const loc of ['en', 'fr', 'it']) {
    if (id.endsWith(loc) && id.length > loc.length) {
      // Verify it's a real locale suffix, not part of the word
      // e.g. "garden" ends with "en" but isn't a locale file
      // CMS files always have the pattern: slug + locale (e.g. "my-articleen")
      // Original files never end with a bare locale code
      // We check: does a file with this base exist as another locale?
      const base = id.slice(0, -loc.length);
      return { slug: base, locale: loc };
    }
  }
  // No locale suffix — treat as English
  return { slug: id, locale: 'en' };
}

/**
 * Returns insights for a given locale with EN fallback.
 * - If a locale-specific version exists and has a title, use it
 * - Otherwise fall back to the EN version
 * - Articles without any EN version are skipped
 */
export async function getLocalizedInsights(locale: Locale = 'en') {
  const all = await getCollection('insights');

  // First pass: detect which base slugs have locale variants
  // (to distinguish "garden" from "my-articleen")
  const idSet = new Set(all.map(e => e.id));
  const hasLocaleVariants = new Set<string>();
  for (const entry of all) {
    for (const loc of ['en', 'fr', 'it']) {
      if (entry.id.endsWith(loc)) {
        const base = entry.id.slice(0, -loc.length);
        // Check if other locale variants exist with same base
        const otherLocs = ['en', 'fr', 'it'].filter(l => l !== loc);
        if (otherLocs.some(l => idSet.has(base + l))) {
          hasLocaleVariants.add(base);
        }
      }
    }
  }

  // Group entries by base slug
  const grouped = new Map<string, Map<string, typeof all[0]>>();
  for (const entry of all) {
    let slug: string;
    let lang: string;

    // Check if this entry's base has known locale variants
    let matched = false;
    for (const loc of ['en', 'fr', 'it']) {
      if (entry.id.endsWith(loc)) {
        const base = entry.id.slice(0, -loc.length);
        if (hasLocaleVariants.has(base)) {
          slug = base;
          lang = loc;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      // Plain file, no locale suffix — English
      slug = entry.id;
      lang = 'en';
    }

    if (!grouped.has(slug!)) grouped.set(slug!, new Map());
    grouped.get(slug!)!.set(lang!, entry);
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
