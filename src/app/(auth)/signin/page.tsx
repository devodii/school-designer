"use client"

import { useState } from "react"

import { AuthForm } from "@/components/auth/auth-form"
import { GoogleLogin } from "@/components/auth/google-login"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function SignIn() {
  const [selectedEmailLogin, setSelectedEmailLogin] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)

  if (showEmailSent) {
    return (
      <div className="flex w-screen flex-col gap-6 px-4 py-6 md:px-8 md:py-12">
        <h2 className="text-center text-3xl font-semibold">Login to School Designer</h2>
        <p className="text-muted-foreground mx-auto w-full max-w-sm text-center text-sm">
          We’ve sent a magic link to your email. Please check your inbox.
        </p>
        <Button className="mx-auto w-full max-w-sm" variant="outline" onClick={() => setShowEmailSent(false)}>
          Back
        </Button>
      </div>
    )
  }

  if (selectedEmailLogin) {
    return (
      <div className="flex w-screen flex-col gap-6 px-4 py-6 md:px-8 md:py-12">
        <h2 className="text-center text-3xl font-semibold">Login to School Designer</h2>

        <div className="mx-auto flex w-full max-w-sm flex-col gap-1">
          <AuthForm
            onSendMagicLink={() => {
              setShowEmailSent(true)
            }}
            onError={message => toast.error(message)}
          />
          <Button variant="outline" onClick={() => setSelectedEmailLogin(false)}>
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-screen flex-col gap-6 px-4 py-6 md:px-8 md:py-12">
      <h2 className="text-center text-3xl font-semibold">Login to School Designer</h2>

      <div className="mx-auto flex w-full max-w-sm flex-col gap-1">
        <GoogleLogin />
        <Button variant="link" onClick={() => setSelectedEmailLogin(true)}>
          Continue with Email
        </Button>
      </div>
    </div>
  )
}
