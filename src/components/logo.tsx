import { ComponentProps } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface LogoProps extends MixinProps<"wrapper", ComponentProps<"div">>, MixinProps<"text", ComponentProps<"span">> {}

export const Logo = (mixinProps: LogoProps) => {
  const { wrapper, text } = splitProps(mixinProps, "wrapper", "text")

  return (
    <div
      {...wrapper}
      className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-black", wrapper.className)}
    >
      <span {...text} className={cn("font-display text-lg font-bold text-white", text.className)}>
        C
      </span>
    </div>
  )
}
