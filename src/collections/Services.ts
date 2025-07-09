import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'servicios',
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
      name: 'Descripcion',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text', // o media si quieres un archivo
    },
  ],
}
