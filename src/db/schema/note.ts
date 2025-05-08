import { accountSchema } from "@/db/schema/account"
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

export const noteSchema = pgTable("note", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => `no_${nanoid(25)}`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  accountId: varchar("account_id")
    .notNull()
    .references(() => accountSchema.id),
})

export type NoteSchema = typeof noteSchema.$inferSelect
