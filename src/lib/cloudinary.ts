import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const uploadToCloudinary = async (fileUrl: string, publicId: string) => {
  try {
    console.log('Starting Cloudinary upload:', { fileUrl, publicId })
    
    // Verificar que las credenciales estén configuradas
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials are not properly configured')
    }
    
    const result = await cloudinary.uploader.upload(fileUrl, {
      folder: 'arcompany-media',
      public_id: publicId,
      resource_type: 'auto',
      overwrite: true,
      invalidate: true,
      transformation: [
        { quality: 'auto:best', fetch_format: 'auto' }
      ],
    })
    
    console.log('Cloudinary upload result:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height
    })
    
    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Cloudinary upload error details:', {
      error: errorMessage,
      stack: errorStack,
      fileUrl,
      publicId
    })
    throw error
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log(`Image deleted from Cloudinary: ${publicId}`, result)
    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting from Cloudinary:', errorMessage)
    throw error
  }
}

export const getCloudinaryUrl = (publicId: string, options = {}) => {
  const defaultOptions = {
    width: 400,
    height: 300,
    crop: 'fill',
    format: 'webp',
    quality: 'auto:best',
    secure: true,
  }
  
  return cloudinary.url(publicId, {
    ...defaultOptions,
    ...options,
  })
}