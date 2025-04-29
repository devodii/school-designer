"use client"

import React from "react"

import { LinkButton } from "@components/link-button"
import { Book, BookOpen, Calendar, Settings, Sparkle } from "lucide-react"
import Link from "next/link"

export const DashboardSidebar = () => {
  return (
    <div className="flex h-screen w-72 flex-col border-r border-gray-100 px-3 py-6">
      <div className="mb-12">
        <Link href="/dashboard">
          <h1 className="font-display text-primary-800 min-w-max text-xl font-bold"> 🎒School Designer</h1>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <LinkButton href="/dashboard/classrooms" icon={BookOpen} label="My Classrooms" buttonClassName="w-full" />
        <LinkButton href="/dashboard/timetable" icon={Calendar} label="My Timetable" buttonClassName="w-full" />
        <LinkButton href="/dashboard/cookbooks" icon={Book} label="My Cookbooks" buttonClassName="w-full" />
      </div>

      <div className="bg-primary-50 mt-4 mb-2 rounded-xl px-3 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkle className="text-primary-600 h-5 w-5" />
          <h3 className="text-primary-700 text-sm font-semibold">AI Tools</h3>
        </div>
        <div className="flex flex-col gap-1.5">
          <button className="text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded-md px-3 py-1.5 text-left text-sm transition-colors">
            Create Notebook
          </button>
          <button className="text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded-md px-3 py-1.5 text-left text-sm transition-colors">
            Generate Cover
          </button>
          <button className="text-primary-600 hover:text-primary-800 hover:bg-primary-100 rounded-md px-3 py-1.5 text-left text-sm transition-colors">
            Study Helper
          </button>
        </div>
      </div>

      <div className="mt-auto px-3">
        <LinkButton href="/dashboard/settings" icon={Settings} label="Settings" />
      </div>
    </div>
  )
}
