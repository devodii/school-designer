import { accountSchema } from "@/db/schema/account"
import { foreignKey, index, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const authProviderEnum = pgEnum("auth_provider", ["EMAIL", "GOOGLE"])

export const authSchema = pgTable(
  "auth",
  {
    id: varchar("id").primaryKey().notNull(),
    token: varchar("token").unique().notNull(),
    email: varchar("email").notNull(),
    accountId: varchar("account_id"),
    usedAt: timestamp("used_at"),
    expiresAt: varchar("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
    accessToken: varchar("access_token"),
    refreshToken: varchar("refresh_token"),
    provider: authProviderEnum("provider"),
  },
  ({ email, token, accountId }) => ({
    accountFk: foreignKey({
      columns: [accountId],
      foreignColumns: [accountSchema.id],
      name: "fk__account_auth",
    }).onDelete("cascade"),
    emailIdx: index("email_idx").on(email),
    tokenIdx: index("token_idx").on(token),
  }),
)

export type AuthSchema = typeof authSchema.$inferSelect

export type AuthProvider = (typeof authProviderEnum.enumValues)[number]

export interface GoogleIdTokenPayload {
  at_hash: string
  aud: string
  azp: string
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  jti: string
  name: string
  nbf: number
  nonce: string
  picture: string
  sub: string
}
