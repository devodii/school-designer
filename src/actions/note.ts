"use server"

import db from "@/db"
import { NoteSchema, noteSchema } from "@/db/schema/note"
import { tryCatch } from "@/lib/try-catch"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

import { getSession } from "./session"

export const createNote = async (dto: Pick<NoteSchema, "title" | "content" | "accountId">) => {
  const { data, error } = await tryCatch(
    db
      .insert(noteSchema)
      .values({ ...dto })
      .returning({ id: noteSchema.id }),
  )

  if (error) return null

  revalidatePath("/dashboard/notes")

  return data[0]
}

export const getAccountNotes = async () => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const { data, error } = await tryCatch(
    db.select().from(noteSchema).where(eq(noteSchema.accountId, session.accountId)).orderBy(desc(noteSchema.updatedAt)),
  )

  if (error) return []

  return data
}

export const updateNote = async (dto: Pick<NoteSchema, "id" | "title" | "content">) => {
  const { data, error } = await tryCatch(
    db
      .update(noteSchema)
      .set({ ...dto })
      .where(eq(noteSchema.id, dto.id)),
  )

  if (error) return null

  revalidatePath("/dashboard/notes")

  return data[0]
}
