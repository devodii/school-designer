"use server"

import db from "@/db"
import { accountSchema, AccountSchema } from "@/db/schema/account"
import { eq } from "drizzle-orm"

export const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(accountSchema).where(eq(accountSchema.email, email))
  return user
}

export const findUserById = async (id: string) => {
  const [user] = await db.select().from(accountSchema).where(eq(accountSchema.id, id))
  return user
}

export const updateAccount = async (id: string, data: Partial<AccountSchema>) => {
  const [user] = await db.update(accountSchema).set(data).where(eq(accountSchema.id, id)).returning()
  return user
}
