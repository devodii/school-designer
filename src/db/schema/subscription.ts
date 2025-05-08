import { accountSchema } from "@/db/schema/account"
import { CheckoutSessionMetadata, SubscriptionMetadata } from "@/types"
import { SubscriptionStatus as PolarSubscriptionStatus } from "@polar-sh/sdk/models/components/subscriptionstatus.js"
import { pgTable, varchar, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core"

export type SubscriptionStatus = PolarSubscriptionStatus

export const subscriptionFrequencyEnum = pgEnum("subscription_frequency", ["MONTHLY", "YEARLY"])

export const checkoutSessionSchema = pgTable("checkout_session", {
  id: varchar("id").primaryKey().notNull(),
  accountId: varchar("account_id")
    .notNull()
    .references(() => accountSchema.id, { onDelete: "cascade" }),
  providerId: varchar("provider_id").notNull(),
  metadata: jsonb("metadata").$type<CheckoutSessionMetadata>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
})

export const subscriptionSchema = pgTable("subscription", {
  id: varchar("id").primaryKey().notNull(),
  providerId: varchar("provider_id").notNull(),
  accountId: varchar("account_id")
    .notNull()
    .references(() => accountSchema.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(() => new Date()),
  status: varchar("status").$type<SubscriptionStatus>(),
  frequency: subscriptionFrequencyEnum("frequency"),
  metadata: jsonb("metadata").$type<SubscriptionMetadata>(),
  checkoutSessionId: varchar("checkout_session_id").references(() => checkoutSessionSchema.id, {
    onDelete: "set null",
  }),
  expiresAt: timestamp("expires_at"),
})

export type SubscriptionSchema = typeof subscriptionSchema.$inferSelect

export type CheckoutSessionSchema = typeof checkoutSessionSchema.$inferSelect

export type SubscriptionFrequency = (typeof subscriptionFrequencyEnum.enumValues)[number]
