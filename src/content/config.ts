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
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image()

  }),
})

const portfolio = defineCollection({
  // Type-check frontmatter using a schema
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image()

  }),
})



export const collections = { posts, portfolio, projects }
