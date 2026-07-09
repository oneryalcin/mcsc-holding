import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    locale: z.string().optional().default('en'),
    title: z.string().optional().default(''),
    category: z.enum(['News', 'Events', 'Insights']).optional(),
    publishDate: z.coerce.date().optional(),
    coverImage: z.string().optional().default(''),
    excerpt: z.string().optional().default(''),
    tags: z.preprocess((v) => v ?? [], z.array(z.string()).default([])),
  }),
});

// Translatable text stored inline as { en, fr, it } — EN required, others optional
// (fall back to EN). Mirrors the desc shape in src/data/network.ts.
const localeText = z.object({
  en: z.string(),
  fr: z.string().optional(),
  it: z.string().optional(),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    image: z.string(),
    category: z.enum(['Partners', 'Advisors', 'Providers']),
    honorific: z.string().optional(),
    // Homepage layout: members are grouped by category, then by `row`, then
    // sorted by `order` within the row. A row's column count = members in it.
    row: z.number().default(1),
    order: z.number().default(0),
    role: localeText,
    bio: localeText.optional(),
  }),
});

export const collections = { insights, team };
