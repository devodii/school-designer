"use client"

import { ComponentProps, useState } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { CommandRootProps, CommandRoot } from "@components/command-root"
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover"

interface ComboboxProps
  extends MixinProps<"trigger", ComponentProps<typeof PopoverTrigger>>,
    MixinProps<"content", Omit<ComponentProps<typeof PopoverContent>, "children">>,
    MixinProps<"command", CommandRootProps> {
  selected: { label: string; value: string }[]
}

export const Combobox = ({ selected, ...mixedProps }: ComboboxProps) => {
  const [open, setOpen] = useState(false)

  const { trigger, content, command } = splitProps(mixedProps, "trigger", "content", "command")

  const filteredOptions = command.options.map(group => ({
    ...group,
    items: group.items.filter(item => !selected.some(s => s.value === item.value)),
  }))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger {...trigger} />
      <PopoverContent {...content}>
        <CommandRoot
          {...command}
          options={filteredOptions}
          optionOnSelect={currentValue => {
            setOpen(false)
            command.optionOnSelect?.(currentValue)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
