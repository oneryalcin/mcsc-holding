import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string().optional().default(''),
    category: z.enum(['News', 'Events', 'Insights']).optional(),
    publishDate: z.coerce.date().optional(),
    coverImage: z.string().optional().default(''),
    excerpt: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    slug: z.string(),
    quote: z.string().optional().default(''),
    image: z.string(),
    category: z.enum(['Partners', 'Advisors', 'Providers']),
    order: z.number().default(0),
  }),
});

export const collections = { insights, team };
