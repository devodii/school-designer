"use server"

import db from "@/db"
import { accountSchema, AccountSchema } from "@/db/schema/account"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export const findAccountByEmail = async (email: string) => {
  const { data, error } = await tryCatch(db.select().from(accountSchema).where(eq(accountSchema.email, email)))

  if (error) throw new Error("Failed to find user")

  return data[0]
}

export const findAccountById = async (id: string) => {
  const { data, error } = await tryCatch(db.select().from(accountSchema).where(eq(accountSchema.id, id)))

  if (error) throw new Error("Failed to find user")

  return data[0]
}

export const updateAccount = async (id: string, data: Partial<AccountSchema>) => {
  const [user] = await db.update(accountSchema).set(data).where(eq(accountSchema.id, id)).returning()
  return user
}

export const createAccount = async (dto: { email: string }) => {
  const { data: user, error } = await tryCatch(
    db
      .insert(accountSchema)
      .values({
        id: `ac_${nanoid(25)}`,
        email: dto.email,
        created_at: new Date(),
        updated_at: new Date(),
        isOnboarded: false,
        referral_code: `ref+${nanoid(10)}`,
        profile: null,
        level: null,
      })
      .returning({ id: accountSchema.id }),
  )

  if (error) throw new Error("Failed to create account")

  return user[0]
}
