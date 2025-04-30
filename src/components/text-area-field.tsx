import React, { ComponentProps } from "react"

import { type LabelProps, Label } from "@/components/ui/label"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import { Textarea, TextareaProps } from "@components/ui/textarea"

interface TextareaFieldProps
  extends ComponentProps<"div">,
    MixinProps<"textarea", TextareaProps>,
    MixinProps<"label", Omit<LabelProps, "children">>,
    MixinProps<"error", Omit<ComponentProps<"span">, "children">> {
  labelText: string
  errorText?: string
}

export const TextareaField = ({ labelText, errorText, ...mixProps }: TextareaFieldProps) => {
  const { textarea, label, error, rest } = splitProps(mixProps, "textarea", "label", "error")

  return (
    <div {...rest} className={cn("flex w-full flex-col gap-2", rest.className)}>
      <Label className={cn("w-full flex-1", label.className)} {...label}>
        {labelText}
      </Label>
      <Textarea {...textarea} />
      {errorText && (
        <span {...error} className={cn("-mt-1 text-xs text-red-500", error.className)}>
          {errorText}
        </span>
      )}
    </div>
  )
}
