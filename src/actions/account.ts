"use server"

import db from "@/db"
import { accountSchema, AccountSchema, profileSchema, ProfileSchema } from "@/db/schema/account"
import { tryCatch } from "@/lib/try-catch"
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm"
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
  const { data: account, error } = await tryCatch(
    db
      .update(accountSchema)
      .set({ ...data, [accountSchema.educationLevel.name]: data.educationLevel as any })
      .where(eq(accountSchema.id, id))
      .returning(),
  )

  console.log({ account, error })

  if (error) throw new Error("Failed to update account")

  return account[0]
}

export const updateProfile = async (id: string, data: Partial<ProfileSchema>) => {
  const { data: profile, error } = await tryCatch(
    db.update(profileSchema).set(data).where(eq(profileSchema.id, id)).returning(),
  )

  if (error) throw new Error("Failed to update profile")

  return profile[0]
}

export const createProfile = async (
  accountId: string,
  dto: Pick<ProfileSchema, "fullName" | "pictureUrl" | "schoolName">,
) => {
  const { data, error } = await tryCatch(
    db
      .insert(profileSchema)
      .values({ ...dto, accountId })
      .returning({ id: profileSchema.id }),
  )
  if (error) throw new Error("Failed to create profile")

  return data[0]
}

export const findProfileByAccountId = async (accountId: string) => {
  const { data, error } = await tryCatch(db.select().from(profileSchema).where(eq(profileSchema.accountId, accountId)))

  if (error) return null

  return data[0]
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

export const findAccountRecommendation = async (accountId: string) => {
  const account = await findAccountById(accountId)

  if (!account) throw new Error("Account not found")

  if (!account.embedding) throw new Error("Account embedding not found")

  const similarity = sql<number>`1 - (${cosineDistance(accountSchema.embedding, account.embedding)})`

  return db
    .select({
      accountId: accountSchema.id,
      similarity,
      fullName: profileSchema.fullName,
      pictureUrl: profileSchema.pictureUrl,
      schoolName: profileSchema.schoolName,
    })
    .from(accountSchema)
    .leftJoin(profileSchema, eq(profileSchema.accountId, accountSchema.id))
    .where(gt(similarity, 0.5))
    .orderBy(desc(similarity))
    .limit(1)
}
