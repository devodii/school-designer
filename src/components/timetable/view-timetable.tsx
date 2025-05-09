"use client"

import { TimetableSchema } from "@/db/schema/timetable"
import { useGetFileById } from "@/queries/file-upload"
import { useSearchParams } from "next/navigation"

interface ViewTimetableProps {
  timetable: TimetableSchema
}

export const ViewTimetable = ({ timetable }: ViewTimetableProps) => {
  const searchParams = useSearchParams()

  const fileId = searchParams.get("rowid")

  const { data: file } = useGetFileById(fileId)

  return (
    <div>
      <span>{JSON.stringify(timetable)}</span>
      <span>{JSON.stringify(file)}</span>
    </div>
  )
}
