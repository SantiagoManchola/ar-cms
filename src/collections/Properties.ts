import type { CollectionConfig } from 'payload'

// Utilidad para generar slug a partir del título
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

export const Properties: CollectionConfig = {
  slug: 'propiedades',
  labels: {
    singular: 'Inmueble',
    plural: 'Bienes Raices',
  },
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
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'El slug se genera automáticamente desde el título.',
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'price',
      label: 'Precio (COP)',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'type',
      label: 'Tipo de Propiedad',
      type: 'select',
      required: true,
      defaultValue: 'CASA',
      options: [
        { label: 'Casa', value: 'CASA' },
        { label: 'Apartamento', value: 'APARTAMENTO' },
        { label: 'Local', value: 'LOCAL' },
      ],
    },
    {
      name: 'operation',
      label: 'Venta o Arriendo',
      type: 'select',
      required: true,
      defaultValue: 'VENTA',
      options: [
        { label: 'Venta', value: 'VENTA' },
        { label: 'Arriendo', value: 'ARRIENDO' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'city', label: 'Ciudad', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'state', label: 'Departamento', type: 'text', required: true, admin: { width: '34%' } },
        { name: 'neighborhood', label: 'Barrio', type: 'text', required: true, admin: { width: '33%' } },
      ],
    },
    { name: 'address', label: 'Dirección', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'area', label: 'Área (m²)', type: 'number', required: true, min: 0, admin: { width: '25%' } },
        { name: 'rooms', label: 'Alcobas', type: 'number', required: true, min: 0, admin: { width: '25%' } },
        { name: 'bathrooms', label: 'Baños', type: 'number', required: true, min: 0, admin: { width: '25%' } },
        { name: 'garages', label: 'Garajes', type: 'number', required: true, min: 0, admin: { width: '25%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'estrato', label: 'Estrato', type: 'number', required: true, min: 0, admin: { width: '33%' } },
        {
          name: 'years',
          label: 'Antigüedad (años)',
          type: 'number',
          required: true,
          min: 0,
          admin: { width: '34%' },
        },
        {
          name: 'floor',
          label: 'Piso',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '33%',
            condition: (data: any) => (data?.['type'] ?? data?.['Tipo de Propiedad'] ?? null) === 'APARTAMENTO',
          },
        },
        {
          name: 'floors',
          label: 'N° de Pisos',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '33%',
            condition: (data: any) => {
              const tipo = data?.['type'] ?? data?.['Tipo de Propiedad'] ?? null
              return tipo === 'CASA' || tipo === 'LOCAL'
            },
          },
        },
      ],
    },
    { name: 'adminFee', label: 'Administración (COP)', type: 'number', min: 0 },
    {
      name: 'description',
      label: 'Descripción',
      required: true,
      type: 'textarea',
    },
    {
      name: 'features',
      label: 'Características',
      type: 'array',
      labels: {
        singular: 'Característica',
        plural: 'Características',
      },
      fields: [{ name: 'feature', label: 'Característica', type: 'text', required: true }],
    },
    {
      name: 'images',
      label: 'Imágenes de la propiedad',
      type: 'array',
      labels: {
        singular: 'Imagen',
        plural: 'Imágenes',
      },
      admin: {
        description:
          'Sube una o más imágenes para la galería.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Arrastra y suelta o crea/selecciona desde la biblioteca',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
