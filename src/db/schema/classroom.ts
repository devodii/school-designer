import { AccountSchema, accountSchema } from "@/db/schema/account"
import { ClassroomEventMetadata } from "@/types"
import { pgTable, varchar, timestamp, unique, pgEnum, jsonb } from "drizzle-orm/pg-core"

export const classroomEventType = pgEnum("classroom_activity_type", ["NOTE", "PLAN", "ASSIGNMENT", "NEW_MEMBER"])

export const classroomSchema = pgTable("classroom", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  inviteCode: varchar("invite_code").notNull().unique(),
  instructor: jsonb("instructor").$type<{ name?: string; avatar?: string }>(),
  ownerId: varchar("owner_id")
    .notNull()
    .references(() => accountSchema.id, { onDelete: "cascade" }),
  subject: varchar("subject").notNull(),
  description: varchar("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
})

export const classroomMemberSchema = pgTable(
  "classroom_member",
  {
    id: varchar("id").primaryKey(),
    classroomId: varchar("classroom_id").references(() => classroomSchema.id, { onDelete: "cascade" }),
    accountId: varchar("account_id").references(() => accountSchema.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  ({ classroomId, accountId }) => [unique("unique_classroom_account").on(classroomId, accountId)],
)

export const classroomEventSchema = pgTable("classroom_timeline", {
  id: varchar("id").primaryKey(),
  classroomId: varchar("classroom_id").references(() => classroomSchema.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  description: varchar("text").notNull(),
  accountId: varchar("account_id").references(() => accountSchema.id, { onDelete: "cascade" }),
  metadata: jsonb("metadata").$type<ClassroomEventMetadata>(),
  fileIds: varchar("file_ids").array(),
})

export type ClassroomSchema = typeof classroomSchema.$inferSelect

export type ClassroomMemberSchema = typeof classroomMemberSchema.$inferSelect

export type ClassroomEventType = (typeof classroomEventType.enumValues)[number]

export type ClassroomEventSchema = typeof classroomEventSchema.$inferSelect

export type ClassroomMemberAccount = Pick<AccountSchema, "id" | "email"> & {
  name: string
  joined: Date
  avatar: string
  isOwner: boolean
}
