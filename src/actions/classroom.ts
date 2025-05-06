"use server"

import { findAccountById } from "@/actions/account"
import { getSession } from "@/actions/session"
import db from "@/db"
import { accountSchema } from "@/db/schema/account"
import {
  ClassroomEventSchema,
  classroomEventSchema,
  classroomMemberSchema,
  classroomSchema,
  ClassroomSchema,
} from "@/db/schema/classroom"
import { tryCatch } from "@/lib/try-catch"
import { eq, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

// Classroom
export const findClassroomById = async (id: string) => {
  const { data, error } = await tryCatch(db.select().from(classroomSchema).where(eq(classroomSchema.id, id)))

  if (error) return null

  return data[0]
}

export const findClassroomByInviteCode = async (inviteCode: string) => {
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

// Classroom Member

export const addClassroomMember = async (classroomId: string) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const account = await findAccountById(session.accountId)

  if (!account) throw new Error("Invalid account")

  const classroom = await findClassroomById(classroomId)

  if (!classroom) throw new Error("Classroom not found")

  const { error } = await tryCatch(
    db
      .insert(classroomMemberSchema)
      .values({
        id: `cm_${nanoid(25)}`,
        accountId: account.id,
        classroomId: classroom.id,
        createdAt: new Date(),
      })
      .returning({ id: classroomMemberSchema.id }),
  )

  if (error) throw new Error("Failed to join classroom")

  return { id: classroom.id }
}

// Classroom Event

export const createClassroomEvent = async (
  dto: Pick<ClassroomEventSchema, "classroomId" | "accountId" | "description">,
) => {
  const { classroomId, accountId, description } = dto

  const { error, data } = await tryCatch(
    db
      .insert(classroomEventSchema)
      .values({ id: `ce_${nanoid(25)}`, classroomId, accountId, description })
      .returning({ id: classroomEventSchema.id }),
  )

  if (error) throw new Error("Failed to create classroom event")

  return { id: data[0].id }
}

export const getClassroomEvents = async (classroomId: string) => {
  const { data: events, error } = await tryCatch(
    db
      .select({
        id: classroomEventSchema.id,
        description: classroomEventSchema.description,
        createdAt: classroomEventSchema.createdAt,
        userName: sql<string>`(${accountSchema.profile} ->> 'fullName')`,
        userAvatar: sql<string>`(${accountSchema.profile} ->> 'pictures' -> 0 ->> 'url')`,
      })
      .from(classroomEventSchema)
      .leftJoin(accountSchema, eq(classroomEventSchema.accountId, accountSchema.id))
      .where(eq(classroomEventSchema.classroomId, classroomId)),
  )

  if (error) throw new Error("Failed to get classroom events")

  return events
}
