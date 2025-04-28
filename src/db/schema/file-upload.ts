import { accountSchema } from "@/db/schema/account"
import { pgTable, varchar, foreignKey, timestamp, pgEnum, index, jsonb } from "drizzle-orm/pg-core"

export type FileMetadata = {
  SCOPE: "PROFILE"
}

export const fileUploadTypeEnum = pgEnum("fileUploadType", ["IMAGE"])

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
  ({ accountId }) => ({
    accountFk: foreignKey({
      columns: [accountId],
      foreignColumns: [accountSchema.id],
      name: "fk__account_file_upload",
    }).onDelete("cascade"),
    accountIdIdx: index("account_id_idx").on(accountId),
  }),
)

export type FileUploadSchema = typeof fileUploadSchema.$inferSelect

export type FileUploadType = (typeof fileUploadTypeEnum.enumValues)[number]
