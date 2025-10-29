import { NextResponse } from 'next/server'

export async function GET() {
  // Include commit/build info when available (Render and Vercel expose different env vars)
  const commit =
    process.env.RENDER_GIT_COMMIT ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.COMMIT_SHA ||
    null

  return NextResponse.json({ status: 'ok', commit })
}
