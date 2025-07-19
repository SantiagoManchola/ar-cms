import type { CollectionConfig } from 'payload'

export interface ServiceAPI {
  id?: number
  nombre: string
  slug: string
  descripcion: string
  titulo_banner: string
  descripcion_banner: string
  imagen_banner: string
  areas_especializacion: string[]
  icon?: string
  title?: string
  href?: string
}

export const Services: CollectionConfig = {
  slug: 'servicios',
  admin: {
    useAsTitle: 'nombre',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    // Campos principales
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre del Servicio',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug (URL amigable)',
      unique: true,
      admin: {
        description: 'URL amigable para el servicio (ej: "diseno-web")',
      },
    },
    {
      name: 'descripcion',
      type: 'textarea',
      required: true,
      label: 'Descripción del Servicio',
    },

    // Campos del banner
    {
      name: 'titulo_banner',
      type: 'text',
      required: true,
      label: 'Título del Banner',
    },
    {
      name: 'descripcion_banner',
      type: 'textarea',
      required: true,
      label: 'Descripción del Banner',
    },
    {
      name: 'imagen_banner',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen del Banner',
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
          label: 'Área',
        },
      ],
    },

    // Campos de compatibilidad (opcionales)
    {
      name: 'icon',
      type: 'text',
      label: 'Icono (opcional)',
      admin: {
        description: 'Para mantener compatibilidad con formato anterior',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título (opcional)',
      admin: {
        description: 'Para mantener compatibilidad con formato anterior',
      },
    },
    {
      name: 'href',
      type: 'text',
      label: 'Enlace (opcional)',
      admin: {
        description: 'Para mantener compatibilidad con formato anterior',
      },
    },
  ],
}
