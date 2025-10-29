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

export const Services: CollectionConfig = {
  slug: 'servicios',
  orderable: true,
  defaultSort: 'order',
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
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre del Servicio',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Icono del Servicio (Imagen)',
      admin: {
        description: 'Sube una imagen para el icono del servicio',
      },
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
      name: 'descripcion_general',
      type: 'textarea',
      required: true,
      label: 'Descripción General del Servicio',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      required: true,
      label: 'Descripción Detallada del Servicio',
    },
    {
      name: 'titulo_banner',
      type: 'text',
      required: true,
      label: 'Título del Banner',
    },
    {
      name: 'descripcion_banner',
      type: 'textarea',
      required: false,
      label: 'Descripción del Banner (Opcional)',
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
  ],
}
