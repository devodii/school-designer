"use client"

import { createContext, ReactNode, useContext, useState } from "react"

import { parseElementContext } from "@/lib/parse-context"

type CanvasPosition = "left" | "right"

export type CanvasState = {
  isOpen: boolean
  width: string
  content: ReactNode | null
  position: CanvasPosition
}

type CanvasContextType = {
  state: CanvasState
  openCanvas: (options: Partial<Omit<CanvasState, "isOpen">>) => void
  closeCanvas: () => void
}

export const CanvasContext = createContext({} as CanvasContextType)

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CanvasState>({ isOpen: false, width: "300px", content: null, position: "right" })

  const openCanvas = (options: Partial<Omit<CanvasState, "isOpen">>) => {
    setState(prev => ({ ...prev, isOpen: true, ...options }))
  }

  const closeCanvas = () => {
    setState(prev => ({ ...prev, isOpen: false }))
  }

  return <CanvasContext.Provider value={{ state, openCanvas, closeCanvas }}>{children}</CanvasContext.Provider>
}

export const useCanvas = () => parseElementContext(useContext(CanvasContext), "Canvas")
