import { ComponentProps } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MixinProps, splitProps } from "@/lib/mixin"

interface SelectFieldProps
  extends ComponentProps<typeof Select>,
    MixinProps<"trigger", Omit<ComponentProps<typeof SelectTrigger>, "children">> {
  items: { label: string; value: string }[]
}

export const SelectField = ({ items, ...mixProps }: SelectFieldProps) => {
  const { trigger, ...rest } = splitProps(mixProps, "trigger")

  return (
    <Select {...rest}>
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
    </Select>
  )
}
