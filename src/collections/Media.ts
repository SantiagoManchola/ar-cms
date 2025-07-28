import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadToCloudinary, getCloudinaryUrl } from '../lib/cloudinary'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'cloudinaryUrl',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
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
    ],
    mimeTypes: ['image/*'],
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Solo ejecutar en creación o actualización, y si hay un archivo
        if ((operation === 'create' || operation === 'update') && doc.filename) {
          try {
            const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
            const imagePath = `${serverUrl}/media/${doc.filename}`
            
            // Crear un public_id único
            const publicId = `arcompany-media/${doc.id}-${doc.filename.split('.')[0]}`

            const cloudinaryResult = await uploadToCloudinary(imagePath, publicId)

            if (cloudinaryResult) {
              const cloudinaryUrl = getCloudinaryUrl(cloudinaryResult.public_id)

              // Actualizar el documento con los datos de Cloudinary
              await req.payload.update({
                collection: 'media',
                id: doc.id,
                data: {
                  cloudinaryPublicId: cloudinaryResult.public_id,
                  cloudinaryUrl: cloudinaryUrl,
                },
              })
            }
          } catch (error) {
            console.error('Error uploading to Cloudinary in hook:', error)
            // No lanzar el error para evitar que falle toda la operación
          }
        }
      },
    ],
  },
}