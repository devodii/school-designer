"use client"

import { useEffect, Suspense, useState } from "react"

import {
  verifyMagicLinkToken as verifyMagicLinkTokenAction,
  verifyGoogleToken as verifyGoogleTokenAction,
} from "@/actions/auth"
import { CardRoot } from "@/components/card-root"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { AuthProvider } from "@/db/schema/auth"
import { AuthIntent } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function VerifyTokenPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <VerifyToken />
    </Suspense>
  )
}

const VerifyToken = () => {
  const router = useRouter()
  const [state, setState] = useState<{ intent?: AuthIntent; redirectTo: string; provider: AuthProvider } | null>(null)

  const {
    mutate: verifyGoogleToken,
    isPending: isGoogleTokenPending,
    isError: isGoogleTokenError,
  } = useMutation({
    mutationFn: async (dto: { googleIdToken: string; intent: AuthIntent }) => {
      const response = await verifyGoogleTokenAction(dto.googleIdToken, dto.intent)

      setState({
        provider: "GOOGLE",
        intent: dto.intent,
        redirectTo: response?.isNewAccount ? "/onboarding" : "/dashboard",
      })

      return response
    },
  })

  const {
    mutate: verifyMagicLinkToken,
    isPending: isTokenPending,
    isError: isMagicLinkError,
  } = useMutation({
    mutationFn: async (dto: { token: string }) => {
      const response = await verifyMagicLinkTokenAction(dto.token)
      setState({
        provider: "EMAIL",
        intent: undefined,
        redirectTo: response?.isNewAccount ? "/onboarding" : "/dashboard",
      })
      return response
    },
  })

  const isError = isMagicLinkError || isGoogleTokenError

  const getAppIdToken = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const appIdToken = searchParams.get("c_token") as string
    return { appIdToken }
  }

  const getGoogleIdToken = () => {
    const hashFragment = window.location.hash.substring(1)
    const params = new URLSearchParams(hashFragment)
    const googleIdToken = params.get("id_token") as string
    const state = JSON.parse(atob(params.get("state") as string)) as { intent: AuthIntent }

    return { googleIdToken, intent: state.intent }
  }

  useEffect(() => {
    const handleVerifyToken = async () => {
      const { appIdToken } = getAppIdToken()

      if (appIdToken) return verifyMagicLinkToken({ token: appIdToken })

      const { googleIdToken, intent } = getGoogleIdToken()

      if (googleIdToken && intent) return verifyGoogleToken({ googleIdToken, intent })

      toast.error("No token provided")
    }

    handleVerifyToken()
  }, [verifyGoogleToken, verifyMagicLinkToken])

  if (isGoogleTokenPending || isTokenPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 px-4 py-6 md:px-8 md:py-12">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
        <CardRoot
          className="w-full max-w-md pt-6 pb-0"
          titleChildren={
            <div className="flex flex-col items-center gap-1">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 md:size-16">
                <X className="size-8 text-red-600" />
              </div>
              <div className="font-display text-center text-2xl font-bold">Verification Failed</div>
            </div>
          }
          contentClassName="text-center"
          contentChildren={
            <p className="-mt-4 text-gray-600">
              We couldn't verify your account. The verification link may have expired or is invalid.
            </p>
          }
          footerClassName="flex justify-center gap-4 pb-6"
          footerChildren={
            <div className="flex justify-center gap-4 pb-6">
              <Button
                variant="outline"
                onClick={() => {
                  if (state?.provider === "GOOGLE") {
                    const { googleIdToken, intent } = getGoogleIdToken()
                    return verifyGoogleToken({ googleIdToken, intent })
                  }

                  const { appIdToken } = getAppIdToken()
                  return verifyMagicLinkToken({ token: appIdToken })
                }}
              >
                Try Again
              </Button>
              <Button onClick={() => router.push(state?.intent === "SIGN_IN" ? "/signin" : "/signup")}>
                Back to Sign {state?.intent === "SIGN_IN" ? "In" : "Up"}
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  if (state) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
        <CardRoot
          className="w-full max-w-md pt-6 pb-0"
          titleChildren={
            <div className="flex flex-col items-center gap-2">
              <div className="bg-accent mx-auto flex size-12 items-center justify-center rounded-full md:size-16">
                <Check className="text-accent-foreground size-8" />
              </div>

              <div className="font-display pb-2 text-center text-2xl font-bold">Verification Succeeded</div>
            </div>
          }
          contentClassName="-mt-4"
          contentChildren={
            <p className="mb-6 text-center text-gray-600">
              Your account has been successfully verified. You can now access all features of ClassyNotes.
            </p>
          }
          footerClassName="flex justify-center pb-6"
          footerChildren={
            <Button className="mx-auto w-full max-w-xs px-6" onClick={() => router.push(state.redirectTo)}>
              Continue to ClassyNotes
            </Button>
          }
        />
      </div>
    )
  }
}
