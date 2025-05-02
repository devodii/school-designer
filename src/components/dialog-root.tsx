"use client"

import { ComponentProps, ComponentType, createElement } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MixinProps, splitProps } from "@/lib/mixin"

interface DialogRootProps
  extends ComponentProps<typeof Dialog>,
    MixinProps<"title", ComponentProps<typeof DialogTitle>>,
    MixinProps<"description", ComponentProps<typeof DialogDescription>>,
    MixinProps<"trigger", ComponentProps<typeof DialogTrigger>>,
    MixinProps<"content", Omit<ComponentProps<typeof DialogContent>, "children">> {
  component: ComponentType
}

export const DialogRoot = ({ component, ...mixProps }: DialogRootProps) => {
  const { trigger, content, title, description, rest } = splitProps(
    mixProps,
    "trigger",
    "content",
    "title",
    "description",
  )

  return (
    <Dialog {...rest}>
      <DialogTrigger {...trigger} />
      <DialogContent {...content}>
        <DialogHeader className="flex w-full items-center">
          <DialogTitle {...title} />
          <DialogDescription {...description} />
        </DialogHeader>
        {createElement(component)}
      </DialogContent>
    </Dialog>
  )
}
