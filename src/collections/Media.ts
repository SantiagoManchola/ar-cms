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
        // Solo ejecutar en creación y si hay filename y no tiene cloudinaryUrl
        if (operation === 'create' && doc.filename && !doc.cloudinaryUrl) {
          try {
            console.log('Processing new image upload:', doc.filename)
            
            const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
            const imagePath = `${serverUrl}/media/${doc.filename}`
            
            // Crear un public_id más simple y único
            const publicId = `${doc.id}`

            console.log('Uploading to Cloudinary:', { imagePath, publicId })

            const cloudinaryResult = await uploadToCloudinary(imagePath, publicId)

            if (cloudinaryResult && cloudinaryResult.public_id) {
              console.log('Cloudinary upload successful, updating document...')
              
              const cloudinaryUrl = getCloudinaryUrl(cloudinaryResult.public_id)

              // Actualizar sin triggear el hook de nuevo
              await req.payload.db.updateOne({
                collection: 'media',
                where: { id: { equals: doc.id } },
                data: {
                  cloudinaryPublicId: cloudinaryResult.public_id,
                  cloudinaryUrl: cloudinaryUrl,
                },
              })
              
              console.log('Document updated with Cloudinary data')
            }
          } catch (error) {
            console.error('Error in Cloudinary upload hook:', error)
          }
        }
      },
    ],
  },
}