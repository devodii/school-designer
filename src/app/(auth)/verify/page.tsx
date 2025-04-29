"use client"

import { useEffect } from "react"

import { verifyToken as verifyTokenAction } from "@/actions/auth"
import { Spinner } from "@/components/spinner"
import { delay } from "@/lib/delay"
import { useMutation } from "@tanstack/react-query"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function VerifyTokenPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") as string
  const router = useRouter()

  const {
    mutate: verifyToken,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      if (!token) {
        toast.error("No token provided")
        return
      }

      await delay(2000)
      return await verifyTokenAction(token)
    },
    onSuccess: response => {
      if (response?.data.accountId) {
        router.replace("/dashboard")
      } else {
        router.replace("/onboarding")
      }
    },
  })

  useEffect(() => {
    ;(() => verifyToken())()
  }, [])

  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 px-4 py-6 md:px-8 md:py-12">
        <h2 className="text-center text-3xl font-semibold">Verifying your sign in</h2>

        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 px-4 py-6 md:px-8 md:py-12">
        <h2 className="text-center text-3xl font-semibold">An error occured</h2>
        <p className="text-muted-foreground mx-auto w-full max-w-sm text-center text-sm">{error.message}</p>
      </div>
    )
  }
}
