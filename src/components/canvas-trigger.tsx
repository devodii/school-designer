"use client"

import { ComponentProps } from "react"

import { useCanvas, CanvasState } from "@/context/canvas"
import { MixinProps, splitProps } from "@/lib/mixin"
import { Slot } from "@radix-ui/react-slot"

interface CanvasTriggerProps extends MixinProps<"trigger", Omit<ComponentProps<"button">, "onClick">> {
  canvasOptions: Omit<CanvasState, "isOpen">
  canvasId: string
  triggerAsChild?: boolean
}

export const CanvasTrigger = ({
  canvasOptions,
  canvasId,
  triggerAsChild = false,
  ...mixinProps
}: CanvasTriggerProps) => {
  const { trigger } = splitProps(mixinProps, "trigger")
  const { openCanvas } = useCanvas()

  const TriggerComp = triggerAsChild ? Slot : "button"

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    openCanvas({ ...canvasOptions, id: canvasId })
  }

  return <TriggerComp className="cursor-pointer" onClick={handleOpen} {...trigger} />
}
