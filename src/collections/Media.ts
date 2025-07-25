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
        if (operation === 'create' || operation === 'update') {
          const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
          const imagePath = `${serverUrl}/media/${doc.filename}`

          const cloudinaryResult = await uploadToCloudinary(imagePath, doc.filename)

          if (cloudinaryResult) {
            const cloudinaryUrl = getCloudinaryUrl(cloudinaryResult.public_id)

            await req.payload.update({
              collection: 'media',
              id: doc.id,
              data: {
                cloudinaryPublicId: cloudinaryResult.public_id,
                cloudinaryUrl: cloudinaryUrl,
              },
            })
          }
        }
      },
    ],
  },
}
