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

const ensureSlug = async ({ data }: { data?: any }) => {
  if (!data) return data
  if (!data.slug && data.title) {
    data.slug = slugify(data.title)
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
        description: 'Identificador para la URL. Si lo dejas vacío se generará desde el título.',
      },
    },
    {
      name: 'Precio',
      label: 'Precio (COP)',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'Tipo de Propiedad',
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
      name: ' Venta o Arriendo',
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
        { name: 'Ciudad', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'Departamento', type: 'text', required: true, admin: { width: '34%' } },
        { name: 'Barrio', type: 'text', required: true, admin: { width: '33%' } },
      ],
    },
    { name: 'Dirección', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'Area (m²)', type: 'number', required: true, min: 0, admin: { width: '25%' } },
        { name: 'Alcobas', type: 'number', required: true, min: 0, admin: { width: '25%' } },
        { name: 'Baños', type: 'number', required: true, min: 0, admin: { width: '25%' } },
        { name: 'Garajes', type: 'number', required: true, min: 0, admin: { width: '25%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'Estrato', type: 'number', required: true, min: 0, admin: { width: '33%' } },
        {
          name: 'Antigüedad (años)',
          type: 'number',
          required: true,
          min: 0,
          admin: { width: '34%' },
        },
        {
          name: 'Piso',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '33%',
            condition: (data: any) => (data?.['Tipo de Propiedad'] ?? null) === 'APARTAMENTO',
          },
        },
        {
          name: 'N° de Pisos',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            width: '33%',
            condition: (data: any) => {
              const tipo = data?.['Tipo de Propiedad'] ?? null
              return tipo === 'CASA' || tipo === 'LOCAL'
            },
          },
        },
      ],
    },
    { name: 'adminFee', label: 'Administración (COP)', type: 'number', min: 0 },
    {
      name: 'Descripción',
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
      fields: [{ name: 'value', type: 'text', required: true }],
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
          'Sube una o más imágenes para la galería. Cada fila es solo el archivo (más compacto).',
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
