"use client"

import { CreateTimetable } from "@/components/create-timetable"
import { Button } from "@/components/ui/button"
import { useCanvas } from "@/context/canvas"
import { TimetableSchema } from "@/db/schema/timetable"
import { useUrlState } from "@/hooks/use-url-state"
import { Upload } from "lucide-react"
import { CREATE_TIMETABLE_CANVAS_NAME } from "~/constants/canvas"

interface TimetableHeaderProps {
  timetables: TimetableSchema[]
}

export const TimetableHeader = ({ timetables }: TimetableHeaderProps) => {
  const { openCanvas } = useCanvas()
  const { set } = useUrlState()

  const handleOpenCanvas = () => {
    openCanvas({
      content: <CreateTimetable />,
      width: "400px",
      position: "right",
      id: CREATE_TIMETABLE_CANVAS_NAME,
      pushElementId: "__canvas-push-element",
    })
    set([{ name: "sid", value: CREATE_TIMETABLE_CANVAS_NAME }])
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <span>My Timetables</span>
      </h1>

      {timetables.length > 1 && (
        <Button
          onClick={e => {
            e.stopPropagation()
            handleOpenCanvas()
            set([{ name: "sid", value: CREATE_TIMETABLE_CANVAS_NAME }])
          }}
          variant="outline"
        >
          <Upload className="size-4" />
          <span>Upload Timetable</span>
        </Button>
      )}
    </div>
  )
}
