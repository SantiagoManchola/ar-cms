import type { CollectionConfig } from 'payload'

// Utilidad para generar slug a partir del título (igual que en Properties)
const slugify = (value: string) =>
  (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ensureSlug = async ({ data, originalDoc }: { data?: any; originalDoc?: any }) => {
  if (!data) return data
  const title = data.title ?? originalDoc?.title
  if (typeof title === 'string' && title.trim() !== '') {
    data.slug = slugify(title)
    return data
  }
  if (typeof data.slug === 'string') {
    data.slug = slugify(data.slug)
  }
  return data
}

export const News: CollectionConfig = {
  slug: 'noticias',
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    beforeValidate: [ensureSlug],
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
      required: false,
      unique: true,
      admin: {
        description: 'El slug se genera automáticamente desde el título.',
        readOnly: true,
        hidden: true,
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