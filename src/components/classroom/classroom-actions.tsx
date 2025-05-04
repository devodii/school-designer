"use client"

import { useEffect } from "react"

import { BlurImage } from "@/components/blur-image"
import { CardRoot } from "@/components/card-root"
import { Button } from "@/components/ui/button"
import { useCanvas } from "@/context/canvas"
import { useUrlState } from "@/hooks/use-url-state"
import { useSearchParams } from "next/navigation"
import { CLASSROOM_ASSIGNMENT_CANVAS_NAME, CLASSROOM_MEMBERS_CANVAS_NAME } from "~/constants/canvas"

interface ClassroomActionsProps {
  assignments: Array<{ id: string; title: string; dueDate: string }>
  members: Array<{ id: string; name: string; avartar: string }>
}

export const ClassroomActions = ({ assignments, members }: ClassroomActionsProps) => {
  const { set } = useUrlState()
  const { openCanvas } = useCanvas()
  const searchParams = useSearchParams()

  const handleOpenAssignmentsCanvas = () => {
    openCanvas({
      content: <div>Assignments</div>,
      id: CLASSROOM_ASSIGNMENT_CANVAS_NAME,
      position: "right",
      pushElementId: "__classroom_index",
      width: "400px",
    })
  }

  const handleOpenMembersCanvas = () => {
    openCanvas({
      content: <div>Members</div>,
      id: CLASSROOM_MEMBERS_CANVAS_NAME,
      position: "right",
      pushElementId: "__classroom_index",
      width: "400px",
    })
  }

  useEffect(() => {
    const sid = searchParams.get("sid")
    if (sid == CLASSROOM_ASSIGNMENT_CANVAS_NAME) handleOpenAssignmentsCanvas()
    else if (sid == CLASSROOM_MEMBERS_CANVAS_NAME) handleOpenMembersCanvas()
  }, [searchParams])

  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <CardRoot
        onClick={e => {
          e.stopPropagation()
          handleOpenAssignmentsCanvas()
          set([{ name: "sid", value: CLASSROOM_ASSIGNMENT_CANVAS_NAME }])
        }}
        className="h-[200px]"
        titleChildren="Assignments"
        titleClassName="text-xl font-semibold text-start"
        contentChildren={
          <ul className="-mt-4 flex flex-col gap-2">
            {assignments.map(({ title, id, dueDate }) => (
              <li key={id}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{title}</span>
                  <span className="text-muted-foreground">{dueDate}</span>
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

      <CardRoot
        onClick={e => {
          e.stopPropagation()
          handleOpenMembersCanvas()
          set([{ name: "sid", value: CLASSROOM_MEMBERS_CANVAS_NAME }])
        }}
        className="h-[200px]"
        titleChildren="Classmates"
        titleClassName="text-xl font-semibold text-start"
        contentChildren={
          <ul className="-mt-4 flex flex-col gap-2">
            {members.slice(0, 3).map(({ name, avartar, id }) => (
              <li key={id} className="flex items-center gap-2">
                <BlurImage src={avartar} className="size-8 rounded-full" alt={name} width={32} height={32} />
                <span className="text-sm font-medium">{name}</span>
              </li>
            ))}
          </ul>
        }
        footerChildren={<div />}
      />
    </div>
  )
}
