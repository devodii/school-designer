import { updateAuth } from "@/actions/auth"
import { verifyJwtToken } from "@/lib/jwt"
import { cookies } from "next/headers"

export const getSession = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")

  if (!token) return null

  const payload = verifyJwtToken(token.value)

  if (!payload) return null

  return payload
}

export const updateSession = async (id: string, dto: { accessToken: string; refreshToken: string }) => {
  const { accessToken, refreshToken } = dto

  await updateAuth(id, { accessToken, refreshToken })

  const cookieStore = await cookies()

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  })

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  })
}
