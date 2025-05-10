"use client"

import { useState } from "react"

import { createNote as createNoteAction, updateNote as updateNoteAction } from "@/actions/note"
import { getSession } from "@/actions/session"
import { Spinner } from "@/components/spinner"
import {
  BoldButton,
  BulletListButton,
  CodeButton,
  HeadingButton,
  ItalicButton,
  NumberedListButton,
  QuoteButton,
  StrikethroughButton,
  SubHeadingButton,
} from "@/components/tiptap-controls"
import { TiptapRoot } from "@/components/tiptap-root"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NoteSchema } from "@/db/schema/note"
import { useUrlState } from "@/hooks/use-url-state"
import { useMutation } from "@tanstack/react-query"
import { Book } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"

interface NoteEditorProps {
  notes: NoteSchema[]
}

export const NoteEditor = ({ notes }: NoteEditorProps) => {
  const { set } = useUrlState()
  const searchParams = useSearchParams()

  const selectedNote = notes.find(note => note.id === searchParams.get("id"))

  const { mutate: updateNote, isPending: isUpdating } = useMutation({
    mutationFn: async (dto: Pick<NoteSchema, "id" | "title" | "content">) => {
      const session = await getSession()

      if (!session) throw new Error("Unauthorized")

      if (!selectedNote) throw new Error("Invalid note")

      return updateNoteAction({ ...dto, id: selectedNote.id })
    },
    onError: error => toast.error(error.message),
  })

  const { mutate: createNote, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const session = await getSession()

      if (!session) throw new Error("Unauthorized")

      return createNoteAction({ title: "Untitled Note", content: "<h1>Title</h1>", accountId: session.accountId })
    },
    onSuccess: response => {
      if (!response) return
      set([{ name: "id", value: response.id }])
    },
  })

  const [editorTitle, setEditorTitle] = useState(selectedNote?.title)
  const [editorContent, setEditorContent] = useState(selectedNote?.content)

  useHotkeys(
    "mod+s",
    () => {
      if (!selectedNote) return
      updateNote({ id: selectedNote.id, title: editorTitle ?? "Untitled Note", content: editorContent ?? "" })
    },
    { enableOnContentEditable: true },
  )

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {selectedNote ? (
        <>
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between gap-2">
              <Input
                value={editorTitle}
                onChange={e => setEditorTitle(e.target.value)}
                className="flex-1 border-0 border-none px-0 text-lg font-medium shadow-none outline-none focus-visible:ring-0"
                placeholder="Note title"
              />

              {isUpdating ? <Spinner size={16} /> : <span className="text-muted-foreground text-xs">CTRL + S</span>}
            </div>
          </div>
          <div className="h-full flex-1 overflow-y-auto p-6">
            <TiptapRoot
              onChange={setEditorContent}
              groupedControls={[
                [HeadingButton, SubHeadingButton],
                [BoldButton, ItalicButton, StrikethroughButton, CodeButton],
                [BulletListButton, NumberedListButton, QuoteButton],
              ]}
              paramsContent={editorContent}
              contentClassName="h-[calc(100vh-15rem)] text-md"
            />
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Book className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="mb-2 text-xl font-medium">Select a note to view</h2>
          <p className="mb-6 max-w-md text-gray-500">
            Choose a note from the sidebar or create a new one to start taking notes
          </p>
          <Button onClick={() => createNote()} variant="default">
            <span className="text-sm font-semibold">Create New Note</span>
            {isCreating && <Spinner size={16} />}
          </Button>
        </div>
      )}
    </div>
  )
}
