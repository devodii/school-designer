import { Suspense } from "react"

import { TimetableHeader } from "@/components/timetable/timetable-header"
import { ViewTimetables } from "@/components/timetable/view-timetables"
import { mockTimetables } from "~/constants/timetables"

const hasTimetables = true

export default function TimetablePage() {
  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="flex flex-col gap-6" id="__canvas-push-element">
        <TimetableHeader timetables={hasTimetables ? mockTimetables : []} />

        <Suspense fallback={<div>Loading...</div>}>
          <ViewTimetables timetables={hasTimetables ? mockTimetables : []} />
        </Suspense>
      </div>
    </div>
  )
}
