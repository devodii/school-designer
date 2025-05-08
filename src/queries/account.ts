import { findProfileByAccountId } from "@/actions/account"
import { getCurrentUser, getSession } from "@/actions/session"

export const getAccount = () => ({
  queryKey: ["account"],
  queryFn: getCurrentUser,
})

export const getProfile = () => ({
  queryKey: ["profile"],
  queryFn: async () => {
    const response = await getSession()

    if (!response) throw new Error("No session found")

    const profile = await findProfileByAccountId(response.accountId)

    return profile
  },
})
