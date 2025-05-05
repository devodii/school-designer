import { getCurrentUser } from "@/actions/session"

export const getAccount = () => ({
  queryKey: ["account"],
  queryFn: getCurrentUser,
})
