"use client"

import { useEffect } from "react"

import { BlurImage } from "@/components/blur-image"
import { CardRoot } from "@/components/card-root"
import { CreateClassroom } from "@/components/classroom/create-classroom"
import { Button } from "@/components/ui/button"
import { useCanvas } from "@/context/canvas"
import { useUrlState } from "@/hooks/use-url-state"
import { Plus } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { CREATE_CLASSROOM_CANVAS_NAME } from "~/constants/classrooms"

interface ViewClassroomsProps {
  classrooms: Array<{
    id: string
    name: string
    backgroundImage: string
    members: Array<{ id: string; name: string; avartar: string }>
    isJoined: boolean
  }>
}

export const ViewClassrooms = ({ classrooms }: ViewClassroomsProps) => {
  const searchParams = useSearchParams()
  const { openCanvas } = useCanvas()
  const { set } = useUrlState()

  const handleOpenCanvas = () => {
    openCanvas({
      position: "right",
      width: "400px",
      content: <CreateClassroom />,
      id: CREATE_CLASSROOM_CANVAS_NAME,
      pushElementId: "__canvas-push-element",
    })
  }

  useEffect(() => {
    const sid = searchParams.get("sid")
    if (sid == CREATE_CLASSROOM_CANVAS_NAME) handleOpenCanvas()
  }, [searchParams])

  if (classrooms.length < 1) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-500"
            >
              <path d="M22 10.5V12c0 4.418-3.582 8-8 8s-8-3.582-8-8V4.5" />
              <path d="M6 4.5V12a8 8 0 0 0 8 8c3.186 0 5.945-1.865 7.236-4.561" />
              <path d="M19 5V2" />
              <path d="M5 2v3" />
              <path d="M19 12h3" />
              <path d="M2 12h3" />
              <path d="M12 12v-9" />
            </svg>
          </div>

          <h2 className="mb-3 text-2xl font-bold">No classrooms yet</h2>

          <p className="mb-8 text-gray-500">
            Start your learning journey by creating your first classroom. Invite classmates and begin studying together!
          </p>

          <Button
            onClick={e => {
              e.stopPropagation()
              handleOpenCanvas()
              set([{ name: "sid", value: CREATE_CLASSROOM_CANVAS_NAME }])
            }}
          >
            Create your first classroom
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ul className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {classrooms.map(({ backgroundImage, name, members, isJoined }) => (
        <CardRoot
          as="li"
          headerClassName="p-0"
          className="pt-0 pb-2"
          titleChildren={
            <div className="relative flex flex-col gap-2">
              <div
                className="top-0 right-0 left-0 h-24 rounded-ss-xl rounded-se-xl bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
            </div>
          }
          contentChildren={
            <div className="-mt-6 flex flex-col items-start gap-2">
              <div className="text-md font-semibold">{name}</div>
              <div>
                {members.map(m => (
                  <BlurImage
                    key={m.id}
                    src={m.avartar}
                    alt={m.name}
                    width={32}
                    height={32}
                    className="-ml-2 inline-flex rounded-full"
                  />
                ))}
              </div>
            </div>
          }
          footerChildren={
            <div className="flex w-full items-center justify-end">
              {isJoined ? <Button>Open</Button> : <Button>Join</Button>}
            </div>
          }
        />
      ))}

      <button
        onClick={e => {
          e.stopPropagation()
          handleOpenCanvas()
          set([{ name: "sid", value: CREATE_CLASSROOM_CANVAS_NAME }])
        }}
        className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed hover:border-gray-100"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-100">
          <Plus className="text-primary h-6 w-6" />
        </div>
        <p className="text-primary font-medium">Create Classroom</p>
        <p className="text-muted-foreground mt-1 text-xs">Start a new adventure</p>
      </button>
    </ul>
  )
}
