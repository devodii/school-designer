"use client"

import { useCanvas } from "@/context/canvas"
import { Canvas } from "@components/canvas"

export const CanvasStack = () => {
  const { canvases, closeCanvas,  } = useCanvas()
  return (
    <>
      {canvases.map((canvas, idx) => (
        <Canvas {...canvas} isTop={idx === canvases.length - 1} onClose={() => closeCanvas(canvas.id)} />
      ))}
    </>
  )
}
