"use server"

import db from "@/db"
import { resend } from "@/lib/resend"
import { tryCatch } from "@/lib/try-catch"
import { auth } from "@/schema"
import moment from "moment"
import { nanoid } from "nanoid"
import MagicLinkSignIn from "~/emails/authentication/magic-link"

import { getUser } from "./user"

export const sendMagicLink = async (dto: {
  email: string
}): Promise<{ success: true } | { success: false; error: Error }> => {
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

  if (data?.error) return { success: false, error: data.error }

  return { success: true }
}
