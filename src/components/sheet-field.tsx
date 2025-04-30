import { ComponentProps } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { Sheet, SheetContent, type SheetProps, SheetTrigger } from "@components/ui/sheet"

interface SheetFieldProps
  extends Omit<SheetProps, "children">,
    MixinProps<"trigger", ComponentProps<typeof SheetTrigger>>,
    MixinProps<"content", ComponentProps<typeof SheetContent>> {}

export const SheetField = (mixProps: SheetFieldProps) => {
  const { trigger, content, rest } = splitProps(mixProps, "trigger", "content")

  return (
    <Sheet {...rest}>
      <SheetTrigger {...trigger} />
      <SheetContent {...content} />
    </Sheet>
  )
}
