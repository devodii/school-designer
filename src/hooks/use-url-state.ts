"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const useUrlState = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const set = (dto: { name: string; value: string }[]) => {
    const params = new URLSearchParams(searchParams)

    for (const { name, value } of dto) params.set(name, value)

    router.replace(`${pathname}?${params.toString()}`)
  }

  const remove = (keys: string[]) => {
    const params = new URLSearchParams(searchParams)
    for (const key of keys) params.delete(key)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return { set, remove }
}
