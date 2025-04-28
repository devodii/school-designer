import { verifyToken } from "@/actions/auth"
import { delay } from "@/lib/delay"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface VerifyTokenPageProps {
  searchParams: Promise<Record<string, string>>
}

export default async function VerifyTokenPage({ searchParams }: VerifyTokenPageProps) {
  const { token } = await searchParams
  await delay(2000)
  const verify = await verifyToken(token)

  const cookieStore = await cookies()

  if (!verify?.success) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 px-4 py-6 md:px-8 md:py-12">
        <h2 className="text-center text-3xl font-semibold">An error occured</h2>
        <p className="text-muted-foreground mx-auto w-full max-w-sm text-center text-sm">{verify.error}</p>
      </div>
    )
  }

  if (verify.data.accountId) {
    cookieStore.set({
      name: "access_token",
      value: verify.data.accessToken,
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    })
    redirect("/dashboard")
  } else {
    redirect("/onboarding")
  }
}
