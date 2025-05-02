"use client"

import { ComponentType, ComponentProps, createElement } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MixinProps, splitProps } from "@/lib/mixin"

interface TabsRootProps
  extends ComponentProps<typeof Tabs>,
    MixinProps<"list", typeof TabsList>,
    MixinProps<"trigger", typeof TabsTrigger>,
    MixinProps<"content", typeof TabsContent> {
  data: { value: string; label: string; component: ComponentType }[]
}

export const TabsRoot = ({ data, ...mixinProps }: TabsRootProps) => {
  const { list, trigger, content, rest } = splitProps(mixinProps, "list", "trigger", "content")

  return (
    <Tabs defaultValue="account" className="w-[400px]" {...rest}>
      <TabsList {...list}>
        {data.map(({ value, label }) => (
          <TabsTrigger value={value} {...trigger}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {data.map(({ value, component }) => (
        <TabsContent value={value} {...content}>
          {createElement(component)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
