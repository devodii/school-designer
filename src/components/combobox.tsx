import { ComponentProps, useState } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { CommandRootProps, CommandRoot } from "@components/command-root"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"

interface ComboboxProps
  extends MixinProps<"trigger", ComponentProps<typeof PopoverTrigger>>,
    MixinProps<"content", ComponentProps<typeof PopoverContent>>,
    MixinProps<"command", CommandRootProps> {
  options: { value: string; label: string }[]
  onSelect: (value: string) => void
}

export const Combobox = ({ options, onSelect, ...mixedProps }: ComboboxProps) => {
  const [open, setOpen] = useState(false)

  const { trigger, content, command } = splitProps(mixedProps, "trigger", "content", "command")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger {...trigger} />
      <PopoverContent {...content}>
        <CommandRoot
          {...command}
          optionOnSelect={currentValue => {
            setOpen(false)
            onSelect(currentValue)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
