"use client"

import React, { useState } from "react"

import { CodeButton } from "@/components/tiptap-controls"
import { HeadingButton, ItalicButton, StrikethroughButton, SubHeadingButton } from "@/components/tiptap-controls"
import { BoldButton, NumberedListButton } from "@/components/tiptap-controls"
import { BulletListButton } from "@/components/tiptap-controls"
import { TiptapRoot } from "@/components/tiptap-root"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Book, Search, Plus } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  lastEdited: string
  classroomId?: string
  classroomName?: string
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Chemistry 101 - Introduction",
      content:
        "<h2>Introduction to Chemistry</h2><p>Chemistry is the study of matter and the changes it undergoes. Matter is anything that has mass and takes up space.</p><h3>Basic Concepts</h3><p>Atoms are the building blocks of matter. They consist of protons, neutrons, and electrons.</p><ul><li>Protons - positively charged particles</li><li>Neutrons - neutral particles</li><li>Electrons - negatively charged particles</li></ul>",
      lastEdited: "2 days ago",
      classroomId: "chem-101",
      classroomName: "Chemistry 101",
    },
    {
      id: "2",
      title: "Math - Algebra Notes",
      content:
        "<h2>Algebraic Equations</h2><p>Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols.</p><p>In algebra, we use variables (like x or y) to represent unknown values.</p><h3>Examples</h3><p>Solving for x in the equation: 2x + 3 = 7</p><p>Step 1: Subtract 3 from both sides: 2x = 4</p><p>Step 2: Divide both sides by 2: x = 2</p>",
      lastEdited: "1 week ago",
      classroomId: "math-202",
      classroomName: "Math 202",
    },
  ])

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editorContent, setEditorContent] = useState("")
  const [editorTitle, setEditorTitle] = useState("")

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      lastEdited: "Just now",
    }

    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setEditorTitle("Untitled Note")
    setEditorContent("")
  }

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note)
    setEditorTitle(note.title)
    setEditorContent(note.content)
  }

  const handleSaveNote = () => {
    if (!selectedNote) return

    const updatedNotes = notes.map(note => {
      if (note.id === selectedNote.id) {
        return {
          ...note,
          title: editorTitle,
          content: editorContent,
          lastEdited: "Just now",
        }
      }
      return note
    })

    setNotes(updatedNotes)
    setSelectedNote({
      ...selectedNote,
      title: editorTitle,
      content: editorContent,
      lastEdited: "Just now",
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Notes Sidebar */}
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
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            onClick={handleNewNote}
            className="flex w-full items-center gap-2 bg-black text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length > 0 ? (
            <div className="space-y-1 py-2">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`cursor-pointer px-4 py-3 transition-colors hover:bg-gray-50 ${selectedNote?.id === note.id ? "bg-gray-100" : ""}`}
                  onClick={() => handleNoteSelect(note)}
                >
                  <div className="truncate font-medium">{note.title}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {note.classroomName && (
                        <>
                          <span className="mr-2 rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                            {note.classroomName}
                          </span>
                        </>
                      )}
                      {note.lastEdited}
                    </span>
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
                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedNote ? (
          <>
            <div className="border-b border-gray-200 px-6 py-4">
              <Input
                value={editorTitle}
                onChange={e => setEditorTitle(e.target.value)}
                className="border-0 px-0 text-lg font-medium focus-visible:ring-0"
                placeholder="Note title"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">Last edited {selectedNote.lastEdited}</div>
                <Button size="sm" onClick={handleSaveNote} className="bg-black text-white hover:bg-gray-800">
                  Save Changes
                </Button>
              </div>
            </div>
            <div className="h-full flex-1 overflow-y-auto p-6">
              <TiptapRoot
                onChange={content => console.log({ content })}
                groupedControls={[
                  [HeadingButton, SubHeadingButton],
                  [BoldButton, ItalicButton, StrikethroughButton, CodeButton],
                  [BulletListButton, NumberedListButton],
                ]}
                paramsContent={"<h1>Title</h1>"}
                contentClassName="h-[calc(100vh-15rem)] border"
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
            <Button onClick={handleNewNote} className="bg-black text-white hover:bg-gray-800">
              Create New Note
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesPage
