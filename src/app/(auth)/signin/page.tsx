"use client"

import { useState } from "react"

import { AuthForm } from "@/components/auth/auth-form"
import { CardRoot } from "@/components/card-root"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignIn() {
  const router = useRouter()
  const [emailSent, setEmailSent] = useState(false)

  const handleGoogleSignIn = () => {
    const authUrlDomain = "https://accounts.google.com/o/oauth2/v2/auth"

    const authUrlParams = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: `${window.location.origin}/verify`,
      response_type: "id_token",
      scope: "openid profile email",
      nonce: nanoid(19),
      prompt: "consent",
      state: btoa(JSON.stringify({ intent: "SIGN_IN" })),
    }

    const authUrl = `${authUrlDomain}?${new URLSearchParams(authUrlParams)}`

    router.push(authUrl)
  }

  if (emailSent) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
        <CardRoot
          className="w-full max-w-md"
          titleChildren={
            <div className="flex w-full flex-col items-center gap-2">
              <Logo />
              <div className="text-2xl font-semibold">Check your email</div>
            </div>
          }
          descriptionChildren={
            <div className="text-center text-sm text-gray-500">We've sent a magic link to your email address</div>
          }
          contentChildren={
            <div className="flex flex-col items-center gap-4">
              <div className="mx-auto my-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setEmailSent(false)}>
                Back to sign in
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
      <CardRoot
        className="w-full max-w-md pt-6 pb-2"
        titleChildren={
          <div className="flex w-full flex-col items-center gap-2">
            <Logo />
            <div className="text-2xl font-semibold">Sign in to ClassyNotes</div>
          </div>
        }
        descriptionAbout="Enter your email below to receive a magic link"
        contentClassName="grid gap-4"
        contentChildren={
          <>
            <AuthForm
              intent="SIGN_IN"
              onSendMagicLink={() => setEmailSent(true)}
              onError={error => toast.error(error)}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center gap-2"
            >
              <svg width="23" height="24" viewBox="0 0 23 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22.54 12.2615C22.54 11.446 22.4668 10.6619 22.3309 9.90918H11.5V14.3576H17.6891C17.4225 15.7951 16.6123 17.013 15.3943 17.8285V20.714H19.1109C21.2855 18.7119 22.54 15.7637 22.54 12.2615Z"
                  fill="#4285F4"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5 23.5001C14.605 23.5001 17.2081 22.4703 19.1109 20.7139L15.3943 17.8285C14.3645 18.5185 13.0472 18.9262 11.5 18.9262C8.50474 18.9262 5.96951 16.9032 5.06519 14.1851H1.22314V17.1646C3.11542 20.923 7.00451 23.5001 11.5 23.5001Z"
                  fill="#34A853"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.06523 14.185C4.83523 13.495 4.70455 12.7579 4.70455 12C4.70455 11.242 4.83523 10.505 5.06523 9.81499V6.83545H1.22318C0.444318 8.38795 0 10.1443 0 12C0 13.8557 0.444318 15.612 1.22318 17.1645L5.06523 14.185Z"
                  fill="#FBBC05"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5 5.07386C13.1884 5.07386 14.7043 5.65409 15.8961 6.79364L19.1945 3.49523C17.2029 1.63955 14.5997 0.5 11.5 0.5C7.00451 0.5 3.11542 3.07705 1.22314 6.83545L5.06519 9.815C5.96951 7.09682 8.50474 5.07386 11.5 5.07386Z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-semibold">Continue with Google</span>
            </Button>
          </>
        }
        footerClassName="flex justify-center"
        footerChildren={
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="underline hover:text-black">
              Sign up
            </Link>
          </div>
        }
      />
    </div>
  )
}
