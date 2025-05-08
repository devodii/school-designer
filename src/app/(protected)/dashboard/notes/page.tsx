import { getAccountNotes } from "@/actions/note"
import { NoteEditor } from "@/components/note/note-editor"
import { NoteSidebar } from "@/components/note/note-sidebar"

interface NotesPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const notes = await getAccountNotes()
  const { id } = await searchParams

  return (
    <div className="flex h-screen overflow-hidden">
      <NoteSidebar notes={notes} />
      <NoteEditor key={id} notes={notes} />
    </div>
  )
}
