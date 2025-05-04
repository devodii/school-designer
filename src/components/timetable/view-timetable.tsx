import { Timetable } from "@/db/schema/timetable"

interface ViewTimetableProps {
  timetable: Timetable
}

export const ViewTimetable = ({ timetable }: ViewTimetableProps) => {
  return <div>{JSON.stringify(timetable)}</div>
}
