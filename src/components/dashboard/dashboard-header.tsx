"use client"

import { AvatarRoot } from "@/components/avatar-root"
import { Input } from "@/components/ui/input"
import { ProfileSchema } from "@/db/schema/account"
import { Bell, Search } from "lucide-react"

interface DashboardHeaderProps {
  profile: ProfileSchema
}

export const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  const profilePicture = profile?.pictureUrl

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-100 px-6">
      <div className="relative w-64">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input type="text" className="w0full pr-4 pl-10" placeholder="Search anything..." />
      </div>

      <div className="flex items-center gap-2">
        <button className="hover:bg-muted relative cursor-pointer rounded-full p-2">
          <Bell className="text-muted-foreground h-5 w-5" />
          <span className="bg-muted-foreground absolute top-1 right-1 h-2 w-2 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-md font-medium">{profile?.fullName}</span>
          </div>

          <AvatarRoot
            fallbackChildren={profile?.fullName.charAt(0)}
            imageSrc={profilePicture}
            imageWidth={32}
            imageHeight={32}
            imageClassName="rounded-full"
            imageAlt={`${profile?.fullName} on classynotes`}
          />
        </div>
      </div>
    </header>
  )
}
