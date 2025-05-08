"use server"

import { findAccountById } from "@/actions/account"
import { getSession } from "@/actions/session"
import db from "@/db"
import { accountSchema, profileSchema } from "@/db/schema/account"
import {
  ClassroomEventSchema,
  classroomEventSchema,
  ClassroomMemberAccount,
  classroomMemberSchema,
  classroomSchema,
  ClassroomSchema,
} from "@/db/schema/classroom"
import { tryCatch } from "@/lib/try-catch"
import { ClassroomEventMetadata } from "@/types"
import { desc, eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

// Classroom
export const findClassroomById = async (id: string) => {
  const { data, error } = await tryCatch(db.select().from(classroomSchema).where(eq(classroomSchema.id, id)))

  if (error) return null

  return data[0]
}

export const findClassroomByInviteCode = async (inviteCode: string) => {
  const { data, error } = await tryCatch(
    db
      .select({
        id: classroomSchema.id,
        name: classroomSchema.name,
        description: classroomSchema.description,
        inviteCode: classroomSchema.inviteCode,
        ownerName: profileSchema.fullName,
      })
      .from(classroomSchema)
      .leftJoin(accountSchema, eq(classroomSchema.ownerId, accountSchema.id))
      .leftJoin(profileSchema, eq(accountSchema.id, profileSchema.accountId))
      .where(eq(classroomSchema.inviteCode, inviteCode)),
  )

  if (error) return null

  return data[0]
}

export const createClassroom = async (
  dto: Pick<ClassroomSchema, "name" | "description" | "inviteCode" | "instructor">,
) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const account = await findAccountById(session.accountId)

  if (!account) throw new Error("Invalid account")

  const { data, error } = await tryCatch(
    db
      .insert(classroomSchema)
      .values({ ...dto, id: `cl_${nanoid(25)}`, ownerId: session.accountId, subject: "EMPTY" })
      .returning({ id: classroomSchema.id }),
  )

  if (error) throw new Error("Failed to create classroom")

  return { id: data[0].id }
}

export const updateClassroomById = async (id: string, dto: Pick<ClassroomSchema, "name" | "description">) => {
  const { data, error } = await tryCatch(
    db.update(classroomSchema).set(dto).where(eq(classroomSchema.id, id)).returning({ id: classroomSchema.id }),
  )

  if (error) throw new Error("Failed to update classroom")

  return { id: data[0].id }
}

export const getAccountClassrooms = async (accountId: string) => {
  const { data, error } = await tryCatch(
    db
      .select({ classroom: classroomSchema, member: classroomMemberSchema })
      .from(classroomSchema)
      .leftJoin(classroomMemberSchema, eq(classroomSchema.id, classroomMemberSchema.classroomId))
      .where(eq(classroomMemberSchema.accountId, accountId)),
  )

  if (error) throw new Error("Failed to get account classrooms")

  return data
}

// Classroom Member

export const addClassroomMember = async (classroomCode: string) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const account = await findAccountById(session.accountId)

  if (!account) throw new Error("Invalid account")

  const classroom = await findClassroomByInviteCode(classroomCode)

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

  revalidatePath(`/dashboard/classrooms/${classroom.id}`)
  revalidatePath(`/dashboard/classrooms/${classroom.id}/members`)

  return { classroomId: classroom.id }
}

export const getClassroomMembers = async (classroomId: string) => {
  const { data, error } = await tryCatch(
    db
      .select({
        id: accountSchema.id,
        name: profileSchema.fullName,
        email: accountSchema.email,
        isOwner: eq(classroomMemberSchema.accountId, classroomSchema.ownerId),
        joined: classroomMemberSchema.createdAt,
        avatar: profileSchema.pictureUrl,
      })
      .from(classroomMemberSchema)
      .leftJoin(accountSchema, eq(classroomMemberSchema.accountId, accountSchema.id))
      .leftJoin(profileSchema, eq(accountSchema.id, profileSchema.accountId))
      .leftJoin(classroomSchema, eq(classroomMemberSchema.classroomId, classroomSchema.id))
      .where(eq(classroomMemberSchema.classroomId, classroomId)),
  )

  if (error) throw new Error("Failed to get classroom members")

  return data as ClassroomMemberAccount[]
}

// Classroom Event

export const createClassroomEvent = async (
  dto: Pick<ClassroomEventSchema, "classroomId" | "accountId" | "description" | "fileIds"> & {
    metadata?: ClassroomEventMetadata
  },
) => {
  const { classroomId, accountId, description, metadata } = dto

  const { error, data } = await tryCatch(
    db
      .insert(classroomEventSchema)
      .values({ id: `ce_${nanoid(25)}`, classroomId, accountId, description, metadata })
      .returning({ id: classroomEventSchema.id }),
  )

  if (error) throw new Error("Failed to create classroom event")

  revalidatePath(`/dashboard/classrooms/${dto.classroomId}`, "layout")

  return { id: data[0].id }
}

export const getClassroomEvents = async (classroomId: string) => {
  const { data: events, error } = await tryCatch(
    db
      .select({
        event: classroomEventSchema,
        userName: profileSchema.fullName,
        userAvatar: profileSchema.pictureUrl,
      })
      .from(classroomEventSchema)
      .leftJoin(accountSchema, eq(classroomEventSchema.accountId, accountSchema.id))
      .leftJoin(profileSchema, eq(accountSchema.id, profileSchema.accountId))
      .where(eq(classroomEventSchema.classroomId, classroomId))
      .orderBy(desc(classroomEventSchema.createdAt)),
  )

  if (error) throw new Error("Failed to get classroom events")

  return events
}
