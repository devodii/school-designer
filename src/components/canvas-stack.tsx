"use client"

import { useCanvas } from "@/context/canvas"
import { useUrlState } from "@/hooks/use-url-state"
import { Canvas } from "@components/canvas"

export const CanvasStack = () => {
  const { canvases, closeCanvas } = useCanvas()
  const { remove } = useUrlState()

  return (
    <>
      {canvases.map((canvas, idx) => (
        <Canvas
          {...canvas}
          isTop={idx === canvases.length - 1}
          onClose={() => {
            console.log({ id: canvas.id })
            remove(["sid"])
            closeCanvas(canvas.id)
          }}
          key={canvas.id}
        />
      ))}
    </>
  )
}
