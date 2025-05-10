"use server"

import db from "@/db"
import { researchSchema, ResearchSchema } from "@/db/schema/research"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"

export const createResearch = async (
  dto: Pick<ResearchSchema, "title" | "targetAudience" | "description" | "accountId" | "surveyLink">,
) => {
  const { data, error } = await tryCatch(db.insert(researchSchema).values(dto).returning({ id: researchSchema.id }))

  if (error) throw new Error("Failed to create research")

  return data[0]
}

export const findResearchById = async (id: string) => {
  const { data, error } = await tryCatch(db.select().from(researchSchema).where(eq(researchSchema.id, id)))

  if (error) throw new Error("Failed to find research")

  return data[0]
}

export const findAllResearchByAccountId = async (accountId: string) => {
  const { data, error } = await tryCatch(
    db.select().from(researchSchema).where(eq(researchSchema.accountId, accountId)),
  )

  if (error) throw new Error("Failed to find research")

  return data
}
