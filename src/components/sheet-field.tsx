import { ComponentProps } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  type SheetProps,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet"

interface SheetFieldProps
  extends Omit<SheetProps, "children">,
    MixinProps<"trigger", ComponentProps<typeof SheetTrigger>>,
    MixinProps<"content", ComponentProps<typeof SheetContent>>,
    MixinProps<"title", ComponentProps<typeof SheetTitle>>,
    MixinProps<"description", ComponentProps<typeof SheetDescription>> {}

export const SheetField = ({ ...mixProps }: SheetFieldProps) => {
  const { trigger, content, title, description, rest } = splitProps(
    mixProps,
    "trigger",
    "content",
    "title",
    "description",
  )

  return (
    <Sheet {...rest}>
      <SheetTrigger {...trigger} />
      <SheetContent className={content.className}>
        <SheetHeader className="p-0">
          <SheetTitle {...title} />
          <SheetDescription {...description} />
        </SheetHeader>
        {content.children}
      </SheetContent>
    </Sheet>
  )
}
