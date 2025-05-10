"use client"

import { Suspense, useEffect, useState } from "react"

import {
  verifyGoogleToken as verifyGoogleTokenAction,
  verifyMagicLinkToken as verifyMagicLinkTokenAction,
} from "@/actions/auth"
import { CardRoot } from "@/components/card-root"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { AuthProvider } from "@/db/schema/auth"
import { parseJSON } from "@/lib/json"
import { AuthIntent } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

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
    mutationFn: async (dto: { googleIdToken: string; intent: AuthIntent; redirect?: string }) => {
      const response = await verifyGoogleTokenAction(dto.googleIdToken, dto.intent)

      return { ...response, ...dto }
    },
    onSuccess: response => {
      setState({
        provider: "GOOGLE",
        intent: response.intent,
        redirectTo: response?.redirect ? response.redirect : response?.isNewAccount ? "/onboarding" : "/dashboard",
      })
    },
  })

  const {
    mutate: verifyMagicLinkToken,
    isPending: isTokenPending,
    isError: isMagicLinkError,
  } = useMutation({
    mutationFn: async (dto: { token: string; redirect?: string }) => {
      const response = await verifyMagicLinkTokenAction(dto.token)

      return { ...response, ...dto }
    },
    onSuccess: response => {
      setState({
        provider: "EMAIL",
        intent: response.intent,
        redirectTo: response?.redirect ? response.redirect : response?.isNewAccount ? "/onboarding" : "/dashboard",
      })
    },
  })

  const isError = isMagicLinkError || isGoogleTokenError

  const getAppIdToken = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const appIdToken = searchParams.get("c_token") as string
    const redirect = searchParams.get("redirect")

    return { appIdToken, ...(redirect && { redirect }) }
  }

  const getGoogleIdToken = () => {
    const hashFragment = window.location.hash.substring(1)
    const params = new URLSearchParams(hashFragment)
    const googleIdToken = params.get("id_token") as string
    const state = params.get("state")

    if (!state) return { googleIdToken, state: { intent: "SIGN_IN", redirect: undefined } }

    const parsedState = parseJSON<{ intent: AuthIntent; redirect?: string }>(state)

    if (parsedState) return { googleIdToken, state: parsedState }

    return { googleIdToken, state: { intent: "SIGN_IN", redirect: undefined } }
  }

  useEffect(() => {
    const handleVerifyToken = async () => {
      const { appIdToken, redirect } = getAppIdToken()

      if (appIdToken) return verifyMagicLinkToken({ token: appIdToken, redirect })

      const { googleIdToken, state } = getGoogleIdToken()

      if (googleIdToken && state.intent) {
        return verifyGoogleToken({ googleIdToken, intent: state.intent as AuthIntent, redirect: state?.redirect })
      }
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
                    const { googleIdToken, state } = getGoogleIdToken()
                    return verifyGoogleToken({
                      googleIdToken,
                      intent: state.intent as AuthIntent,
                      redirect: state?.redirect,
                    })
                  }

                  const { appIdToken, redirect } = getAppIdToken()
                  return verifyMagicLinkToken({ token: appIdToken, redirect })
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
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-50 md:size-16">
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
