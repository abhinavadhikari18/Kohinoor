import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import crypto from "crypto"
import { readAdminSessionFromRequest, verifyAdminSession } from "@/lib/admin-auth"

const MAX_BYTES = 25 * 1024 * 1024 // 25MB
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

function requireAdmin(req: Request): boolean {
  const token = readAdminSessionFromRequest(req)
  return verifyAdminSession(token)
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 })

  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 })
  }

  if (file.size <= 0) return NextResponse.json({ error: "Empty file" }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large" }, { status: 413 })

  const originalName = sanitizeFilename(file.name || "upload")
  const ext = path.extname(originalName).toLowerCase()
  if (!ALLOWED_EXT.has(ext)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const hash = crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 12)
  const id = crypto.randomUUID()
  const filename = `${id}-${hash}${ext}`

  const relDir = path.join("uploads", "gallery")
  const absDir = path.join(process.cwd(), "public", relDir)
  await fs.mkdir(absDir, { recursive: true })

  const absPath = path.join(absDir, filename)
  await fs.writeFile(absPath, bytes)

  return NextResponse.json({
    url: `/${relDir.replace(/\\/g, "/")}/${filename}`,
    name: originalName,
    size: file.size,
  })
}

