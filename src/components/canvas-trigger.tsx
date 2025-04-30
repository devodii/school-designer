"use client"

import { ComponentProps } from "react"

import { useCanvas, CanvasState } from "@/context/canvas"
import { MixinProps, splitProps } from "@/lib/mixin"
import { Canvas } from "@components/canvas"

interface CanvasTriggerProps
  extends MixinProps<"trigger", Omit<ComponentProps<"button">, "onClick">>,
    MixinProps<"canvas", ComponentProps<typeof Canvas>> {
  canvasOptions: Omit<CanvasState, "isOpen">
}

export const CanvasTrigger = ({ canvasOptions, ...mixinProps }: CanvasTriggerProps) => {
  const { trigger, canvas } = splitProps(mixinProps, "trigger", "canvas", "elementId")
  const { openCanvas } = useCanvas()

  return (
    <>
      <button className="cursor-pointer" onClick={() => openCanvas(canvasOptions)} {...trigger} />
      <Canvas {...canvas} />
    </>
  )
}
