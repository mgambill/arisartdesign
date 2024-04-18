// @ts-ignore
import { defineCollection, z } from "astro:content"

const posts = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
})

const projects = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    image: z.string(),
  }),
})

const portfolio = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    image: z.string(),
  }),
})


export const collections = { posts, portfolio, projects }
