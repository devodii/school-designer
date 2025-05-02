"use client"

import React from "react"

import { getAccount } from "@/queries/account"
import { BlurImage } from "@components/blur-image"
import { Input } from "@components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { Search, Bell } from "lucide-react"

export const DashboardHeader = () => {
  const { data: account } = useQuery(getAccount())

  const profilePicture = account?.profile?.pictures[0]

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
            <span className="text-md font-medium">{account?.profile?.fullName}</span>
          </div>
          {profilePicture ? (
            <BlurImage
              src={profilePicture.url}
              alt={`${account?.profile?.fullName} on School Designer`}
              className="rounded-full"
              width={32}
              height={32}
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">
              <span className="font-medium text-gray-700">{account?.profile?.fullName.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
