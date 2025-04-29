import { ComponentProps } from "react"

import { Label, LabelProps } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface SelectFieldProps
  extends ComponentProps<typeof Select>,
    MixinProps<"trigger", Omit<ComponentProps<typeof SelectTrigger>, "children">>,
    MixinProps<"error", Omit<ComponentProps<"span">, "children">>,
    MixinProps<"label", LabelProps> {
  items: { label: string; value: string }[]
  errorText?: string
  labelText?: string
}

export const SelectField = ({ items, labelText, errorText, ...mixProps }: SelectFieldProps) => {
  const { trigger, error, label, ...rest } = splitProps(mixProps, "trigger", "error", "label")

  return (
    <div className="flex flex-col gap-2">
      {label && <Label className="mb-0 w-full" {...label}>{labelText}</Label>}

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
    </div>
  )
}
