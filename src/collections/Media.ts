import type { CollectionConfig } from 'payload'
import sharp from 'sharp'

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
  hooks: {
    // Re-encode automáticamente a WebP hasta quedar <= 500KB, sin recorte
    beforeOperation: [
      async ({ req, operation }: any) => {
        if ((operation !== 'create' && operation !== 'update') || !(req as any)?.file) return
        const f: any = (req as any).file
        const input: Buffer | undefined = f?.data || f?.buffer
        if (!input) return

        const TARGET = 500 * 1024 // 500KB
        let width = 1920
        let quality = 75
        let best: Buffer | null = null

        for (let i = 0; i < 8; i++) {
          const out = await sharp(input)
            .rotate() // respeta orientación EXIF
            .resize({ width, fit: 'inside', withoutEnlargement: true })
            .webp({ quality, effort: 4 })
            .toBuffer()

          best = out
          if (out.length <= TARGET) break

          // Estrategia: baja calidad hasta 50, luego reduce ancho suavemente
          if (quality > 50) quality -= 8
          else if (width > 1200) width = Math.floor(width * 0.85)
          else if (quality > 40) quality -= 5
          else if (width > 800) width = Math.floor(width * 0.85)
          else break
        }

        if (best) {
          f.data = best
          f.buffer = best
          f.mimeType = 'image/webp'
          f.mimetype = 'image/webp'
          if (typeof f.name === 'string') {
            f.name = f.name.replace(/\.[a-z0-9]+$/i, '.webp')
          }
        }
      },
    ],
  },
  upload: {
    crop: false,
    focalPoint: false,
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
