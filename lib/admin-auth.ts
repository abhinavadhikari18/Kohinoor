import crypto from "crypto"

const COOKIE_NAME = "kohinoor_admin"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? ""
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? getAdminPassword()
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function base64UrlDecodeToString(input: string): string {
  const padLen = (4 - (input.length % 4)) % 4
  const padded = `${input}${"=".repeat(padLen)}`
  const normalized = padded.replace(/-/g, "+").replace(/_/g, "/")
  return Buffer.from(normalized, "base64").toString("utf8")
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8")
  const bufB = Buffer.from(b, "utf8")
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function getAdminPasswordVerified(): string | null {
  const pw = getAdminPassword()
  return pw ? pw : null
}

export function verifyPassword(password: string): boolean {
  const adminPassword = getAdminPasswordVerified()
  if (!adminPassword) return false
  return timingSafeEqual(password, adminPassword)
}

export function signAdminSession(nonce?: string): string {
  const secret = getSessionSecret()
  if (!secret) throw new Error("ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) is not configured.")

  const payload = {
    scope: "admin",
    iat: Math.floor(Date.now() / 1000),
    nonce: nonce ?? crypto.randomBytes(16).toString("hex"),
  }

  const payloadJson = JSON.stringify(payload)
  const payloadB64 = base64UrlEncode(payloadJson)
  const sig = crypto.createHmac("sha256", secret).update(payloadJson).digest("hex")

  return `${payloadB64}.${sig}`
}

export function verifyAdminSession(token: string | undefined | null): boolean {
  if (!token) return false
  const secret = getSessionSecret()
  if (!secret) return false

  const parts = token.split(".")
  if (parts.length !== 2) return false
  const [payloadB64, sigHex] = parts

  try {
    const payloadJson = base64UrlDecodeToString(payloadB64)
    const expectedSig = crypto.createHmac("sha256", secret).update(payloadJson).digest("hex")
    if (!timingSafeEqual(expectedSig, sigHex)) return false

    const payload = JSON.parse(payloadJson) as { scope?: string; iat?: number }
    if (payload.scope !== "admin") return false
    const iat = typeof payload.iat === "number" ? payload.iat : 0
    const ageSeconds = Math.floor(Date.now() / 1000) - iat
    return ageSeconds >= 0 && ageSeconds <= MAX_AGE_SECONDS
  } catch {
    return false
  }
}

export function readAdminSessionFromRequest(req: Request): string | undefined {
  const cookieHeader = req.headers.get("cookie")
  if (!cookieHeader) return undefined
  const cookies = cookieHeader.split(";").map((c) => c.trim())
  const entry = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`))
  if (!entry) return undefined
  return entry.substring(COOKIE_NAME.length + 1)
}

export function getAdminCookieName() {
  return COOKIE_NAME
}

