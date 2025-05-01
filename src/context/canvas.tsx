"use client"

import { createContext, ReactNode, useContext, useState } from "react"

import { parseElementContext } from "@/lib/parse-context"

type CanvasPosition = "left" | "right"

export type CanvasState = {
  id: string
  isOpen: boolean
  width: string
  content: ReactNode | null
  position: CanvasPosition
}

type CanvasContextType = {
  state: CanvasState
  openCanvas: (options: Omit<CanvasState, "isOpen">) => void
  closeCanvas: (id?: string) => void
  activeCanvasId: string | null
}

export const CanvasContext = createContext({} as CanvasContextType)

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CanvasState>({
    isOpen: false,
    id: "",
    width: "300px",
    content: null,
    position: "right",
  })
  const [activeCanvasId, setActiveCanvasId] = useState<string | null>(null)

  const openCanvas = (options: Omit<CanvasState, "isOpen">) => {
    setState(prev => ({ ...prev, ...options, isOpen: true }))
    setActiveCanvasId(options.id)
  }

  const closeCanvas = (id?: string) => {
    // Only close if no id provided or if it matches the active canvas
    if (!id || id === activeCanvasId) {
      setState(prev => ({ ...prev, isOpen: false }))
      setActiveCanvasId(null)
    }
  }

  return (
    <CanvasContext.Provider value={{ state, openCanvas, closeCanvas, activeCanvasId }}>
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvas = () => parseElementContext(useContext(CanvasContext), "Canvas")
