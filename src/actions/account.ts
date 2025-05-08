"use server"

import db from "@/db"
import { accountSchema, AccountSchema, profileSchema, ProfileSchema } from "@/db/schema/account"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export const findAccountByEmail = async (email: string) => {
  const { data, error } = await tryCatch(db.select().from(accountSchema).where(eq(accountSchema.email, email)))

  if (error) return null

  return data[0]
}

export const findAccountById = async (id: string) => {
  const { data, error } = await tryCatch(db.select().from(accountSchema).where(eq(accountSchema.id, id)))

  if (error) return null

  return data[0]
}

export const updateAccount = async (id: string, data: Partial<AccountSchema>) => {
  const [user] = await db.update(accountSchema).set(data).where(eq(accountSchema.id, id)).returning()
  return user
}

export const createProfile = async (
  accountId: string,
  data: Pick<ProfileSchema, "fullName" | "pictureUrl" | "schoolName">,
) => {
  const [user] = await db
    .insert(profileSchema)
    .values({ ...data, accountId })
    .returning({ id: profileSchema.id })
  return user
}

export const createAccount = async (dto: { email: string }) => {
  const { data: user, error } = await tryCatch(
    db
      .insert(accountSchema)
      .values({ email: dto.email, isOnboarded: false, referralCode: `ref_${nanoid(25)}` })
      .returning({ id: accountSchema.id }),
  )

  if (error) throw new Error("Failed to create account")

  return user[0]
}
