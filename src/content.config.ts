import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const shared = {
  title: z.string(),
  date: z.coerce.date(),
  skills: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
};

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    ...shared,
    outcome: z.string(),
    featured: z.boolean().default(false),
    links: z.object({ live: z.string().url().optional(), repo: z.string().url().optional(), demo: z.string().url().optional() }).default({}),
  }),
});

const credentials = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/credentials' }),
  schema: z.object({
    ...shared,
    kind: z.enum(['certificate', 'seminar']),
    issuer: z.string(),
    cluster: z.object({ id: z.string(), label: z.string() }).optional(),
    highlight: z.boolean().default(false),
    verifyUrl: z.string().url().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({ ...shared, draft: z.boolean().default(false) }),
});

export const collections = { projects, credentials, notes };
