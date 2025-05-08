import { getSession } from "@/actions/session"
import { findAccountSubscriptions } from "@/actions/subscriptions"

export const getAccountSubscriptions = () => ({
  queryKey: ["subscriptions"],
  queryFn: async () => {
    const session = await getSession()

    if (!session) throw new Error("Unauthorized")

    return findAccountSubscriptions(session.accountId)
  },
})
