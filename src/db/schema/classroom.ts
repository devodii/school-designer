import { accountSchema } from "@/db/schema/account"
import { ClassroomActivityMetadata } from "@/types"
import { pgTable, varchar, timestamp, unique, pgEnum, jsonb } from "drizzle-orm/pg-core"

export const classroomActivityType = pgEnum("classroom_activity_type", [
  "NOTE",
  "STUDY_PLAN",
  "HOMEWORK",
  "QUESTION",
  "ANNOUNCEMENT",
  "RESOURCE",
  "OTHER",
])

export const classroomSchema = pgTable("classroom", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  inviteCode: varchar("invite_code").notNull().unique(),
  ownerId: varchar("owner_id")
    .notNull()
    .references(() => accountSchema.id),
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

export const classroomMemberSchema = pgTable(
  "classroom_member",
  {
    id: varchar("id").primaryKey(),
    classroomId: varchar("classroom_id").references(() => classroomSchema.id),
    accountId: varchar("account_id").references(() => accountSchema.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  ({ classroomId, accountId }) => [unique("unique_classroom_account").on(classroomId, accountId)],
)

export const classroomActivitySchema = pgTable("classroom_activity", {
  id: varchar("id").primaryKey(),
  classroomId: varchar("classroom_id").references(() => classroomSchema.id),
  accountId: varchar("account_id")
    .notNull()
    .references(() => accountSchema.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  type: classroomActivityType("type").notNull(),
  metadata: jsonb("metadata").notNull().$type<ClassroomActivityMetadata>(),
})

export type ClassroomSchema = typeof classroomSchema.$inferSelect

export type ClassroomInviteSchema = typeof classroomInviteSchema.$inferSelect

export type ClassroomMemberSchema = typeof classroomMemberSchema.$inferSelect

export type ClassroomActivitySchema = typeof classroomActivitySchema.$inferSelect

export type ClassroomActivityType = (typeof classroomActivityType.enumValues)[number]
