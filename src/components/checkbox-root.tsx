"use client"

import { ComponentProps } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import { Checkbox } from "@components/ui/checkbox"
import { Label } from "@components/ui/label"

interface CheckboxRootProps
  extends ComponentProps<"div">,
    MixinProps<"label", Omit<ComponentProps<typeof Label>, "htmlFor" | "children">>,
    MixinProps<"checkbox", Omit<ComponentProps<typeof Checkbox>, "id">> {
  id: string
  labelText: string
}

export const CheckboxRoot = ({ id, labelText, ...mixinProps }: CheckboxRootProps) => {
  const { label, checkbox, rest } = splitProps(mixinProps, "label", "checkbox")

  return (
    <div className="flex items-center space-x-2" {...rest}>
      <Checkbox id={id} {...checkbox} />
      <Label
        htmlFor={id}
        className={cn(
          "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          label.className,
        )}
      >
        {labelText}
      </Label>
    </div>
  )
}
