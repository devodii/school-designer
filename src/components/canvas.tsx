"use client"

import { useRef } from "react"
import { useEffect, ComponentProps } from "react"

import { useCanvas } from "@/context/canvas"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import { ChevronsUp } from "lucide-react"

interface CanvasProps extends ComponentProps<"div">, MixinProps<"container", ComponentProps<"div">> {
  pushElementId: string
}

export const Canvas = ({ pushElementId, ...mixinProps }: CanvasProps) => {
  const { container, rest } = splitProps(mixinProps, "container")

  const {
    state: { isOpen, width, content, position },
    closeCanvas,
  } = useCanvas()

  const canvasRef = useRef<HTMLDivElement>(null)

  const pushElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    pushElementRef.current = document.getElementById(pushElementId)
  }, [pushElementId])

  useEffect(() => {
    const pushElement = pushElementRef.current

    if (pushElement) {
      pushElement.style.transition = "all 300ms ease-in-out"

      if (position === "right") {
        pushElement.style.marginRight = isOpen ? `${width}` : "0"
        pushElement.style.marginLeft = "0"
      } else {
        pushElement.style.marginLeft = isOpen ? `${width}` : "0"
        pushElement.style.marginRight = "0"
      }
    }
  }, [isOpen, width, position])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target as Node)) closeCanvas()
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCanvas()
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, closeCanvas])

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
              transform: isOpen ? "translateX(0)" : "translateX(100%)",
              borderLeft: "1px solid #e5e7eb",
              transformOrigin: "right",
            }
          : {
              left: 0,
              transform: isOpen ? "translateX(0)" : "translateX(-100%)",
              borderRight: "1px solid #e5e7eb",
              transformOrigin: "left",
            }),
        ...container?.style,
      }}
    >
      <header className="flex items-center gap-2 p-2">
        <ChevronsUp className="rotate-90 cursor-pointer text-black/60" onClick={closeCanvas} />
      </header>

      <div {...container} className={cn("h-[calc(100%-4rem)] overflow-y-auto p-4", container.className)}>
        {content}
      </div>
    </div>
  )
}
