import { AccountProfile } from "@/types"
import { jsonb, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const levelEnum = pgEnum("level", ["COLLEDGE", "HIGH SCHOOL"])

export const account = pgTable("account", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  referral_code: varchar("referral_code").unique(),
  level: levelEnum("level"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  profile: jsonb().$type<AccountProfile>(),
})
