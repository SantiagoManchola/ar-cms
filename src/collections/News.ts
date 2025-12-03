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
  labels: {
    singular: 'Noticia',
    plural: 'Noticias',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'description', 'contenido', 'backgroundImage'],
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
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Descripción corta',
      type: 'textarea',
      required: true,
    },
    {
      name: 'contenido',
      label: 'Contenido',
      type: 'richText',
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
      type: 'row',
      fields: [
        {
          name: 'backgroundImage',
          label: 'Imagen destacada',
          type: 'upload',
          relationTo: 'media', 
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'publishedAt',
          label: 'Fecha de publicación',
          type: 'date',
          required: true,
          admin: {
          width: '50%' },
        },
      ],
    },
  ],
}