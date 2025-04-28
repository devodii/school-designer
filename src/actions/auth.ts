"use server"

import db from "@/db"
import { resend } from "@/lib/resend"
import { tryCatch } from "@/lib/try-catch"
import { auth } from "@/schema"
import moment from "moment"
import { nanoid } from "nanoid"
import MagicLinkSignIn from "~/emails/authentication/magic-link"

import { getUser } from "./user"

type AuthResponse = { success: true } | { success: false; error: string }

export const sendMagicLink = async (dto: { email: string }): Promise<AuthResponse> => {
  const user = await getUser(dto.email)

  const response = await db
    .insert(auth)
    .values({
      id: `au_${nanoid(25)}`,
      token: `to_${nanoid(25)}`,
      account_id: user?.id,
      email: dto.email,
      used_at: null,
      expires_at: moment().add(15, "minutes").toDate().toISOString(),
      created_at: moment().toDate(),
      updated_at: moment().toDate(),
    })
    .returning({ token: auth.token })

  const { data } = await tryCatch(
    resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [dto.email],
      subject: "Sign into your account",
      react: MagicLinkSignIn({ url: `${process.env.APP_URL}/verify?token=${response[0].token}` }),
    }),
  )

  console.log({ data })

  if (data?.error) return { success: false, error: data.error.message }

  return { success: true }
}

export const verifyToken = async (token: string): Promise<AuthResponse> => {
  const auth = await db.query.auth.findFirst({ where: (auth, { eq }) => eq(auth.token, token) })

  if (!auth) return { success: false, error: "Invalid token" }

  if (auth.expires_at && moment(auth.expires_at).isBefore(moment())) {
    return { success: false, error: "Token expired" }
  }

  if (auth.used_at) return { success: false, error: "Token already used" }

  return { success: true }
}
