import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!
const ACCESS_TOKEN_EXPIRY = "7d"
const REFRESH_TOKEN_EXPIRY = "1y"

type TokenPayload = {
  accountId: string
  email: string
}

export const generateJwtTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })

  return { accessToken, refreshToken }
}

export const verifyJwtToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}
