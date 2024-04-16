import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  singletons: {
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
      path: 'src/content/about',
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
    })
  },
  collections: {
    artwork: collection({
      label: 'Artworks',
      slugField: 'title',
      path: 'src/content/artwork/*/index',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Role',
          description: "Artwork category",
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
        image: fields.image({
          label: 'Image',
          directory: 'public/images/artwork',
          publicPath: '../images/artwork',
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
        }),
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
