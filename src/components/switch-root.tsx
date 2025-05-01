"use client"

import { ComponentProps } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface SwitchRootProps
  extends ComponentProps<"div">,
    MixinProps<"label", Omit<ComponentProps<typeof Label>, "htmlFor" | "children">>,
    MixinProps<"switch", Omit<ComponentProps<typeof Switch>, "id">> {
  id: string
  labelText: string
}

export const SwitchRoot = ({ labelText, id, ...mixinProps }: SwitchRootProps) => {
  const { label, switch: switchProps, rest } = splitProps(mixinProps, "label", "switch")

  return (
    <div className={cn("flex items-center space-x-2", rest.className)} {...rest}>
      <Switch id={id} {...switchProps} />
      <Label className={cn("text-sm", label.className)} htmlFor={id} {...label}>
        {labelText}
      </Label>
    </div>
  )
}
