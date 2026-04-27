import { NextResponse } from "next/server"
import { getGalleryData, saveGalleryData } from "@/lib/content"
import { GalleryDataSchema } from "@/lib/gallery-types"
import { readAdminSessionFromRequest, verifyAdminSession } from "@/lib/admin-auth"
import { triggerVercelDeploy } from "@/lib/vercel-deploy"

function requireAdmin(req: Request): boolean {
  const token = readAdminSessionFromRequest(req)
  return verifyAdminSession(token)
}

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json(await getGalleryData())
}

export async function PUT(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = GalleryDataSchema.parse(body)
  const saved = await saveGalleryData(parsed)
  const deploy = await triggerVercelDeploy("gallery-updated")
  return NextResponse.json({ data: saved, deploy })
}

