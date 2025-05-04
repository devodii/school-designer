import { findClassroomById } from "@/actions/classroom"
import { CardRoot } from "@/components/card-root"
import { ClassroomActions } from "@/components/classroom/classroom-actions"
import { InviteButton } from "@/components/classroom/invite-button"
import { InviteSuggestedStudents } from "@/components/classroom/invite-suggested-students"
import { notFound } from "next/navigation"
import { mockAssignments, mockClassmates } from "~/constants/classrooms"

interface ClassroomPageProps {
  params: Promise<{ id: string }>
}

export default async function ClassroomPage({ params }: ClassroomPageProps) {
  const { id } = await params

  const classroom = await findClassroomById(id)

  if (!classroom) return notFound()

  const shareLink = `${process.env.APP_URL}/join?room_code=${classroom.inviteCode}`

  return (
    <div className="flex h-screen w-full flex-col gap-6 px-4 py-6 md:px-12">
      <div className="flex flex-col gap-6" id="__classroom_index">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{classroom.name}</h1>
          <InviteButton shareLink={shareLink} />
        </header>

        <ClassroomActions assignments={mockAssignments} members={mockClassmates} />

        <CardRoot
          className="w-full"
          titleChildren="Invite Classmates"
          descriptionChildren="Add students to your classroom"
          titleClassName="text-xl font-semibold text-start"
          contentChildren={<InviteSuggestedStudents />}
        />
      </div>
    </div>
  )
}
