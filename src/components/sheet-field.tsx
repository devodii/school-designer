import { ComponentProps } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"

import { Sheet, SheetContent, type SheetProps, SheetTrigger } from "./ui/sheet"

interface SheetFieldProps
  extends Omit<SheetProps, "children">,
    MixinProps<"trigger", ComponentProps<typeof SheetTrigger>>,
    MixinProps<"content", ComponentProps<typeof SheetContent>> {}

export const SheetField = (mixProps: SheetFieldProps) => {
  const { trigger, content, ...props } = splitProps(mixProps, "trigger", "content")

  return (
    <Sheet {...props}>
      <SheetTrigger {...trigger} />
      <SheetContent {...content} />
    </Sheet>
  )
}
