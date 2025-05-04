"use client"

import { TableRoot } from "@/components/table-root"
import { ViewTimetable } from "@/components/timetable/view-timetable"
import { Label } from "@/components/ui/label"
import { useCanvas } from "@/context/canvas"
import { Timetable } from "@/db/schema/timetable"
import { createColumnHelper } from "@tanstack/react-table"
import { mockTimetables, VIEW_TIMETABLE_CANVAS_NAME } from "~/constants/timetables"

const columnHelper = createColumnHelper<Timetable>()

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

export const ViewTimetables = () => {
  const timetable = mockTimetables

  const { openCanvas } = useCanvas()

  const handleRowAction = (row: Timetable) => {
    openCanvas({
      id: VIEW_TIMETABLE_CANVAS_NAME,
      content: <ViewTimetable timetable={row} />,
      position: "right",
      pushElementId: "__canvas-push-element",
      width: "400px",
    })
  }

  return (
    <>
      <TableRoot data={timetable} columns={defaultColumns as any} onRowAction={handleRowAction} />
    </>
  )
}
