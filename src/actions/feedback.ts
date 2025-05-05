"use server"

import { getSession } from "@/actions/session"
import db from "@/db"
import { FeedbackSchema, feedbackSchema } from "@/db/schema/feedback"
import { tryCatch } from "@/lib/try-catch"
import { nanoid } from "nanoid"

export const createFeedback = async (dto: Pick<FeedbackSchema, "text" | "fileIds">) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const { fileIds, text } = dto
  const { data, error } = await tryCatch(
    db.insert(feedbackSchema).values({ id: `fe_${nanoid(25)}`, accountId: session.accountId, text, fileIds }),
  )

  if (error) throw new Error("Failed to create feedback")

  return data
}
