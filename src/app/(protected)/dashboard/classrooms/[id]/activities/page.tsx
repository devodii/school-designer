import { findClassroomById, getClassroomEvents } from "@/actions/classroom"
import { ActivityFeed } from "@/components/classroom/activity-feed"
import { AddActivityForm } from "@/components/classroom/add-activity-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ActivityFeedProps {
  params: Promise<{ id: string }>
}

export default async function ActivityListPage({ params }: ActivityFeedProps) {
  const { id: classroomId } = await params

  const classroom = await findClassroomById(classroomId)

  if (!classroom) notFound()

  const activities = await getClassroomEvents(classroomId)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="max-w-7xl flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center">
          <Link href={`/dashboard/classrooms/${classroomId}`}>
            <Button variant="outline" size="sm" className="mr-4">
              <ChevronLeft size={16} />
              <span>Back to Classroom</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">All Activities</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed activities={activities} classroomId={classroomId} hasMore={false} />
          </div>

          <AddActivityForm classroomId={classroomId} />
        </div>
      </div>
    </div>
  )
}
