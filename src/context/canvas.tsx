import React, { createContext, useContext, useState } from "react"

import { CanvasWrapperProps } from "@/components/canvas"
import { parseElementContext } from "@/lib/parse-context"

export interface CanvasState extends CanvasWrapperProps {
  id: string
  width: string
  content: React.ReactNode
  position: "left" | "right"
  pushElementId: string
}

type CanvasContextType = {
  canvases: CanvasState[]
  openCanvas: (options: CanvasState) => void
  closeCanvas: (id?: string) => void
}

const CanvasContext = createContext({} as CanvasContextType)

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [canvases, setCanvases] = useState<CanvasState[]>([])

  const openCanvas = (options: CanvasState) => {
    setCanvases(prev => [...prev, options])
  }

  const closeCanvas = (id?: string) => {
    setCanvases(prev => (id ? prev.filter(canvas => canvas.id !== id) : prev.slice(0, -1)))
  }

  return <CanvasContext.Provider value={{ canvases, openCanvas, closeCanvas }}>{children}</CanvasContext.Provider>
}

export const useCanvas = () => parseElementContext(useContext(CanvasContext), "CanvasContext")
