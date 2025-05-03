"use server"

import db from "@/db"
import { Timetable, timetableSchema } from "@/db/schema/timetable"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { getSession } from "./session"

export const createTimetable = async (dto: Pick<Timetable, "fileIds" | "name" | "description">) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const timetable = await tryCatch(
    db.insert(timetableSchema).values({ ...dto, id: `ti_${nanoid(25)}`, accountId: session.accountId }),
  )

  if (timetable.error) throw new Error("Failed to create timetable")

  return timetable.data
}

export const findTimetableById = async (id: string) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const { data, error } = await tryCatch(db.select().from(timetableSchema).where(eq(timetableSchema.id, id)))

  if (error) throw new Error("Failed to find timetable")

  return data[0]
}
