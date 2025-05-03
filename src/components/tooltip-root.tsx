"use client"

import { ComponentProps } from "react"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MixinProps, splitProps } from "@/lib/mixin"

interface TooltipRootProps
  extends ComponentProps<typeof Tooltip>,
    MixinProps<"trigger", ComponentProps<typeof TooltipTrigger>>,
    MixinProps<"content", ComponentProps<typeof TooltipContent>> {}

export const TooltipRoot = (mixinProps: TooltipRootProps) => {
  const { trigger, content, ...props } = splitProps(mixinProps, "trigger", "content")

  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger {...trigger} />
        <TooltipContent {...content} />
      </Tooltip>
    </TooltipProvider>
  )
}
