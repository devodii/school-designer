import { boolean, index, pgEnum, pgTable, timestamp, varchar, vector } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const educationLevelEnum = pgEnum("education_level", ["COLLEGE", "HIGH_SCHOOL"])

export const accountSchema = pgTable(
  "account",
  {
    id: varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => `ac_${nanoid(25)}`),
    email: varchar("email").unique().notNull(),
    referralCode: varchar("referral_code").unique(),
    educationLevel: educationLevelEnum("education_level"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    customerId: varchar("customer_id"),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
    isOnboarded: boolean("is_onboarded").default(false),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  ({ embedding }) => [index("embeddingIndex").using("hnsw", embedding.op("vector_cosine_ops"))],
)

export type AccountSchema = typeof accountSchema.$inferSelect

export const profileSchema = pgTable("profile", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => `pr_${nanoid(25)}`),
  fullName: varchar("full_name").notNull(),
  pictureUrl: varchar("picture_url").notNull(),
  schoolName: varchar("school_name").notNull(),
  accountId: varchar("account_id").references(() => accountSchema.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
})

export type ProfileSchema = typeof profileSchema.$inferSelect
