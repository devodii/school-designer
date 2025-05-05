"use server"

import { findAccountById } from "@/actions/account"
import { getSession } from "@/actions/session"
import db from "@/db"
import {
  CheckoutSessionSchema,
  checkoutSessionSchema,
  SubscriptionFrequency,
  subscriptionSchema,
  SubscriptionSchema,
} from "@/db/schema/subscription"
import { polar } from "@/lib/polar"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

export const createSubscription = async (
  payload: Pick<
    SubscriptionSchema,
    "accountId" | "metadata" | "status" | "providerId" | "expiresAt" | "checkoutSessionId"
  >,
) => {
  const { accountId, metadata, status, providerId, expiresAt, checkoutSessionId } = payload

  const { data: subscription, error } = await tryCatch(
    db
      .insert(subscriptionSchema)
      .values({ id: `su_${nanoid(25)}`, accountId, status, metadata, providerId, expiresAt, checkoutSessionId })
      .returning(),
  )

  if (error) throw new Error(error.message)

  return subscription
}

export const findAccountSubscriptions = async (accountId: string) => {
  const { data: subscription, error } = await tryCatch(
    db.select().from(subscriptionSchema).where(eq(subscriptionSchema.accountId, accountId)),
  )

  if (error) throw new Error(error.message)

  return subscription
}

export const updateSubscription = async (dto: Pick<SubscriptionSchema, "providerId" | "status">) => {
  const { providerId, status } = dto

  const { data: subscription, error } = await tryCatch(
    db.update(subscriptionSchema).set({ status }).where(eq(subscriptionSchema.providerId, providerId)),
  )

  if (error) throw new Error(error.message)

  return subscription[0]
}

export const createCheckoutSession = async (
  dto: Pick<CheckoutSessionSchema, "accountId" | "metadata" | "providerId">,
) => {
  const { accountId, metadata, providerId } = dto

  const { data: checkoutSession, error } = await tryCatch(
    db
      .insert(checkoutSessionSchema)
      .values({ id: `cs_${nanoid(25)}`, accountId, metadata, providerId })
      .returning(),
  )

  if (error) throw new Error(error.message)

  return checkoutSession[0]
}

export const findCheckoutSessionByProviderId = async (providerId: string) => {
  const { data: checkoutSession, error } = await tryCatch(
    db.select().from(checkoutSessionSchema).where(eq(checkoutSessionSchema.providerId, providerId)),
  )

  if (error) throw new Error(error.message)

  return checkoutSession[0]
}

export const createPolarCheckoutSession = async (
  dto: Pick<CheckoutSessionSchema, "metadata"> & { frequency: SubscriptionFrequency },
) => {
  const { metadata, frequency } = dto

  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const account = await findAccountById(session.accountId)

  if (!account) throw new Error("Invalid account")

  const { data, error } = await tryCatch(
    polar.checkouts.create({
      ...(metadata && metadata),
      successUrl: `${process.env.APP_URL}/payment-success`,
      products: frequency == "MONTHLY" ? [process.env.POLAR_MONTHLY_PLAN_ID!] : [process.env.POLAR_ANNUAL_PLAN_ID!],
    }),
  )

  if (error) throw new Error(error.message)

  await createCheckoutSession({ accountId: account.id, metadata, providerId: data.id })

  return data.url
}
