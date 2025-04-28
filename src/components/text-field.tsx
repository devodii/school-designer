import React, { ComponentProps } from "react"

import { Input, type InputProps } from "@/components/ui/input"
import { type LabelProps, Label } from "@/components/ui/label"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface TextFieldProps
  extends ComponentProps<"div">,
    MixinProps<"input", InputProps>,
    MixinProps<"label", Omit<LabelProps, "children">>,
    MixinProps<"error", Omit<ComponentProps<"span">, "children">> {
  labelText: string
  errorText?: string
}

export const TextField = ({ labelText, errorText, ...mixProps }: TextFieldProps) => {
  const { input, label, error, ...rest } = splitProps(mixProps, "input", "label", "error")

  return (
    <div className={cn("flex w-full flex-col gap-2", rest.rest.className)} {...rest}>
      <Label className={cn("w-full flex-1", label.className)} {...label}>
        {labelText}
      </Label>
      <Input {...input} />
      {errorText && (
        <span {...error} className={cn("-mt-1 text-xs text-red-500", error.className)}>
          {errorText}
        </span>
      )}
    </div>
  )
}
