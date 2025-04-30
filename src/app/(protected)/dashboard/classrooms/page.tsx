import { ClassroomCard } from "@/components/dashboard/classroom-card"
import { Sparkle } from "lucide-react"
import { classroomsData } from "~/constants/classrooms"

export default function ClassroomsPage() {
  return (
    <div className="flex h-screen w-[calc(100vw-250px)] flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <span>My Classrooms</span>
          <Sparkle className="text-primary-600 h-5 w-5" />
        </h1>

        <ul className="grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {classroomsData.map(classroom => (
            <ClassroomCard key={classroom.id} {...classroom} />
          ))}
        </ul>
      </div>
    </div>
  )
}
