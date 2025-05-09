"use client"

import { ComponentProps } from "react"

import { CommandRoot, CommandRootProps } from "@/components/command-root"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MixinProps, splitProps } from "@/lib/mixin"

interface ComboboxProps
  extends Omit<ComponentProps<typeof Popover>, "children">,
    MixinProps<"trigger", ComponentProps<typeof PopoverTrigger>>,
    MixinProps<"content", Omit<ComponentProps<typeof PopoverContent>, "children">>,
    MixinProps<"command", CommandRootProps> {}

export const Combobox = (mixinProps: ComboboxProps) => {
  const { trigger, content, command, rest } = splitProps(mixinProps, "trigger", "content", "command")

  return (
    <Popover {...rest}>
      <PopoverTrigger {...trigger} />
      <PopoverContent {...content}>
        <CommandRoot {...command} />
      </PopoverContent>
    </Popover>
  )
}
