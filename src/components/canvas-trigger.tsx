"use client"

import { ComponentProps } from "react"

import { useCanvas, CanvasState } from "@/context/canvas"
import { MixinProps, splitProps } from "@/lib/mixin"
import { Canvas, CanvasProps } from "@components/canvas"
import { Slot } from "@radix-ui/react-slot"

interface CanvasTriggerProps
  extends MixinProps<"trigger", Omit<ComponentProps<"button">, "onClick">>,
    MixinProps<"canvas", CanvasProps> {
  canvasOptions: Omit<CanvasState, "isOpen">
  canvasId: string
  asChild?: boolean
}

export const CanvasTrigger = ({ canvasOptions, canvasId, asChild = false, ...mixinProps }: CanvasTriggerProps) => {
  const { trigger, canvas } = splitProps(mixinProps, "trigger", "canvas", "elementId")
  const { openCanvas } = useCanvas()

  const TriggerComp = asChild ? Slot : "button"

  return (
    <>
      <TriggerComp className="cursor-pointer" onClick={() => openCanvas(canvasOptions)} {...trigger} />
      <Canvas {...canvas} id={canvasId} />
    </>
  )
}
