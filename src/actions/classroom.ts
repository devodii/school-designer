"use server"

import { findAccountById } from "@/actions/account"
import { getSession } from "@/actions/session"
import db from "@/db"
import { classroomSchema, ClassroomSchema } from "@/db/schema/classroom"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

const findClassroomByInviteCode = async (inviteCode: string) => {
  const { data, error } = await tryCatch(
    db.select().from(classroomSchema).where(eq(classroomSchema.inviteCode, inviteCode)),
  )

  if (error) return null

  return data[0]
}

export const createClassroom = async (dto: Pick<ClassroomSchema, "name" | "description" | "inviteCode">) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const account = await findAccountById(session.accountId)

  if (!account) throw new Error("Invalid account")

  const existingClassroom = await findClassroomByInviteCode(dto.inviteCode)

  if (existingClassroom) throw new Error("Sorry, this invite code is being used by another classroom")

  const { data, error } = await tryCatch(
    db
      .insert(classroomSchema)
      .values({
        ...dto,
        id: `cl_${nanoid(25)}`,
        ownerId: session.accountId,
        subject: "EMPTY",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: classroomSchema.id }),
  )

  if (error) throw new Error("Failed to create classroom")

  return { id: data[0].id }
}
