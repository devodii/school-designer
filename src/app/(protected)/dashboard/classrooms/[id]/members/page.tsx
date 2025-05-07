import { findClassroomById, getClassroomMembers } from "@/actions/classroom"
import { ClassroomMembers } from "@/components/classroom/classroom-members"
import { InviteButton } from "@/components/classroom/invite-button"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface MembersPageProps {
  params: Promise<{ id: string }>
}

export default async function MembersPage({ params }: MembersPageProps) {
  const { id } = await params

  const classroom = await findClassroomById(id)

  if (!classroom) notFound()

  const members = await getClassroomMembers(id)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="max-w-7xl flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/classrooms/${classroom.id}`}>
              <Button variant="outline" size="sm" className="mr-4">
                <ChevronLeft size={16} />
                <span>Back to Classroom</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Classroom Members</h1>
          </div>

          <InviteButton
            variant="default"
            className="flex items-center gap-2"
            shareLink={`/dashboard/classrooms/${classroom.id}`}
            children={
              <>
                <Plus size={16} />
                <span className="font-semibold">Invite Members</span>
              </>
            }
          />
        </div>

        <ClassroomMembers members={members} />
      </div>
    </div>
  )
}
