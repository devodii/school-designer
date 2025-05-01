import { ComponentProps } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { MixinProps, splitProps } from "@/lib/mixin"

export interface CommandRootProps
  extends ComponentProps<typeof Command>,
    MixinProps<"input", ComponentProps<typeof CommandInput>>,
    MixinProps<"list", ComponentProps<typeof CommandList>>,
    MixinProps<"empty", ComponentProps<typeof CommandEmpty>>,
    MixinProps<"group", ComponentProps<typeof CommandGroup>>,
    MixinProps<"separator", ComponentProps<typeof CommandSeparator>>,
    MixinProps<"shortcut", ComponentProps<typeof CommandShortcut>>,
    MixinProps<"option", ComponentProps<typeof CommandItem>> {
  options: { heading: string; items: { label: string; value: string }[] }[]
}

export const CommandRoot = ({ options, ...mixProps }: CommandRootProps) => {
  const { input, list, empty, group, separator, option, rest } = splitProps(
    mixProps,
    "input",
    "list",
    "empty",
    "group",
    "separator",
    "shortcut",
    "option",
  )

  return (
    <Command {...rest}>
      <CommandInput {...input} />
      <CommandList {...list}>
        <CommandEmpty {...empty} />
        {options.map((option, index) => (
          <>
            <CommandGroup {...group} heading={option.heading}>
              {option.items.map(({ label, value }) => (
                <CommandItem key={value} value={value} {...option}>
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
            {index < options.length - 1 && <CommandSeparator {...separator} />}
          </>
        ))}
      </CommandList>
    </Command>
  )
}
