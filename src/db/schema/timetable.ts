import { accountSchema } from "@/db/schema/account"
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const timetableSchema = pgTable("timetable", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  fileIds: text("file_ids").array().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  accountId: varchar("account_id")
    .notNull()
    .references(() => accountSchema.id, { onDelete: "set null" }),
})

export type TimetableSchema = typeof timetableSchema.$inferSelect
