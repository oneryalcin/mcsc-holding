import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['News', 'Events', 'Insights']),
    publishDate: z.coerce.date(),
    coverImage: z.string(),
    excerpt: z.string(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    quote: z.string(),
    image: z.string(),
    category: z.enum(['Partners', 'Advisors', 'Providers']),
    order: z.number().default(0),
  }),
});

export const collections = { insights, team };
