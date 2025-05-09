"use client"

import { findProfileByAccountId } from "@/actions/account"
import { getCurrentUser, getSession } from "@/actions/session"
import { useQuery } from "@tanstack/react-query"

export const useGetAccount = () => {
  return useQuery({ queryKey: ["account"], queryFn: getCurrentUser })
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await getSession()

      if (!response) throw new Error("No session found")

      const profile = await findProfileByAccountId(response.accountId)

      return profile
    },
  })
}
