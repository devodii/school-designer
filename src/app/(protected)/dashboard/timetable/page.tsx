import { CanvasTrigger } from "@/components/canvas-trigger"
import { CardRoot } from "@/components/card-root"
import { CreateTimetable } from "@/components/create-timetable"
import { Button } from "@components/ui/button"
import { Calendar, Sparkle } from "lucide-react"
import { CREATE_TIMETABLE_CANVAS_NAME, mockTimetables } from "~/constants/timetables"

const hasTimetables = false

export default function TimetablePage() {
  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="flex flex-col gap-6" id="__canvas-push-element">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <span>My Timetables</span>
          <Sparkle className="text-primary h-5 w-5" />
        </h1>

        {hasTimetables ? (
          <ul className="grid w-full max-w-6xl grid-cols-1 gap-4">
            {mockTimetables.map(t => (
              <CardRoot contentChildren={JSON.stringify(t)} />
            ))}
          </ul>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-16">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-12 w-12 text-gray-500" />
              </div>

              <h2 className="mb-3 text-2xl font-bold">No timetables yet</h2>

              <p className="mb-8 text-gray-500">
                Upload your class timetables to keep track of your schedule. We support PDF timetables from most
                educational institutions.
              </p>
            </div>

            <CanvasTrigger
              canvasId={CREATE_TIMETABLE_CANVAS_NAME}
              canvasOptions={{
                content: <CreateTimetable />,
                width: "400px",
                position: "right",
                id: CREATE_TIMETABLE_CANVAS_NAME,
                pushElementId: "__canvas-push-element",
              }}
              triggerAsChild
              triggerChildren={<Button>Create your first timetable</Button>}
            />
          </div>
        )}
      </div>
    </div>
  )
}
