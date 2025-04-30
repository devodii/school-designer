import { findClassroomById } from "@/actions/classroom"
import { CardRoot } from "@/components/card-root"
import { ShareClassroomLink } from "@/components/share-classroom-link"
import { Button } from "@/components/ui/button"
import { UsersRound } from "lucide-react"
import { notFound } from "next/navigation"
import { mockAssignments } from "~/constants/classrooms"

interface ClassroomPageProps {
  params: Promise<{ id: string }>
}

export default async function ClassroomPage({ params }: ClassroomPageProps) {
  const { id } = await params

  const classroom = await findClassroomById(id)

  if (!classroom) return notFound()

  const shareLink = `${process.env.APP_URL}/join?roomId=${id}`

  return (
    <div className="flex h-screen w-[calc(100vw-250px)] flex-col gap-6 px-4 py-6 md:px-12">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{classroom.name}</h1>

        <ShareClassroomLink
          trigger={
            <Button variant="outline" className="gap-1">
              <UsersRound className="size-4" />
              <span className="text-sm">Invite Students</span>
            </Button>
          }
          shareLink={shareLink}
        />
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CardRoot
          title="Upcoming Assignments"
          contentChildren={
            <ul className="flex flex-col gap-2">
              {mockAssignments.map(assignment => (
                <li key={assignment.id}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{assignment.title}</span>
                    <span className="text-muted-foreground">{assignment.dueDate}</span>
                  </div>
                </li>
              ))}
            </ul>
          }
          footerChildren={
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" className="w-max rounded-2xl px-2 py-1">
                Add assignment
              </Button>
              <Button variant="outline" className="w-max rounded-2xl px-2 py-1">
                View All
              </Button>
            </div>
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{classroom.name}</h1>
        <p className="text-muted-foreground">{classroom.description}</p>
      </div>
    </div>
  )
}
