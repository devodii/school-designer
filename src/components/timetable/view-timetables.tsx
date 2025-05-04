"use client"

import { useEffect } from "react"

import { CreateTimetable } from "@/components/create-timetable"
import { TableRoot } from "@/components/table-root"
import { ViewTimetable } from "@/components/timetable/view-timetable"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useCanvas } from "@/context/canvas"
import { TimetableSchema } from "@/db/schema/timetable"
import { useUrlState } from "@/hooks/use-url-state"
import { createColumnHelper } from "@tanstack/react-table"
import { Calendar } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { CREATE_TIMETABLE_CANVAS_NAME, VIEW_TIMETABLE_CANVAS_NAME } from "~/constants/canvas"

const columnHelper = createColumnHelper<TimetableSchema>()

const defaultColumns = [
  columnHelper.accessor("name", {
    header: () => <Label className="text-md font-semibold">Name</Label>,
    cell: info => info.getValue() as string,
  }),
  columnHelper.accessor("createdAt", {
    header: () => <Label className="text-md font-semibold">Uploaded At</Label>,
    cell: info => {
      const value = info.getValue()
      return value instanceof Date ? value.toLocaleDateString() : value
    },
  }),
  columnHelper.accessor("description", {
    header: () => <Label className="text-md font-semibold">Description</Label>,
    cell: info => info.getValue() as string,
  }),
]

interface ViewTimetablesProps {
  timetables: TimetableSchema[]
}

export const ViewTimetables = ({ timetables }: ViewTimetablesProps) => {
  const { openCanvas } = useCanvas()
  const { set } = useUrlState()

  const searchParams = useSearchParams()

  const handleOpenViewTimetableCanvas = (timetable: TimetableSchema) => {
    openCanvas({
      id: VIEW_TIMETABLE_CANVAS_NAME,
      content: <ViewTimetable timetable={timetable} />,
      position: "right",
      pushElementId: "__canvas-push-element",
      width: "400px",
    })
  }

  const handleRowAction = (row: TimetableSchema) => {
    handleOpenViewTimetableCanvas(row)
    set([
      { name: "sid", value: VIEW_TIMETABLE_CANVAS_NAME },
      { name: "rowid", value: row.id },
    ])
  }

  const handleOpenCreateTimetableCanvas = () => {
    openCanvas({
      content: <CreateTimetable />,
      width: "400px",
      position: "right",
      id: CREATE_TIMETABLE_CANVAS_NAME,
      pushElementId: "__canvas-push-element",
    })
  }

  useEffect(() => {
    const sid = searchParams.get("sid")
    const rowid = searchParams.get("rowid")

    if (sid == CREATE_TIMETABLE_CANVAS_NAME) handleOpenCreateTimetableCanvas()

    if (sid == VIEW_TIMETABLE_CANVAS_NAME && rowid) {
      const timetable = timetables.find(t => t.id === rowid)
      if (timetable) handleOpenViewTimetableCanvas(timetable)
    }
  }, [searchParams])

  if (timetables.length < 1) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Calendar className="h-12 w-12 text-gray-500" />
          </div>

          <h2 className="mb-3 text-2xl font-bold">No timetables yet</h2>

          <p className="mb-8 text-gray-500">
            Upload your class timetables to keep track of your schedule. We support PDF timetables from most educational
            institutions.
          </p>
        </div>

        <Button
          onClick={e => {
            e.stopPropagation()
            handleOpenCreateTimetableCanvas()
            set([{ name: "sid", value: CREATE_TIMETABLE_CANVAS_NAME }])
          }}
        >
          Create your first timetable
        </Button>
      </div>
    )
  }

  return <TableRoot data={timetables} columns={defaultColumns as any} onRowAction={handleRowAction} />
}
