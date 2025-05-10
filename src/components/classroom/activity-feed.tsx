import { CardRoot } from "@/components/card-root"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClassroomEventSchema, ClassroomEventType } from "@/db/schema/classroom"
import { BookOpen, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { AvatarRoot } from "../avatar-root"

interface ActivityFeedSchema {
  activities: Array<{ event: ClassroomEventSchema; userName: string; userAvatar: string }>
  classroomId: string
  hasMore: boolean
}

export const ActivityFeed = ({ activities, classroomId, hasMore }: ActivityFeedSchema) => {
  const getActivityIcon = (type: ClassroomEventType) => {
    switch (type) {
      case "NOTE":
        return <FileText size={16} className="text-blue-500" />
      case "PLAN":
        return <Calendar size={16} className="text-green-500" />
      case "ASSIGNMENT":
        return <BookOpen size={16} className="text-purple-500" />
      default:
        return <FileText size={16} className="text-gray-500" />
    }
  }

  return (
    <CardRoot
      titleChildren="Recent Activity"
      className="w-full shadow-sm"
      contentChildren={
        <div className="flex w-full flex-col items-center gap-4">
          {activities.length > 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No recent activity</h3>
              <p className="max-w-sm text-gray-500">
                When you or your classmates share notes, homework, or study plans, they'll appear here.
              </p>
            </div>
          ) : (
            <ul className="w-full space-y-6">
              {activities.map(activity => (
                <li key={activity.event.id} className="flex items-start gap-3">
                  <AvatarRoot
                    className="size-10 rounded-full"
                    imageWidth={60}
                    imageHeight={60}
                    fallbackChildren={activity.userName.charAt(0)}
                    imageSrc={activity.userAvatar}
                    imageAlt={`${activity.userName} \n ${activity.event.description}`}
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.userName}</p>
                      <span className="text-xs text-gray-500">{activity.event.createdAt.toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-sm">{activity.event.description}</p>
                    <div className="mt-2 flex items-center">
                      {activity.event?.metadata && "tag" in activity.event?.metadata && (
                        <Badge variant="outline" className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                          {getActivityIcon(activity.event.metadata.tag)}
                          <span>
                            {activity.event.metadata?.tag.charAt(0).toUpperCase() +
                              activity.event.metadata?.tag.slice(1)}
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <Link href={`/dashboard/classrooms/${classroomId}/activities`} className="mx-auto w-full">
              <Button variant="ghost" className="w-full">
                <span className="text-sm font-semibold">View All Activities</span>
              </Button>
            </Link>
          )}
        </div>
      }
    />
  )
}
