import { ComponentProps } from "react"

import { Input, type InputProps } from "@/components/ui/input"
import { Label, type LabelProps } from "@/components/ui/label"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface TextFieldProps
  extends ComponentProps<"div">,
    MixinProps<"input", InputProps>,
    MixinProps<"label", Omit<LabelProps, "children" | "htmlFor">>,
    MixinProps<"error", Omit<ComponentProps<"span">, "children">> {
  id: string
  labelText: string
  errorText?: string
}

export const TextField = ({ labelText, id, errorText, ...mixProps }: TextFieldProps) => {
  const { input, label, error, rest } = splitProps(mixProps, "input", "label", "error")

  return (
    <div {...rest} className={cn("flex w-full flex-col gap-2", rest.className)}>
      <Label {...label} htmlFor={id} className={cn("w-full flex-1", label.className)}>
        {labelText}
      </Label>
      <Input {...input} id={id} />
      {errorText && (
        <span {...error} className={cn("-mt-1 text-xs text-red-500", error.className)}>
          {errorText}
        </span>
      )}
    </div>
  )
}
