import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const waitlist = pgTable("waitlist", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  study_challenge: text("study_challenge"),
  would_pay: text("would_pay").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type Waitlist = typeof waitlist.$inferSelect
