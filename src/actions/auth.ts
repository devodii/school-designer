"use server"

import { createAccount, findAccountByEmail } from "@/actions/account"
import { updateSession } from "@/actions/session"
import db from "@/db"
import { AuthProvider, type AuthSchema, authSchema, GoogleIdTokenPayload } from "@/db/schema/auth"
import { generateJwtTokens } from "@/lib/jwt"
import { resend } from "@/lib/resend"
import { tryCatch } from "@/lib/try-catch"
import { AuthIntent, AuthMetadata } from "@/types"
import { eq } from "drizzle-orm"
import { jwtDecode } from "jwt-decode"
import { nanoid } from "nanoid"
import MagicLinkSignIn from "~/emails/authentication/magic-link"

export const updateAuth = async (id: string, dto: Partial<AuthSchema>) => {
  const { data, error } = await tryCatch(db.update(authSchema).set(dto).where(eq(authSchema.id, id)).returning())

  if (error) throw new Error("Failed to update auth session")

  return data[0]
}

export const createAuth = async (dto: {
  email: string
  accountId: string | null
  provider: AuthProvider
  metadata: AuthMetadata
}) => {
  const { email, accountId, provider, metadata } = dto

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
        provider,
        metadata,
      })
      .returning(),
  )

  console.log({ error })
  if (error) throw new Error("Failed to create auth session")

  return auth[0]
}

export const findByToken = async (token: string) => {
  const { data: auth, error } = await tryCatch(db.select().from(authSchema).where(eq(authSchema.token, token)))

  if (error) throw new Error("Failed to find auth session")
  return auth[0]
}

export const sendMagicLink = async (dto: { email: string; intent: AuthIntent; redirect?: string }) => {
  const account = await findAccountByEmail(dto.email)

  const auth = await createAuth({
    email: dto.email,
    accountId: account?.id ?? null,
    provider: "EMAIL",
    metadata: { intent: dto.intent },
  })

  const token = auth.token

  const authUrlParams = new URLSearchParams({
    c_token: token,
    ...(dto.redirect ? { redirect: dto.redirect } : {}),
  }).toString()

  console.log({ authUrlParams })

  const { data: emailData } = await tryCatch(
    resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [dto.email],
      subject: "Sign into your account",
      react: MagicLinkSignIn({ url: `${process.env.APP_URL}/verify?${authUrlParams}` }),
    }),
  )

  if (emailData?.error) throw new Error(emailData.error.message)

  return { success: true }
}

export const verifyMagicLinkToken = async (token: string) => {
  const auth = await findByToken(token)

  if (!auth) throw new Error("Invalid token")

  if (auth.usedAt) throw new Error("Token has already been used")

  if (new Date().getTime() > new Date(auth.expiresAt).getTime()) throw new Error("Token has expired")

  let isNewAccount = false
  let account: { email: string; id: string } | null = null

  account = await findAccountByEmail(auth.email)

  if (!account) {
    const { id: accountId } = await createAccount({ email: auth.email })
    account = { email: auth.email, id: accountId }
    isNewAccount = true
  }

  const { accessToken, refreshToken } = generateJwtTokens({ accountId: account.id, email: auth.email })

  await updateSession(auth.id, { accessToken, refreshToken })

  return { isNewAccount, accountId: account.id, intent: auth.metadata?.intent }
}

export const verifyGoogleToken = async (token: string, intent: AuthIntent) => {
  const decoded = jwtDecode<GoogleIdTokenPayload>(token)

  let isNewAccount = false
  let account: { email: string; id: string } | null = null

  account = await findAccountByEmail(decoded.email)

  if (!account) {
    const { id: accountId } = await createAccount({ email: decoded.email })
    account = { email: decoded.email, id: accountId }
    isNewAccount = true
  }

  const { accessToken, refreshToken } = generateJwtTokens({ accountId: account.id, email: decoded.email })

  const auth = await createAuth({
    email: decoded.email,
    accountId: account.id,
    provider: "GOOGLE",
    metadata: { intent },
  })

  await updateSession(auth.id, { accessToken, refreshToken })

  return { isNewAccount, accountId: account.id, intent: auth.metadata?.intent }
}
