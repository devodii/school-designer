"use client"

import { useRef } from "react"
import { useEffect, ComponentProps } from "react"

import { useCanvas } from "@/context/canvas"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

export interface CanvasProps extends ComponentProps<"div">, MixinProps<"container", ComponentProps<"div">> {
  id: string
  pushElementId: string
}

export const Canvas = ({ pushElementId, id, ...mixinProps }: CanvasProps) => {
  const { container, rest } = splitProps(mixinProps, "container")

  const {
    state: { isOpen, width, content, position },
    closeCanvas,
    activeCanvasId,
  } = useCanvas()

  const isActive = !activeCanvasId || activeCanvasId === id
  const shouldShow = isOpen && isActive

  const canvasRef = useRef<HTMLDivElement>(null)

  const pushElementRef = useRef<HTMLElement | null>(null)

  const handleClose = () => {
    const pushElement = document.getElementById(pushElementId)
    if (pushElement) {
      pushElement.style.transition = "all 300ms ease-in-out"
      pushElement.style.marginRight = "0"
      pushElement.style.marginLeft = "0"
    }
    console.log("closing canvas", id)
    closeCanvas(id)
  }

  useEffect(() => {
    pushElementRef.current = document.getElementById(pushElementId)
  }, [pushElementId])

  useEffect(() => {
    const pushElement = pushElementRef.current

    if (pushElement && shouldShow) {
      pushElement.style.transition = "all 300ms ease-in-out"

      if (position === "right") {
        console.log("pushing elements..")
        pushElement.style.marginRight = `${width}`
        pushElement.style.marginLeft = "0"
      } else {
        pushElement.style.marginLeft = `${width}`
        pushElement.style.marginRight = "0"
      }
    }
  }, [shouldShow, width, position, isOpen, pushElementId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target as Node)) handleClose()
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose()
    }

    if (shouldShow) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [shouldShow, closeCanvas])

  return (
    <div
      {...rest}
      ref={canvasRef}
      className={cn(
        "fixed top-0 h-full transform rounded-ss-xl rounded-es-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out",
        rest.className,
      )}
      style={{
        width,
        ...(position === "right"
          ? {
              right: 0,
              transform: shouldShow ? "translateX(0)" : "translateX(100%)",
              borderLeft: "1px solid #e5e7eb",
              transformOrigin: "right",
            }
          : {
              left: 0,
              transform: shouldShow ? "translateX(0)" : "translateX(-100%)",
              borderRight: "1px solid #e5e7eb",
              transformOrigin: "left",
            }),
        ...container?.style,
      }}
    >
      <div {...container} className={cn("h-[calc(100%-4rem)] overflow-y-auto p-4", container.className)}>
        {content}
      </div>
    </div>
  )
}
