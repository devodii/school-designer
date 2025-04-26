import { MagicLinkSignIn } from "@/components/emails/magic-link-sign-in"
import db from "@/db"
import { resend } from "@/lib/resend"
import { tryCatch } from "@/lib/try-catch"
import { auth } from "@/schema"
import moment from "moment"
import { nanoid } from "nanoid"

import { getUser } from "./user"

export const sendMagicLink = async (dto: { email: string }) => {
  const user = await getUser(dto.email)

  const response = await db.insert(auth).values({
    id: `au_${nanoid(25)}`,
    token: `to_${nanoid(25)}`,
    account_id: user?.id,
    email: dto.email,
    expires_at: moment().add(15, "minutes").toDate().toISOString(),
    created_at: moment().toDate().toISOString(),
    updated_at: moment().toDate().toISOString(),
  })

  try {
    const { data, error} = await tryCatch(
      resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "Sign into your account",
        react: MagicLinkSignIn({ url: response. }),
      }),
    )

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
