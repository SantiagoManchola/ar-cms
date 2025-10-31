import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
  ],
  upload: {
    // Generamos múltiples tamaños optimizados en WebP para servir imágenes más ligeras.
    // Nota: El archivo original se mantiene, pero en el frontend deberíamos usar estos tamaños.
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'mobile',
        width: 640,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1600,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
    // Reducimos el tamaño máximo del archivo original para evitar originales gigantes.
    // Sharp resize: ajusta dentro de 1920x1920 sin ampliar imágenes pequeñas.
    resizeOptions: {
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    },
  },
}
