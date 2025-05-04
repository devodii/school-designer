import { useEffect, useRef } from "react"

import { ChatMessageTag } from "@/interfaces/chat"

type Tag = {
  id: string
  tag: ChatMessageTag
  description: string
  example: string
}

const tags: Tag[] = [
  {
    id: "recommendation",
    tag: "@Recommendation",
    description: "Ask for recommendations for a topic",
    example: "@Recommendation mathematics",
  },
  {
    id: "explain",
    tag: "@Explain",
    description: "Get detailed explanation about a topic",
    example: "@Explain linear algebra",
  },
  {
    id: "summarize",
    tag: "@Summarize",
    description: "Summarize text or notes",
    example: "@Summarize my notes",
  },
  {
    id: "quiz",
    tag: "@Quiz",
    description: "Generate quiz questions",
    example: "@Quiz biology chapter 5",
  },
]

interface ChatTagPickerProps {
  onSelect: (tag: ChatMessageTag) => void
  onClose: () => void
}

export const ChatTagPicker = ({ onSelect, onClose }: ChatTagPickerProps) => {
  const tagPickerRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement && !tagPickerRef.current?.contains(event.target)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [onClose, handleClickOutside])

  return (
    <div
      ref={tagPickerRef}
      className="absolute right-4 bottom-16 left-8 z-10 max-h-60 max-w-[300px] rounded-lg border bg-white p-2 shadow-lg"
    >
      <div className="overflow-y-auto">
        {tags.map(tag => (
          <button
            key={tag.id}
            className="flex w-full cursor-pointer flex-col rounded p-2 text-left hover:bg-gray-100"
            onClick={() => onSelect(tag.tag)}
          >
            <div className="flex items-center">
              <b className="w-full text-sm font-medium">{tag.tag}</b>
            </div>
            <span className="w-full text-xs text-gray-500">{tag.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
