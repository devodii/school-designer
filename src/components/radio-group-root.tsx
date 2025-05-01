import { ComponentProps } from "react"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface RadioGroupRootProps
  extends React.ComponentProps<typeof RadioGroup>,
    MixinProps<"optionContainer", ComponentProps<"div">>,
    MixinProps<"option", Omit<ComponentProps<typeof RadioGroupItem>, "value" | "id">>,
    MixinProps<"label", ComponentProps<typeof Label>> {
  data: { value: string; label: string }[]
}

export const RadioGroupRoot = ({ data, ...mixProps }: RadioGroupRootProps) => {
  const { option, label, optionContainer, rest } = splitProps(mixProps, "option", "label", "optionContainer")

  return (
    <RadioGroup {...rest} className={cn("grid gap-1", rest.className)}>
      {data.map(({ value, label: labelText }, index) => (
        <div {...optionContainer} key={index} className={cn("flex items-center space-x-2", optionContainer?.className)}>
          <RadioGroupItem {...option} value={value} id={value} />
          <Label {...label} className="text-md" htmlFor={value}>
            {labelText}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
