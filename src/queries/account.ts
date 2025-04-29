import { findAccountById } from "@/actions/account"
import { getSession } from "@/actions/session"

export const getAccount = () => ({
  queryKey: ["account"],
  queryFn: async () => {
    const session = await getSession()

    if (!session) throw new Error("Unauthorized")

    const account = await findAccountById(session.accountId)

    return account
  },
})
