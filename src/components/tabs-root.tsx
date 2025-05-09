"use client"

import { ComponentProps, ComponentType, createElement } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MixinProps, splitProps } from "@/lib/mixin"

interface TabsRootProps
  extends ComponentProps<typeof Tabs>,
    MixinProps<"list", ComponentProps<typeof TabsList>>,
    MixinProps<"trigger", Omit<ComponentProps<typeof TabsTrigger>, "value">>,
    MixinProps<"content", Omit<ComponentProps<typeof TabsContent>, "value">> {
  data: { value: string; label: ComponentType; component: ComponentType }[]
}

export const TabsRoot = ({ data, ...mixinProps }: TabsRootProps) => {
  const { list, trigger, content, rest } = splitProps(mixinProps, "list", "trigger", "content")

  return (
    <Tabs defaultValue="account" {...rest}>
      <TabsList {...list}>
        {data.map(({ value, label }) => (
          <TabsTrigger key={value} {...trigger} value={value}>
            {createElement(label)}
          </TabsTrigger>
        ))}
      </TabsList>

      {data.map(({ value, component }) => (
        <TabsContent key={value} {...content} value={value}>
          {createElement(component)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
