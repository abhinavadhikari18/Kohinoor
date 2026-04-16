import { NextResponse } from "next/server"
import { z } from "zod"
import { getAdminCookieName, signAdminSession, verifyPassword } from "@/lib/admin-auth"

const LoginBodySchema = z.object({
  password: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = LoginBodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  if (!verifyPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = signAdminSession()
  const res = NextResponse.json({ ok: true })

  res.cookies.set(getAdminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  })

  return res
}

