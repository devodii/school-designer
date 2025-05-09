import { accountSchema } from "@/db/schema/account"
import { foreignKey, index, jsonb, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export type FileMetadata = {
  scope: "ACCOUNT_PROFILE" | "COOKBOOK" | "TIMETABLE"
}

export const fileUploadTypeEnum = pgEnum("fileUploadType", ["IMAGE", "PDF"])

export const fileUploadSchema = pgTable(
  "file_upload",
  {
    id: varchar("id").notNull().primaryKey(),
    url: varchar("url").notNull(),
    accountId: varchar("account_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
    type: fileUploadTypeEnum().notNull(),
    metadata: jsonb("metadata").$type<FileMetadata>(),
  },
  ({ accountId }) => [
    foreignKey({ columns: [accountId], name: `fk__account_file_upload`, foreignColumns: [accountSchema.id] }).onDelete(
      "cascade",
    ),
    index("account_id_idx").on(accountId),
  ],
)

export type FileUploadSchema = typeof fileUploadSchema.$inferSelect

export type FileUploadType = (typeof fileUploadTypeEnum.enumValues)[number]
