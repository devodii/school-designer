"use client"

import { Button } from "@/components/ui/button"
import { Editor } from "@tiptap/react"
import { Bold, Code, Italic, List, ListOrdered, Strikethrough } from "lucide-react"

interface TiptapControlProps {
  editor: Editor
}

export const HeadingButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("heading", { level: 1 }) ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      <span className="text-sm font-semibold">H1</span>
    </Button>
  )
}

export const SubHeadingButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("heading", { level: 2 }) ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <span className="text-sm font-semibold">H2</span>
    </Button>
  )
}

export const BoldButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("bold") ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleBold().run()}
    >
      <Bold className="size-4" />
    </Button>
  )
}

export const ItalicButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("italic") ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleItalic().run()}
    >
      <Italic className="size-4" />
    </Button>
  )
}

export const StrikethroughButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("strike") ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleStrike().run()}
    >
      <Strikethrough className="size-4" />
    </Button>
  )
}

export const CodeButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("code") ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleCode().run()}
    >
      <Code className="size-4" />
    </Button>
  )
}

export const BulletListButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("bulletList") ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleBulletList().run()}
    >
      <List className="size-4" />
    </Button>
  )
}

export const NumberedListButton = ({ editor }: TiptapControlProps) => {
  return (
    <Button
      variant={editor?.isActive("orderedList") ? "default" : "outline"}
      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
    >
      <ListOrdered className="size-4" />
    </Button>
  )
}
