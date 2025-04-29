import { AccountProfile } from "@/types"
import { boolean, jsonb, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const levelEnum = pgEnum("level", ["COLLEGE", "HIGH SCHOOL"])

export const accountSchema = pgTable("account", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  referral_code: varchar("referral_code").unique(),
  level: levelEnum("level"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  profile: jsonb("profile").$type<AccountProfile>(),
  isOnboarded: boolean("is_onboarded").default(false),
})

export type AccountSchema = typeof accountSchema.$inferSelect
