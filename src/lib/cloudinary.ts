import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (fileUrl: string, publicId: string) => {
  try {
    const result = await cloudinary.uploader.upload(fileUrl, {
      folder: 'arcompany-media',
      public_id: publicId,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ],
    })
    return result
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log(`Image deleted from Cloudinary: ${publicId}`)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

export const getCloudinaryUrl = (publicId: string, options = {}) => {
  return cloudinary.url(publicId, {
    width: 400,
    height: 300,
    crop: 'fill',
    format: 'webp',
    quality: 'auto',
    ...options,
  })
}