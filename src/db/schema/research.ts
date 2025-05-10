import { accountSchema, EducationLevel } from "@/db/schema/account"
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const researchSchema = pgTable("research", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => `re_${nanoid(25)}`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  surveyLink: varchar("survey_link").notNull(),
  targetAudience: text("target_audience").$type<EducationLevel[]>().array().notNull(),
  accountId: varchar("account_id").references(() => accountSchema.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
})

export type ResearchSchema = typeof researchSchema.$inferSelect

export const researchActionSchema = pgTable("research_action", {
  id: varchar("id").primaryKey(),
  researchId: varchar("research_id").references(() => researchSchema.id, { onDelete: "set null" }),
  accountId: varchar("account_id").references(() => accountSchema.id, { onDelete: "set null" }),
  metadata: jsonb("metadata").$type<{ via: string }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
})

export type ResearchActionSchema = typeof researchActionSchema.$inferSelect
