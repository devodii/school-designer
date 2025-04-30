import { ComponentProps } from "react"

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
    MixinProps<"trigger", ComponentProps<typeof DialogTrigger>>,
    MixinProps<"content", ComponentProps<typeof DialogContent>> {
  title: string
  description: string
}

export const DialogRoot = ({ title, description, ...mixProps }: DialogRootProps) => {
  const { trigger, content, rest } = splitProps(mixProps, "trigger", "content")

  return (
    <Dialog {...rest}>
      <DialogTrigger {...trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content.children}
      </DialogContent>
    </Dialog>
  )
}
