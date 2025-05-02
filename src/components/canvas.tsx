"use client"

import { useRef, useEffect, ComponentProps, useState } from "react"

import { useCanvas } from "@/context/canvas"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

export interface CanvasWrapperProps extends MixinProps<"wrapper", ComponentProps<"div">> {}
export interface CanvasProps extends Omit<ComponentProps<"div">, "content">, CanvasWrapperProps {
  id: string
  pushElementId: string
  isTop?: boolean
  onClose?: () => void
  width: string
  position: "left" | "right"
  content: React.ReactNode
}

export const Canvas = ({
  pushElementId,
  id,
  isTop = true,
  onClose,
  width,
  position,
  content,
  ...mixinProps
}: CanvasProps) => {
  const { wrapper, rest } = splitProps(mixinProps, "wrapper")
  const canvasRef = useRef<HTMLDivElement>(null)
  const pushElementRef = useRef<HTMLElement | null>(null)
  const { canvases } = useCanvas()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) {
      setTimeout(() => setMounted(true), 50) // Small delay to ensure initial state renders
    }
  }, [])

  // Set up push element margin
  useEffect(() => {
    pushElementRef.current = document.getElementById(pushElementId)
  }, [pushElementId])

  useEffect(() => {
    const pushElement = pushElementRef.current
    if (pushElement) {
      pushElement.style.transition = "all 300ms ease-in-out"

      if (position === "right") {
        pushElement.style.marginRight = width
        pushElement.style.marginLeft = "0"
      } else {
        pushElement.style.marginLeft = width
        pushElement.style.marginRight = "0"
      }
    }
    return () => {
      if (pushElement) {
        if (canvases.length === 1) {
          pushElement.style.marginRight = "0"
          pushElement.style.marginLeft = "0"
        }
      }
    }
  }, [pushElementId])

  // Only the topmost canvas should handle outside click/escape
  useEffect(() => {
    if (!isTop) return

    const handleClickOutside = (event: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target as Node)) {
        onClose?.()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.()
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isTop, onClose])

  return (
    <div
      {...rest}
      ref={canvasRef}
      className={cn(
        "fixed top-0 z-[1000] h-full rounded-ss-xl rounded-es-xl border border-gray-200 bg-white shadow-lg",
        rest.className,
      )}
      style={{
        width,
        ...(position === "right"
          ? {
              right: 0,
              transform: !mounted || !isTop ? "translateX(100%)" : "translateX(0)",
              borderLeft: "1px solid #e5e7eb",
              transformOrigin: "right",
              transition: "transform 300ms ease-in-out",
            }
          : {
              left: 0,
              transform: !mounted || !isTop ? "translateX(-100%)" : "translateX(0)",
              borderRight: "1px solid #e5e7eb",
              transformOrigin: "left",
              transition: "transform 300ms ease-in-out",
            }),
      }}
    >
      <div {...wrapper} className={cn("h-[calc(100%-4rem)] overflow-y-auto p-4", wrapper.className)}>
        {content}
      </div>
    </div>
  )
}
