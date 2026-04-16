import { NextResponse } from "next/server"
import { readAdminSessionFromRequest, verifyAdminSession } from "@/lib/admin-auth"

export async function GET(req: Request) {
  const token = readAdminSessionFromRequest(req)
  const authed = verifyAdminSession(token)
  return NextResponse.json({ authed })
}

