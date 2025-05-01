import { ComponentProps } from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MixinProps, splitProps } from "@/lib/mixin"

interface PopoverRootProps
  extends ComponentProps<typeof Popover>,
    MixinProps<"trigger", ComponentProps<typeof PopoverTrigger>>,
    MixinProps<"content", ComponentProps<typeof PopoverContent>> {}

export const PopoverRoot = (mixProps: PopoverRootProps) => {
  const { trigger, content, rest } = splitProps(mixProps, "trigger", "content")

  return (
    <Popover {...rest}>
      <PopoverTrigger {...trigger} />
      <PopoverContent {...content} />
    </Popover>
  )
}
