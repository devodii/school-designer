import { accountSchema } from "@/db/schema/account"
import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core"

export const classroomSchema = pgTable("classroom", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  inviteCode: varchar("invite_code").notNull().unique(),
  ownerId: varchar("owner_id").references(() => accountSchema.id),
  subject: varchar("subject").notNull(),
  description: varchar("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
})

export const classroomInviteSchema = pgTable("classroom_invite", {
  id: varchar("id").primaryKey(),
  classroomId: varchar("classroom_id").references(() => classroomSchema.id),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const classroomMemberSchema = pgTable("classroom_member", {
  id: varchar("id").primaryKey(),
  classroomId: varchar("classroom_id").references(() => classroomSchema.id),
  accountId: varchar("account_id").references(() => accountSchema.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type ClassroomSchema = typeof classroomSchema.$inferSelect

export type ClassroomInviteSchema = typeof classroomInviteSchema.$inferSelect

export type ClassroomMemberSchema = typeof classroomMemberSchema.$inferSelect
