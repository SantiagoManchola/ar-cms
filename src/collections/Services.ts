import type { CollectionConfig } from 'payload'

export interface ServiceAPI {
  id?: number
  nombre: string
  icon: string
  slug: string
  descripcion_general: string
  descripcion: string
  titulo_banner: string
  descripcion_banner: string
  imagen_banner: string
  areas_especializacion: string[]
}

// Utilidad para generar slug a partir del nombre (igual que en Properties)
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
  const nombre = data.nombre ?? originalDoc?.nombre
  if (typeof nombre === 'string' && nombre.trim() !== '') {
    data.slug = slugify(nombre)
    return data
  }
  if (typeof data.slug === 'string') {
    data.slug = slugify(data.slug)
  }
  return data
}

export const Services: CollectionConfig = {
  slug: 'servicios',
  orderable: true,
  defaultSort: 'order',
  admin: {
    useAsTitle: 'nombre',
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
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre del Servicio',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'titulo_banner',
          type: 'text',
          required: true,
          label: 'Título del Banner',
          admin: { width: '50%' },
        },
        {
          name: 'descripcion_banner',
          type: 'text',
          required: false,
          label: 'Descripción del Banner (Opcional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'imagen_banner',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen del Banner',
          admin: { width: '50%' },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Icono del Servicio (Imagen PNG)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug (URL amigable)',
      unique: true,
      admin: {
        description: 'Se genera automáticamente desde el nombre del servicio.',
        readOnly: true,
        hidden: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'descripcion_general',
          type: 'textarea',
          required: true,
          label: 'Descripción Corta del Servicio',
          admin: { width: '50%' },
        },
        {
          name: 'descripcion',
          type: 'textarea',
          required: true,
          label: 'Descripción Detallada del Servicio',
          admin: { width: '50%' },
        },
      ],
    },
    

    // Áreas de especialización
    {
      name: 'areas_especializacion',
      type: 'array',
      label: 'Áreas de Especialización',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
          label: 'Área de Especialización',
        },
      ],
    },
  ],
}
