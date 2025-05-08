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
      StarterKit,
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
          "h-full [&_.ProseMirror]:h-full [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none [&_b]:font-bold [&_code]:rounded-md [&_code]:bg-gray-100 [&_code]:p-2 [&_h1]:text-3xl [&_h2]:text-2xl [&_i]:italic [&_ol]:list-decimal [&_ol]:pl-4 [&_s]:line-through [&_ul]:list-disc [&_ul]:pl-4",
          contentProps.className,
        )}
        editor={editor}
      />
    </div>
  )
}
