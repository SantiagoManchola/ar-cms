import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { mediaId } = await req.json()

    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 })
    }

    // Buscar el documento de media
    const mediaDoc = await payload.findByID({
      collection: 'media',
      id: mediaId,
    })

    if (!mediaDoc.filename) {
      return NextResponse.json({ error: 'No filename found' }, { status: 400 })
    }

    // Subir a Cloudinary
    const fileURL = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/media/${mediaDoc.filename}`
    const publicId = `${mediaDoc.id}-${mediaDoc.filename.split('.')[0]}`
    
    const result = await uploadToCloudinary(fileURL, publicId)

    // Actualizar el documento con la URL de Cloudinary
    await payload.update({
      collection: 'media',
      id: mediaId,
      data: {
        url: result.secure_url,
        cloudinaryPublicId: result.public_id,
      } as any,
    })

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url,
      publicId: result.public_id 
    })

  } catch (error) {
    console.error('Error in upload-to-cloudinary:', error)
    return NextResponse.json(
      { error: 'Failed to upload to Cloudinary' }, 
      { status: 500 }
    )
  }
}