import { CanvasTrigger } from "@/components/canvas-trigger"
import { ClassroomCard } from "@/components/dashboard/classroom-card"
import { CreateClassroom } from "@/components/dashboard/create-classroom"
import { EmptyClassroom } from "@/components/dashboard/empty-classroom"
import { Plus, Sparkle } from "lucide-react"
import { mockClassrooms } from "~/constants/classrooms"

const hasClassrooms = true

export default function ClassroomsPage() {
  return (
    <div className="flex h-screen w-[calc(100vw-250px)] flex-col p-4">
      <div className="flex flex-col gap-6" id="canvas-push-element">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <span>My Classrooms</span>
          <Sparkle className="text-primary h-5 w-5" />
        </h1>

        {hasClassrooms ? (
          <ul className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockClassrooms.map(classroom => (
              <ClassroomCard key={classroom.id} {...classroom} />
            ))}

            <CanvasTrigger
              canvasPushElementId="canvas-push-element"
              canvasContainerStyle={{ top: 20 }}
              canvasOptions={{ content: <CreateClassroom />, width: "400px", position: "right" }}
              triggerChildren={
                <button className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed hover:border-gray-100">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-100">
                    <Plus className="text-primary h-6 w-6" />
                  </div>
                  <p className="text-primary font-medium">Create Classroom</p>
                  <p className="text-muted-foreground mt-1 text-xs">Start a new adventure</p>
                </button>
              }
            />
          </ul>
        ) : (
          <EmptyClassroom />
        )}
      </div>
    </div>
  )
}
