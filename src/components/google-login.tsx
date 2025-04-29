"use client"

import { Google } from "@components/icons"
import { Button } from "@components/ui/button"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"

export const GoogleLogin = () => {
  const router = useRouter()

  const handleLogin = () => {
    const authUrlDomain = "https://accounts.google.com/o/oauth2/v2/auth"

    const authUrlParams = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: `${window.location.origin}/verify`,
      response_type: "id_token",
      scope: "openid profile email",
      nonce: nanoid(19),
      prompt: "consent",
    }

    const authUrl = `${authUrlDomain}?${new URLSearchParams(authUrlParams)}`

    router.push(authUrl)
  }

  return (
    <Button variant="outline" className="flex items-center gap-1" onClick={handleLogin}>
      <Google />
      <span>Continue with Google</span>
    </Button>
  )
}
