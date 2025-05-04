import { ViewClassrooms } from "@/components/classroom/view-classrooms"
import { mockClassrooms } from "~/constants/classrooms"

const hasClassrooms = true

export default function ClassroomsPage() {
  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="flex flex-col gap-6" id="__canvas-push-element">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">My Classrooms</h1>
        <ViewClassrooms classrooms={hasClassrooms ? mockClassrooms : []} />
      </div>
    </div>
  )
}
