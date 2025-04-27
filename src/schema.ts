import { AccountProfile } from "@/types"
import { foreignKey, index, jsonb, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

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

export const auth = pgTable(
  "auth",
  {
    id: varchar("id").primaryKey().notNull(),
    token: varchar("token").unique().notNull(),
    email: varchar("email").notNull(),
    account_id: varchar("account_id"),
    used_at: timestamp("used_at"),
    expires_at: varchar("expires_at").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  },
  ({ email, token, account_id }) => ({
    accountFk: foreignKey({
      columns: [account_id],
      foreignColumns: [account.id],
      name: "fk__account_auth",
    }).onDelete("cascade"),
    emailIdx: index("email_idx").on(email),
    tokenIdx: index("token_idx").on(token),
  }),
)
