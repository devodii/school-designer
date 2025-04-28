import { ComponentProps } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface SelectFieldProps
  extends ComponentProps<typeof Select>,
    MixinProps<"trigger", Omit<ComponentProps<typeof SelectTrigger>, "children">>,
    MixinProps<"error", Omit<ComponentProps<"span">, "children">> {
  items: { label: string; value: string }[]
  errorText?: string
}

export const SelectField = ({ items, errorText, ...mixProps }: SelectFieldProps) => {
  const { trigger, error, ...rest } = splitProps(mixProps, "trigger", "error")

  return (
    <Select {...rest.rest}>
      <SelectTrigger {...trigger}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map(({ label, value }, idx) => {
          return (
            <SelectItem key={idx} value={value}>
              {label}
            </SelectItem>
          )
        })}
      </SelectContent>

      {errorText && (
        <span {...error} className={cn("text-sm text-red-500", error.className)}>
          {errorText}
        </span>
      )}
    </Select>
  )
}
