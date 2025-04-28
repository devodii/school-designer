"use client"

import { Spinner } from "@/components/spinner"

export default function VerifyTokenLoading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 px-4 py-6 md:px-8 md:py-12">
      <h2 className="text-center text-3xl font-semibold">Verifying your sign in</h2>

      <Spinner />
    </div>
  )
}
