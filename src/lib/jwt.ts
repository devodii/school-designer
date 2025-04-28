import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!
const ACCESS_TOKEN_EXPIRY = "7d"
const REFRESH_TOKEN_EXPIRY = "1y"

type TokenPayload = {
  accountId: string
}

export function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })

  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })

  return { accessToken, refreshToken }
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}
