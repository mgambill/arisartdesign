// @ts-ignore
import { defineCollection, z } from "astro:content"

const posts = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
})

const portfolios = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
})
const projects = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
})

export const collections = { posts, portfolios }