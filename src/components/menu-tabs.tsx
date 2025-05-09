import { ComponentProps, ComponentType, createElement } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

interface TabsRootProps
  extends ComponentProps<typeof Tabs>,
    MixinProps<"list", ComponentProps<typeof TabsList>>,
    MixinProps<"trigger", ComponentProps<typeof TabsTrigger>>,
    MixinProps<"content", ComponentProps<typeof TabsContent>> {
  tabs: { label: string; value: string; component: ComponentType }[]
}

export const TabsRoot = ({ tabs, ...mixinProps }: TabsRootProps) => {
  const { list, trigger, content, rest } = splitProps(mixinProps, "list", "trigger", "content")

  return (
    <Tabs {...rest} className={cn("flex w-full flex-col items-center justify-center gap-2", rest.className)}>
      <TabsList
        {...list}
        className={cn("w-full rounded-none border-b-[2px] border-b-[#35383F] bg-inherit px-0", list.className)}
      >
        {tabs.map(({ value, label }) => (
          <TabsTrigger {...trigger} key={value} className={cn("w-full", trigger.className)} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, component }) => (
        <TabsContent
          {...content}
          key={value}
          className={cn("flex w-full items-center justify-center", content.className)}
          value={value}
        >
          {createElement(component)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
