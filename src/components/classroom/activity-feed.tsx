import { createElement } from "react"

import { CardRoot } from "@/components/card-root"
import { Badge } from "@/components/ui/badge"
import { ClassroomActivityType, ClassroomEventSchema } from "@/db/schema/classroom"
import { Book, Calendar, MessageSquare } from "lucide-react"
import Image from "next/image"

interface ActivityFeedSchema {
  activities: Array<{ event: ClassroomEventSchema; userName: string; userAvatar: string }>
}

export const ActivityFeed = ({ activities }: ActivityFeedSchema) => {
  const getActivityIcon = (type: ClassroomActivityType): any => {
    if (type == "NOTE") return Book
    else if (type == "PLAN") return Calendar
    else if (type == "HOMEWORK") return MessageSquare
    else throw new Error("Invalid activity type")
  }

  return (
    <CardRoot
      titleChildren="Recent Activity"
      className="w-full shadow-sm"
      contentChildren={
        <ul className="space-y-6">
          {activities.map(activity => (
            <li key={activity.event.id} className="flex items-start gap-3">
              <Image
                className="size-10 rounded-full"
                width={60}
                height={60}
                alt={`${activity.userName} \n ${activity.event.description}`}
                src={JSON.parse(activity.userAvatar)}
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
                      {createElement(getActivityIcon(activity.event.metadata?.tag), {
                        className: "size-4 text-gray-500",
                      })}
                      <span>
                        {activity.event.metadata?.tag.charAt(0).toUpperCase() + activity.event.metadata?.tag.slice(1)}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      }
    />
  )
}
