"use server"

import { createAccount, findAccountByEmail } from "@/actions/account"
import { updateSession } from "@/actions/session"
import db from "@/db"
import { type AuthSchema, authSchema } from "@/db/schema/auth"
import { generateJwtTokens } from "@/lib/jwt"
import { resend } from "@/lib/resend"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import MagicLinkSignIn from "~/emails/authentication/magic-link"

export const updateAuth = async (id: string, dto: Partial<AuthSchema>) => {
  const { data, error } = await tryCatch(db.update(authSchema).set(dto).where(eq(authSchema.id, id)).returning())

  if (error) throw new Error("Failed to update auth session")

  return data[0]
}

export const createAuth = async (dto: { email: string; accountId: string }) => {
  const { email, accountId } = dto

  const { data: auth, error } = await tryCatch(
    db
      .insert(authSchema)
      .values({
        id: `au_${nanoid(25)}`,
        token: `to_${nanoid(50)}`,
        accessToken: null,
        refreshToken: null,
        email,
        accountId,
        usedAt: null,
        expiresAt: (() => {
          const date = new Date()
          date.setMinutes(date.getMinutes() + 15)
          return date.toISOString()
        })(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning(),
  )

  if (error) throw new Error("Failed to create auth session")

  return auth[0]
}

export const findByToken = async (token: string) => {
  const { data: auth, error } = await tryCatch(db.select().from(authSchema).where(eq(authSchema.token, token)))

  if (error) throw new Error("Failed to find auth session")

  return auth[0]
}

export const sendMagicLink = async (dto: { email: string }) => {
  const account = await findAccountByEmail(dto.email)
  const { data: auth, error } = await tryCatch(createAuth({ email: dto.email, accountId: account?.id }))

  if (error) throw new Error("Failed to create auth session")

  const token = auth.token

  const { data: emailData } = await tryCatch(
    resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [dto.email],
      subject: "Sign into your account",
      react: MagicLinkSignIn({ url: `${process.env.APP_URL}/verify?token=${token}` }),
    }),
  )

  if (emailData?.error) throw new Error(emailData.error.message)
}

export const verifyToken = async (token: string): Promise<{ success: true; data: AuthSchema }> => {
  const auth = await findByToken(token)

  if (!auth) throw new Error("Invalid token")

  if (auth.usedAt) throw new Error("Token has already been used")

  if (new Date().getTime() > new Date(auth.expiresAt).getTime()) throw new Error("Token has expired")

  if (!auth.accountId) {
    const { id: accountId } = await createAccount({
      email: auth.email,
      created_at: new Date(),
      updated_at: new Date(),
      isOnboarded: false,
      referral_code: `ref_${nanoid(10)}`,
      level: null,
      profile: null,
    })

    const { accessToken, refreshToken } = generateJwtTokens({ accountId, email: auth.email })

    await updateSession(auth.id, { accessToken, refreshToken })
  } else {
    const { accessToken, refreshToken } = generateJwtTokens({ accountId: auth.accountId, email: auth.email })

    await updateSession(auth.id, { accessToken, refreshToken })
  }

  return { success: true, data: auth }
}
