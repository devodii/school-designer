import { createSubscription, findCheckoutSessionByProviderId, updateSubscription } from "@/actions/subscriptions"
import { Webhooks } from "@polar-sh/nextjs"

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onSubscriptionCreated: async payload => {
    const checkoutProviderId = payload.data.checkoutId

    if (!checkoutProviderId) throw new Error("Invalid Checkout ID")

    const checkout = await findCheckoutSessionByProviderId(checkoutProviderId)

    if (!checkout) throw new Error("Checkout session not found")

    await createSubscription({
      accountId: checkout.accountId,
      providerId: payload.data.id,
      status: payload.data.status,
      checkoutSessionId: checkout.id,
      metadata: { provider: "POLAR" },
      expiresAt: payload.data.endedAt as Date,
    })
  },
  onSubscriptionUpdated: async payload => {
    await updateSubscription({ providerId: payload.data.id, status: payload.data.status })
  },
})
