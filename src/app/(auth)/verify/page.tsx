"use client"

import { useEffect, Suspense } from "react"

import { verifyMagicLinkToken, verifyGoogleToken } from "@/actions/auth"
import { Spinner } from "@/components/spinner"
import { sleep } from "@/lib/sleep"
import { useMutation } from "@tanstack/react-query"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function VerifyTokenPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <VerifyToken />
    </Suspense>
  )
}

const VerifyToken = () => {
  const searchParams = useSearchParams()
  const token = searchParams?.get("token") as string
  const router = useRouter()

  const {
    mutate: verifyToken,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      await sleep(2000)

      // Google Auth
      const hashFragment = window.location.hash.substring(1)
      const params = new URLSearchParams(hashFragment)
      const idToken = params.get("id_token") as string

      if (idToken) {
        return await verifyGoogleToken(idToken)
      }

      if (!token) {
        toast.error("No token provided")
        return
      }

      // Magic Link Auth
      return await verifyMagicLinkToken(token)
    },
    onSuccess: response => {
      if (response?.isNewAccount) {
        router.replace("/onboarding")
      } else {
        router.replace("/dashboard")
      }
    },
  })

  useEffect(() => {
    ;(() => verifyToken())()
  }, [verifyToken])

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
