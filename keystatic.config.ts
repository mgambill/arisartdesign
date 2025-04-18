import {
  config,
  fields,
  collection,
  singleton,
  type LocalConfig,
  type CloudConfig,
} from "@keystatic/core"
import { wrapper, repeating } from "@keystatic/core/content-components"

const isProd = process.env.NODE_ENV === "production"

const localConfig: LocalConfig["storage"] = {
  kind: "local",
}
const cloudConfig: CloudConfig["storage"] = {
  kind: "cloud",
}

export default config({
  storage: isProd ? cloudConfig : localConfig,
  cloud: {
    project: "victoria/aris-art-design",
  },
  ui: {
    navigation: {
      Site: ["portfolio", "posts", "projects", "samples"],
      Pages: ["about", "home", "coming"],
      "Footer Links": ["socialLinks", "---", "settings", "categories"],
    },
  },
  singletons: {
    socialLinks: singleton({
      label: "Social Links",
      path: "src/content/social-links",
      schema: {
        twitter: fields.text({
          label: "Twitter",
          description: "Twitter username",
        }),
        instagram: fields.text({
          label: "Instagram",
          description: "IG handle username",
        }),
        facebook: fields.text({
          label: "Facebook",
          description: "facebook username",
        }),
        youTube: fields.text({
          label: "YouTube",
          description: "You Tube username",
        }),
      },
    }),
    settings: singleton({
      label: "Settings",
      path: "src/content/settings",
      schema: {
        title: fields.text({ label: "Title" }),
        description: fields.text({ label: "Description" }),
        keywords: fields.text({ label: "Keywords" }),
      },
    }),
    about: singleton({
      label: "About",
      path: "src/content/pages/about",
      format: {
        contentField: "content",
      },
      schema: {
        title: fields.text({ label: "Title" }),
        content: fields.markdoc({
          label: "Content",
          extension: "mdoc",
          options: {
            divider: true,
            image: {
              directory: "src/assets/images/about",
              publicPath: "../../assets/images/about/",
            },
          },
        }),
      },
    }),
    home: singleton({
      label: "Home",
      path: "src/content/pages/home",
      format: {
        contentField: "content",
      },
      schema: {
        title: fields.text({ label: "Title" }),
        showPosts: fields.checkbox({ label: "Show Posts" }),
        content: fields.markdoc({
          label: "Content",
          options: {
            image: {
              directory: "src/assets/images/home",
              publicPath: "../../assets/images/home/",
            },
          },
        }),
      },
    }),
    coming: singleton({
      label: "Coming Soon",
      path: "src/content/pages/coming-soon",
      format: {
        contentField: "content",
      },
      schema: {
        content: fields.markdoc({
          label: "Content",
          extension: "mdoc",
          options: {
            divider: true,
            image: {
              directory: "src/assets/images/about",
              publicPath: "../../assets/images/about/",
            },
          },
        }),
      },
    }),
  },
  collections: {
    samples: collection({
      label: "Samples",
      slugField: "title",
      path: "src/content/sample/*",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description" }),
        cover: fields.image({
          label: "Cover Image",
          directory: "src/assets/images/samples",
          publicPath: "../../assets/images/samples",
        }),
      },
    }),
    categories: collection({
      label: "Portfolio Categories",
      slugField: "title",
      path: "src/content/portfolio-categories/*",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        order: fields.integer({ label: "Order" }),
        description: fields.text({ label: "Description" }),
        type: fields.select({
          label: "Resource Type",
          description: "The person's role at the company",
          options: [
            { label: "Portfolio", value: "portfolio" },
            { label: "Project", value: "project" },
            { label: "Coming Soon", value: "coming-soon" },
          ],
          defaultValue: "portfolio",
        }),

        onHome: fields.checkbox({
          label: "Show on Home Page",
        }),
        cover: fields.image({
          label: "Cover Image",
          directory: "src/assets/images/categories",
          publicPath: "../../assets/images/categories",
        }),
        banner: fields.image({
          label: "Cover Image",
          directory: "src/assets/images/categories-banners",
          publicPath: "../../assets/images/categories-banners",
        }),
      },
    }),
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "src/content/projects/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        public: fields.checkbox({ label: "Public", defaultValue: true }),
        image: fields.image({
          label: "Image",
          directory: "src/assets/images/projects",
          publicPath: "../../assets/images/projects",
        }),
        date: fields.date({
          label: "Event date",
          description: "The date of the event",
        }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "src/assets/images/projects",
            publicPath: "../../assets/images/projects",
          },
        }),
      },
    }),
    portfolio: collection({
      label: "Portfolio",
      slugField: "title",
      path: "src/content/portfolio/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        type: fields.relationship({
          label: "Category",
          collection: "categories",
        }),
        category: fields.select({
          label: "Role",
          description: "Portfolio category",
          options: [
            { label: "Digital Art", value: "digital-art" },
            { label: "Illustration", value: "illustration" },
            { label: "Painting", value: "painting" },
            { label: "Print", value: "print" },
            { label: "Sketch", value: "sketch" },
            { label: "Uncategorized", value: "uncategorized" },
          ],
          defaultValue: "uncategorized",
        }),
        public: fields.checkbox({ label: "Public", defaultValue: true }),
        image: fields.image({
          label: "Image",
          directory: "src/assets/images/portfolio",
          publicPath: "../../assets/images/portfolio",
        }),
        content: fields.markdoc({
          label: "Content",
          options: {
            divider: true,
            image: {
              directory: "src/assets/images/portfolio",
              publicPath: "../../assets/images/portfolio",
            },
          },

          components: {
            TestimonialGrid: repeating({
              label: "Testimonial Grid",

              // Only allow Testimonial components
              children: ["Testimonial"],
              schema: {
                columns: fields.integer({
                  label: "Columns",
                  validation: {
                    min: 1,
                    max: 6,
                  },
                }),
              },
            }),
            Testimonial: wrapper({
              label: "Testimonial",
              schema: {
                image: fields.image({
                  label: "Image",
                  directory: "src/assets/images/portfolio",
                  publicPath: "../../assets/images/portfolio",
                }),
              },
            }),
          },
        }),
      },
    }),
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "src/assets/images/posts",
            publicPath: "../../assets/images/posts",
          },
        }),
      },
    }),
  },
})
