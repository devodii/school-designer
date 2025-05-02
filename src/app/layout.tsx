import { CanvasStack } from "@/components/canvas-stack"
import { Wrapper } from "@/components/wrapper"
import { quicksand } from "@/fonts/quick-sand"
import { cn } from "@/lib/tw-merge"
import { Providers } from "@/providers"
import type { Metadata } from "next"
import { Toaster } from "sonner"

import "./globals.css"

export const metadata: Metadata = {
  title: "School Designer",
  description: "Design your school life",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("font-quicksand antialiased", quicksand.className)}>
        <Providers>
          <Toaster />
          <Wrapper>{children}</Wrapper>
          <CanvasStack />
        </Providers>
      </body>
    </html>
  )
}
