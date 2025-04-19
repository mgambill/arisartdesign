
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders'; // Not available with legacy API

const pages = defineCollection({
  loader: glob({ pattern: ['*.mdoc'], base: 'src/content/pages' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string().optional(),
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
  loader: glob({ pattern: ['*.yaml'], base: 'src/content/categories' }),
//   // Type-check frontmatter using a schema
   schema: z.object({
    label:  z.string(),
    order: z.number().optional(),
   }),
})
const sections = defineCollection({
  loader: glob({ pattern: ['*.yaml'], base: 'src/content/sections' }),
//   // Type-check frontmatter using a schema
   schema: ({ image }) => z.object({
     title: z.string(),
     cover: image().optional(),
     type: z.enum([
      'portfolio',
      'project',
      'coming-soon',
     ]).optional(),

     order: z.number().optional(),
   }),
})



export const collections = { posts, portfolio, projects, categories, pages, sections }
