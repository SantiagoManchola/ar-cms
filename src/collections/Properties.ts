import type { CollectionConfig } from 'payload'

// Utilidad simple para generar slug a partir del título
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
      required: true,
      unique: true,
      admin: {
        description: 'Identificador para la URL. Si lo dejas vacío se generará desde el título.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      admin: { description: 'Precio en COP' },
    },
    {
      name: 'operation',
      type: 'select',
      defaultValue: 'VENTA',
      options: [
        { label: 'Venta', value: 'VENTA' },
        { label: 'Arriendo', value: 'ARRIENDO' },
      ],
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'CASA',
      options: [
        { label: 'Casa', value: 'CASA' },
        { label: 'Apartamento', value: 'APARTAMENTO' },
        { label: 'Local', value: 'LOCAL' },
      ],
    },
    // Ubicación
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', admin: { width: '33%' } },
        { name: 'state', type: 'text', admin: { width: '33%', description: 'Departamento' } },
        { name: 'neighborhood', type: 'text', admin: { width: '33%', description: 'Barrio' } },
      ],
    },
    { name: 'address', type: 'text' },
    // Métricas
    {
      type: 'row',
      fields: [
        { name: 'area', type: 'number', min: 0, admin: { width: '25%', description: 'm²' } },
        { name: 'rooms', type: 'number', min: 0, admin: { width: '25%', description: 'Alcobas' } },
        { name: 'bathrooms', type: 'number', min: 0, admin: { width: '25%' } },
        { name: 'garages', type: 'number', min: 0, admin: { width: '25%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'estrato', type: 'number', min: 0, admin: { width: '25%' } },
        { name: 'years', type: 'number', min: 0, admin: { width: '25%', description: 'Antigüedad (años)' } },
        { name: 'floor', type: 'number', min: 0, admin: { width: '25%', description: 'Piso (solo apto)' } },
        { name: 'floors', type: 'number', min: 0, admin: { width: '25%', description: 'N° pisos (casa)' } },
      ],
    },
    { name: 'adminFee', type: 'number', min: 0, admin: { description: 'Administración (COP)' } },
    {
      name: 'features',
      label: 'Características',
      type: 'array',
      labels: {
        singular: 'característica',
        plural: 'características',
      },
      fields: [
        { name: 'feature', type: 'text', required: true },
      ],
    },
    {
      name: 'highlighted',
      label: 'Destacado',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'DISPONIBLE',
      options: [
        { label: 'Disponible', value: 'DISPONIBLE' },
        { label: 'Reservado', value: 'RESERVADO' },
        { label: 'Vendido', value: 'VENDIDO' },
        { label: 'Arrendado', value: 'ARRENDADO' },
      ],
    },
    // Compatibilidad con campo libre de ubicación si lo prefieres
    {
      name: 'location',
      type: 'text',
      admin: { description: 'Campo libre opcional (ej: “Bogotá, Cundinamarca”)' },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'alt',
          type: 'text',
          admin: { description: 'Texto alternativo (si quieres sobrescribir el alt del media)' },
        },
        {
          name: 'url',
          type: 'text',
          admin: { description: 'URL directa (opcional, si no subes media)' },
        },
      ],
    },
  ],
  timestamps: true,
}
