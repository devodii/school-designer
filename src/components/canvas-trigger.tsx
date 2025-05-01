"use client"

import { ComponentProps } from "react"

import { useCanvas, CanvasState } from "@/context/canvas"
import { MixinProps, splitProps } from "@/lib/mixin"
import { Canvas, CanvasProps } from "@components/canvas"

interface CanvasTriggerProps
  extends MixinProps<"trigger", Omit<ComponentProps<"button">, "onClick">>,
    MixinProps<"canvas", CanvasProps> {
  canvasOptions: Omit<CanvasState, "isOpen">
  canvasId: string
}

export const CanvasTrigger = ({ canvasOptions, canvasId, ...mixinProps }: CanvasTriggerProps) => {
  const { trigger, canvas } = splitProps(mixinProps, "trigger", "canvas", "elementId")
  const { openCanvas } = useCanvas()

  return (
    <>
      <button className="cursor-pointer" onClick={() => openCanvas(canvasOptions)} {...trigger} />
      <Canvas {...canvas} id={canvasId} />
    </>
  )
}
