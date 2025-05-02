"use server"

import db from "@/db"
import { Waitlist, waitlist } from "@/db/schema/waitlist"
import { tryCatch } from "@/lib/try-catch"
import { nanoid } from "nanoid"

export const createWaitlist = async (dto: Pick<Waitlist, "email" | "study_challenge" | "would_pay">) => {
  const { data, error } = await tryCatch(db.insert(waitlist).values({ id: `wa_${nanoid(25)}`, ...dto }))

  if (error) throw new Error(error.message)

  return data
}
