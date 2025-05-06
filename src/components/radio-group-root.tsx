import { ComponentProps, ComponentType, createElement } from "react"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface RadioGroupRootProps
  extends React.ComponentProps<typeof RadioGroup>,
    MixinProps<"optionContainer", ComponentProps<"div">>,
    MixinProps<"option", Omit<ComponentProps<typeof RadioGroupItem>, "value" | "id">>,
    MixinProps<"label", ComponentProps<typeof Label>>,
    MixinProps<"error", ComponentProps<"div">> {
  data: { value: string; label: string; icon?: ComponentType; id: string }[]
  errorText?: string
}

export const RadioGroupRoot = ({ data, errorText, ...mixProps }: RadioGroupRootProps) => {
  const { option, label, optionContainer, error, rest } = splitProps(
    mixProps,
    "option",
    "label",
    "optionContainer",
    "error",
  )

  return (
    <RadioGroup {...rest} className={cn("grid gap-1", rest.className)}>
      {data.map(({ value, label: labelText, id, icon }) => (
        <div {...optionContainer} key={value} className={cn("flex items-center space-x-2", optionContainer?.className)}>
          <RadioGroupItem {...option} value={value} id={id} key={id} />
          <Label {...label} className="text-md" htmlFor={id}>
            {labelText}
            {icon && createElement(icon)}
          </Label>
        </div>
      ))}
      {errorText && (
        <p {...error} className={cn("text-xs text-red-500", error?.className)}>
          {errorText}
        </p>
      )}
    </RadioGroup>
  )
}
