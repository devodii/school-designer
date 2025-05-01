import React from "react"

type TagPickerProps = {
  onSelect: (tag: string) => void
  onClose: () => void
}

const tags = [
  {
    id: "insight",
    tag: "@Insight",
    description: "Get information about a student",
    example: "@Insight username",
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

export const TagPicker: React.FC<TagPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute right-4 bottom-20 left-4 z-10 rounded-lg border bg-white p-2 shadow-lg">
      <div className="mb-2 border-b pb-2 text-sm font-medium">Insert a tag</div>
      <div className="max-h-60 overflow-y-auto">
        {tags.map(tag => (
          <button
            key={tag.id}
            className="flex w-full flex-col rounded p-2 text-left hover:bg-gray-100"
            onClick={() => onSelect(tag.tag)}
          >
            <div className="flex items-center">
              <span className="font-medium text-black">{tag.tag}</span>
            </div>
            <span className="text-xs text-gray-500">{tag.description}</span>
            <span className="mt-1 text-xs text-gray-400 italic">Example: {tag.example}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
