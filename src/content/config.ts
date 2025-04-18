
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders'; // Not available with legacy API

const pages = defineCollection({
  loader: glob({ pattern: ['*.mdoc'], base: 'src/content/pages' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
})
const posts = defineCollection({
  loader: glob({ pattern: ['*.mdoc'], base: 'src/content/posts' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: ['*.mdoc'], base: 'src/content/projects' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image()

  }),
})

const portfolio = defineCollection({
  loader: glob({ pattern: ['*.mdoc'], base: 'src/content/portfolio' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image(),
    public: z.boolean(),
    category: z.string()
  }),
})

const categories = defineCollection({
  loader: glob({ pattern: ['*.yaml'], base: 'src/content/portfolio-categories' }),
//   // Type-check frontmatter using a schema
   schema: ({ image }) => z.object({
     title: z.string(),
     cover: image().optional(),
     onHome: z.boolean().optional(),
     type: z.enum([
      'portfolio',
      'project',
      'coming-soon',
     ]).optional(),

     order: z.number().optional(),
   }),
})



export const collections = { posts, portfolio, projects, categories, pages }
