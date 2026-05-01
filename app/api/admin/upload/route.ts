import { NextResponse } from "next/server"
import path from "path"
import crypto from "crypto"
import { readAdminSessionFromRequest, verifyAdminSession } from "@/lib/admin-auth"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const MAX_BYTES = 25 * 1024 * 1024 // 25MB
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

function requireAdmin(req: Request): boolean {
  const token = readAdminSessionFromRequest(req)
  return verifyAdminSession(token)
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || ""
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ""
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ""
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || ""
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "")

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

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

  if (!R2_ACCOUNT_ID || !R2_BUCKET_NAME) {
    return NextResponse.json({ error: "Cloudflare R2 is not configured" }, { status: 500 })
  }

  const contentType = file.type || "application/octet-stream"

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: filename,
        Body: bytes,
        ContentType: contentType,
      })
    )
  } catch (error) {
    console.error("R2 Upload Error:", error)
    return NextResponse.json({ error: "Failed to upload file to R2" }, { status: 500 })
  }

  const publicUrl = `${R2_PUBLIC_URL}/${filename}`

  return NextResponse.json({
    url: publicUrl,
    name: originalName,
    size: file.size,
  })
}
