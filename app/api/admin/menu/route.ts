import { NextResponse } from "next/server"
import { getMenuData, saveMenuData } from "@/lib/content"
import { MenuDataSchema } from "@/lib/menu-types"
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
  return NextResponse.json(await getMenuData())
}

export async function PUT(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = MenuDataSchema.safeParse(body)
  
  if (!parsed.success) {
    // Return the first validation error message
    const errorMessage = parsed.error.errors[0]?.message || "Invalid menu data"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }

  const saved = await saveMenuData(parsed.data)
  const deploy = await triggerVercelDeploy("menu-updated")
  return NextResponse.json({ data: saved, deploy })
}

