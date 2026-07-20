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
// (fall back to EN). Shared by team role/bio and network desc.
const localeText = z.object({
  en: z.string(),
  fr: z.string().optional(),
  it: z.string().optional(),
});

const optionalLocaleText = z.object({
  en: z.string().optional(),
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
    honorific: z.union([z.string(), optionalLocaleText]).optional(),
    // Homepage layout: members are grouped by category, then by `row`, then
    // sorted by `order` within the row. A row's column count = members in it.
    row: z.number().default(1),
    order: z.number().default(0),
    role: localeText,
    bio: localeText.optional(),
  }),
});

// Network entries (partnerships + selected service providers). desc is the same
// inline { en, fr, it } shape as team role/bio; `order` controls display order.
const networkEntry = z.object({
  name: z.string(),
  url: z.string(),
  logo: z.string().optional(),
  order: z.number().default(0),
  desc: localeText,
});

const partnerships = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/partnerships' }),
  schema: networkEntry,
});

const providers = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/providers' }),
  schema: networkEntry,
});

export const collections = { insights, team, partnerships, providers };
