import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'noticias',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug for the news article (e.g., "understanding-digital-legal-challenges")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short description/excerpt for the news card',
      },
    },
    {
      name: 'contenido',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full content of the news article',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media', 
      required: true,
      admin: {
        description: 'Featured image for the news card',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: {
        description: 'Publication date',
      },
    },
  ],
}