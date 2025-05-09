import { accountSchema } from "@/db/schema/account"
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const feedbackSchema = pgTable("feedback", {
  id: varchar("id").primaryKey(),
  fileIds: varchar("file_ids").array(),
  text: varchar("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  accountId: varchar("account_id").references(() => accountSchema.id, { onDelete: "set null" }),
})

export type FeedbackSchema = typeof feedbackSchema.$inferSelect
