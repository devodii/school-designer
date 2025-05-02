import { accountSchema } from "@/db/schema/account"
import { fileUploadSchema } from "@/db/schema/file-upload"
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core"

export const feedbackSchema = pgTable("feedback", {
  id: varchar("id").primaryKey(),
  fileUploadId: varchar("file_upload_id").references(() => fileUploadSchema.id),
  text: varchar("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  accountId: varchar("account_id").references(() => accountSchema.id),
})

export type FeedbackSchema = typeof feedbackSchema.$inferSelect
