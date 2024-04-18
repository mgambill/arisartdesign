import { config, fields, collection, singleton, type LocalConfig, type CloudConfig } from '@keystatic/core';

const isProd = process.env.NODE_ENV === 'production';

const localConfig: LocalConfig['storage'] = {
  kind: 'local'
}
const cloudConfig: CloudConfig['storage'] = {
  kind: 'cloud'
}

export default config({
  storage: isProd ? cloudConfig : localConfig,
  cloud: {
    project: 'victoria/aris-art-design',
  },
  // ui: {
  //   navigation: {
  //     "Site": ['portfolio', 'posts', 'projects'],
  //     "Pages": ['about', 'home', 'hero'],
  //     'Footer Links': ['socialLinks', '---', 'settings', 'categories']
  //   }
  // },
  singletons: {
    socialLinks: singleton({
      label: "Social Links",
      path: 'src/content/social-links',
      schema: {
        twitter: fields.text({ label: 'Twitter', description: 'Twitter username' }),
        instagram: fields.text({ label: 'Twitter', description: 'IG handle username' }),
        facebook: fields.text({ label: 'Twitter', description: 'facebook username' }),
      }
    }),
    settings: singleton({
      label: 'Settings',
      path: 'src/content/settings',
      schema: {
        title: fields.text({ label: 'Title' }),
        description: fields.text({ label: 'Description' }),
        keywords: fields.text({ label: 'Keywords' }),
      }
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/pages/about',
      format: {
        contentField: 'content'
      },
      schema: {
        title: fields.text({ label: 'Title' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/images/about',
            publicPath: '../../assets/images/about/',
          },
        }),
      },
    }),
    home: singleton({
      label: 'Home',
      path: 'src/content/pages/home',
      format: {
        contentField: 'content'
      },
      schema: {
        title: fields.text({ label: 'Title' }),
        showPosts: fields.checkbox({ label: 'Show Posts' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/images/home',
            publicPath: '../../assets/images/home/',
          },
        }),
      },
    })
  },
  collections: {
    categories: collection({
      label: 'Portfolio Categories',
      slugField: 'title',
      path: 'src/content/portfolio-categories/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description' }),
        cover: fields.image({
          label: 'Cover Image',
          directory: 'public/images/categories',
          publicPath: '../images/categories',
        })
      }
    }),
    artwork: collection({
      label: 'Artworks',
      slugField: 'title',
      path: 'src/content/artwork/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Role',
          description: "Artwork category",
          options: [
            { label: 'Digital Art', value: 'digital-art' },
            { label: 'Illustration', value: 'illustration' },
            { label: 'Projects', value: 'projects' },
            { label: 'Print', value: 'print' },
            { label: 'Sketch', value: 'sketch' },
            { label: 'Uncategorized', value: 'uncategorized' },
          ],
          defaultValue: 'uncategorized'
        }),
        public: fields.checkbox({ label: 'Public', defaultValue: true }),
        image: fields.image({
          label: 'Image',
          directory: 'public/images/artwork',
          publicPath: '../images/artwork',
        }),
        date: fields.date({
          label: 'Event date',
          description: 'The date of the event'
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/images/posts',
            publicPath: '../../assets/images/posts/',
          },
        })
      },
    }),
    project: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/project/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Role',
          description: "Artwork category",
          options: [
            { label: 'Digital Art', value: 'digital-art' },
            { label: 'Illustration', value: 'illustration' },
            { label: 'Projects', value: 'projects' },
            { label: 'Print', value: 'print' },
            { label: 'Sketch', value: 'sketch' },
            { label: 'Uncategorized', value: 'uncategorized' },
          ],
          defaultValue: 'uncategorized'
        }),
        public: fields.checkbox({ label: 'Public', defaultValue: true }),
        image: fields.image({
          label: 'Image',
          directory: 'public/images/project',
          publicPath: '../images/project',
        }),
        date: fields.date({
          label: 'Event date',
          description: 'The date of the event'
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/images/projects',
            publicPath: '../../assets/images/projects/',
          },
        })
      },
    }),
    portfolio: collection({
      label: 'Portfolios',
      slugField: 'title',
      path: 'src/content/portfolio/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Role',
          description: "Portfolio category",
          options: [
            { label: 'Digital Art', value: 'digital-art' },
            { label: 'Illustration', value: 'illustration' },
            { label: 'Painting', value: 'painting' },
            { label: 'Print', value: 'print' },
            { label: 'Sketch', value: 'sketch' },
            { label: 'Uncategorized', value: 'uncategorized' },
          ],
          defaultValue: 'uncategorized'
        }),
        public: fields.checkbox({ label: 'Public', defaultValue: true }),
        image: fields.image({
          label: 'Image',
          directory: 'public/images/portfolio',
          publicPath: '../images/portfolio',
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/images/posts',
            publicPath: '../../assets/images/posts/',
          },
        })
      },
    }),
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/images/posts',
            publicPath: '../../assets/images/posts/',
          },
        }),
      },
    }),
  },
});
