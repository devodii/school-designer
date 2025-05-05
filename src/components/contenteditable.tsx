import React, { ComponentProps, useRef, useState, useImperativeHandle, forwardRef } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"

export interface ContentEditableProps
  extends ComponentProps<"div">,
    MixinProps<"placeholder", Omit<ComponentProps<"span">, "children">> {
  onSend: (content: string) => void
  placeholderText: string
  createCustomElement?: (data: any) => HTMLElement
}

export interface ContentEditableRef {
  insertCustomElement: (data: any) => void
}

export const ContentEditable = forwardRef<ContentEditableRef, ContentEditableProps>(
  ({ onSend, placeholderText = "Type your message...", createCustomElement, ...mixinProps }, ref) => {
    const { placeholder, rest } = splitProps(mixinProps, "placeholder")

    const divRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    // Helper to get plain text content
    const getContent = () => divRef.current?.innerText || ""

    // Handle sending message
    const handleSend = () => {
      const content = getContent().trim()
      if (content) {
        onSend(content)
        if (divRef.current) divRef.current.innerHTML = ""
      }
    }

    // Handle key events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          handleSend()
        }
      }
    }

    // Insert a custom element at the cursor position
    const insertCustomElement = (data: any) => {
      if (!divRef.current || !createCustomElement) return
      const el = createCustomElement(data)
      let node: Node
      if (React.isValidElement(el)) return
      else node = el as Node

      // Insert at caret position
      const sel = window.getSelection()
      if (!sel || !sel.rangeCount) {
        divRef.current.appendChild(node)
        return
      }
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(node)
      // Move caret after inserted node
      range.setStartAfter(node)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      divRef.current.focus()
    }

    // Expose the insertCustomElement method to parent via ref
    useImperativeHandle(ref, () => ({ insertCustomElement }))

    return (
      <div
        {...rest}
        className={cn(
          "focus-within:ring-ring/50 border-input focus-within:border-ring relative flex w-full flex-col rounded-md border focus-within:ring-2",
          rest.className,
        )}
      >
        <div
          ref={divRef}
          className={cn("flex-1 overflow-y-auto px-2 py-2 outline-none", rest.className)}
          contentEditable
          data-placeholder={placeholderText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          style={{ whiteSpace: "pre-wrap" }}
          suppressContentEditableWarning
        />
        {/* Placeholder styling */}
        {!isFocused && !getContent() && (
          <span
            {...placeholder}
            className={cn(
              "text-muted-foreground pointer-events-none absolute top-3 left-3 select-none",
              placeholder.className,
            )}
          >
            {placeholderText}
          </span>
        )}
      </div>
    )
  },
)
ContentEditable.displayName = "ContentEditable"
