import { findClassroomById } from "@/actions/classroom"
import { BlurImage } from "@/components/blur-image"
import { CanvasTrigger } from "@/components/canvas-trigger"
import { CardRoot } from "@/components/card-root"
import { Combobox } from "@/components/combobox"
import { CommandRoot } from "@/components/command-root"
import { InviteSuggestedStudents } from "@/components/invite-suggested-students"
import { ShareClassroomLink } from "@/components/share-classroom-link"
import { Button } from "@/components/ui/button"
import { UsersRound } from "lucide-react"
import { notFound } from "next/navigation"
import { mockAssignments, mockClassmates } from "~/constants/classrooms"

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
      <div className="flex flex-col gap-6" id="classroom-index">
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

        <div className="grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CanvasTrigger
            canvasOptions={{
              content: <div>Upcoming Assignments</div>,
              width: "400px",
              position: "right",
            }}
            canvasPushElementId="classroom-index"
            triggerChildren={
              <CardRoot
                className="h-[200px]"
                titleChildren="Upcoming Assignments"
                titleClassName="text-xl font-semibold text-start"
                contentChildren={
                  <ul className="-mt-4 flex flex-col gap-2">
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
            }
            canvasContainerStyle={{ top: 20 }}
          />

          <CanvasTrigger
            canvasOptions={{ content: <div>Classmates</div>, width: "400px", position: "right" }}
            canvasPushElementId="classroom-index"
            triggerChildren={
              <CardRoot
                className="h-[200px]"
                titleChildren="Classmates"
                titleClassName="text-xl font-semibold text-start"
                contentChildren={
                  <ul className="-mt-4 flex flex-col gap-2">
                    {mockClassmates.slice(0, 3).map(classmate => (
                      <li key={classmate.id} className="flex items-center gap-2">
                        <BlurImage
                          src={classmate.avatar}
                          className="size-8 rounded-full"
                          alt={classmate.name}
                          width={32}
                          height={32}
                        />
                        <span className="text-sm font-medium">{classmate.name}</span>
                      </li>
                    ))}
                  </ul>
                }
                footerChildren={<div />}
              />
            }
            canvasContainerStyle={{ top: 20 }}
          />
        </div>

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
