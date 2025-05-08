"use client"

import { createNote as createNoteAction } from "@/actions/note"
import { getSession } from "@/actions/session"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NoteSchema } from "@/db/schema/note"
import { useUrlState } from "@/hooks/use-url-state"
import { cn } from "@/lib/tw-merge"
import { useMutation } from "@tanstack/react-query"
import { lowerCase } from "lodash"
import { Book, Plus, Search } from "lucide-react"
import moment from "moment"
import { useSearchParams } from "next/navigation"

interface NoteSidebarProps {
  notes: NoteSchema[]
}

export const NoteSidebar = ({ notes }: NoteSidebarProps) => {
  const { set, remove } = useUrlState()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get("q")

  const handleNoteSelect = (note: NoteSchema) => {
    set([{ name: "id", value: note.id }])
  }

  const { mutate: createNote, isPending } = useMutation({
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

  const filteredNotes = notes.filter(
    note =>
      lowerCase(note.title).includes(lowerCase(searchQuery ?? "")) ||
      lowerCase(note.content).includes(lowerCase(searchQuery ?? "")),
  )

  const selectedNote = notes.find(note => note.id === searchParams.get("id"))

  return (
    <div className="flex w-80 flex-col overflow-hidden border-r border-gray-200">
      <div className="border-b p-4">
        <div className="mb-4 flex items-center gap-2">
          <Book className="h-5 w-5 text-gray-600" />
          <h2 className="font-semibold">My Notes</h2>
        </div>

        <div className="relative mb-4">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notes..."
            className="pl-9"
            value={searchQuery ?? ""}
            onChange={e => set([{ name: "q", value: e.target.value }])}
          />
        </div>

        <Button onClick={() => createNote()} className="flex w-full items-center gap-2">
          <Plus className="size-4" />
          <span className="text-sm font-semibold">New Note</span>
          {isPending && <Spinner size={16} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length > 0 ? (
          <div className="space-y-1 py-2">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className={cn(
                  "cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50",
                  selectedNote?.id === note.id && "bg-gray-100",
                )}
                onClick={() => handleNoteSelect(note)}
              >
                <div className="truncate font-medium">{note.title}</div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>{moment(note.updatedAt).fromNow()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Book className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No notes found</h3>
            <p className="mb-4 text-sm text-gray-500">
              {searchQuery ? "Try a different search term" : "Create your first note to get started"}
            </p>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => remove(["q"])}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
