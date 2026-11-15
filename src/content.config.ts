import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const userGuides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/user-guides' }),
  schema: z.object({
    articleId: z.enum([
      'ug01',
      'ug02',
      'ug03',
      'ug04',
      'ug05',
      'ug06',
      'ug07',
      'ug08',
      'ug09',
      'ug10',
    ]),
    locale: z.enum(['vi', 'en']),
    title: z.string(),
    sourceRevision: z.string(),
    approvalStatus: z.enum(['draft', 'approved']),
    approvalReference: z.string(),
  }),
});

export const collections = { userGuides };
