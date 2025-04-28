"use server"

import { findUserByEmail } from "@/actions/account"
import db from "@/db"
import { accountSchema } from "@/db/schema/account"
import { type AuthSchema, authSchema } from "@/db/schema/auth"
import { generateJwtTokens, verifyJwtToken } from "@/lib/jwt"
import { resend } from "@/lib/resend"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { cookies } from "next/headers"
import MagicLinkSignIn from "~/emails/authentication/magic-link"

type AuthResponse = { success: true } | { success: false; error: string }

export const sendMagicLink = async (dto: { email: string }): Promise<AuthResponse> => {
  const account = await findUserByEmail(dto.email)

  const { accessToken, refreshToken } = generateJwtTokens({ accountId: account?.id })

  const { data, error } = await tryCatch(
    db
      .insert(authSchema)
      .values({
        id: `au_${nanoid(25)}`,
        token: `to_${nanoid(50)}`,
        accountId: account?.id,
        accessToken,
        refreshToken,
        email: dto.email,
        usedAt: null,
        expiresAt: (() => {
          const date = new Date()
          date.setMinutes(date.getMinutes() + 15)
          return date.toISOString()
        })(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ token: authSchema.token }),
  )

  if (error) return { success: false, error: "Database operation failed" }

  const token = data[0].token

  const { data: emailData } = await tryCatch(
    resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [dto.email],
      subject: "Sign into your account",
      react: MagicLinkSignIn({ url: `${process.env.APP_URL}/verify?token=${token}` }),
    }),
  )

  console.log({ data })

  if (emailData?.error) return { success: false, error: emailData.error.message }

  return { success: true }
}

export const verifyToken = async (
  token: string,
): Promise<{ success: false; error: string } | { success: true; data: AuthSchema }> => {
  const [auth] = await db.select().from(authSchema).where(eq(authSchema.token, token))

  if (!auth) return { success: false, error: "Invalid token" }

  if (auth.usedAt) return { success: false, error: "Token already used" }

  if (new Date().getTime() > new Date(auth.expiresAt).getTime()) {
    return { success: false, error: "Token expired" }
  }

  await db.insert(accountSchema).values({
    id: `ac_${nanoid(25)}`,
    email: auth.email,
    created_at: new Date(),
    updated_at: new Date(),
    isOnboarded: false,
  })

  return { success: true, data: auth }
}

export const getAuth = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")

  if (!token) return null

  const auth = verifyJwtToken(token.value)

  return auth
}
