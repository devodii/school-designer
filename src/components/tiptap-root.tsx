"use client"

import { ComponentType } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import { useEditor, EditorContent, EditorContentProps, UseEditorOptions, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

interface TiptapRootProps
  extends MixinProps<"params", Omit<UseEditorOptions, "extensions">>,
    MixinProps<"content", Omit<EditorContentProps, "editor">> {
  onChange: (value: string) => void
  groupedControls: Array<Array<ComponentType<{ editor: Editor }>>>
}

export const TiptapRoot = ({ onChange, groupedControls, ...mixinProps }: TiptapRootProps) => {
  const { content: contentProps, params } = splitProps(mixinProps, "params", "content")

  const editor = useEditor({
    ...params,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2], HTMLAttributes: { class: "font-bold" } },
        bulletList: { keepMarks: true, keepAttributes: false, HTMLAttributes: { class: "list-disc" } },
        orderedList: { keepMarks: true, keepAttributes: false, HTMLAttributes: { class: "list-decimal" } },
        code: { HTMLAttributes: { class: "bg-gray-100 p-2 rounded-md" } },
        italic: { HTMLAttributes: { class: "italic" } },
        bold: { HTMLAttributes: { class: "font-bold" } },
        strike: { HTMLAttributes: { class: "line-through" } },
      }),
      Placeholder.configure({ placeholder: "What's on your mind?", emptyEditorClass: "is-empty" }),
      Underline,
    ],
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  return (
    <div className="prose relative w-full">
      <div className="flex gap-2 border-b p-2">
        {editor &&
          groupedControls.map((group, index) => (
            <>
              <div key={index} className="flex gap-2">
                {group.map((Control, index) => (
                  <Control key={index} editor={editor} />
                ))}
                {index < groupedControls.length - 1 && <div className="mx-2 h-full w-px border-r" />}
              </div>
            </>
          ))}
      </div>

      <EditorContent
        {...contentProps}
        className={cn(
          "h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none [&_h1]:text-3xl [&_h2]:text-2xl",
          contentProps.className,
        )}
        editor={editor}
      />
    </div>
  )
}
