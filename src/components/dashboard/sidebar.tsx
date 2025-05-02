"use client"

import React from "react"

import { CanvasTrigger } from "@/components/canvas-trigger"
import { ChatWindow } from "@/components/chat-window"
import { CreateNotebook } from "@/components/create-notebook"
import { QuizForm } from "@/components/quiz-form"
import { SendFeedback } from "@/components/send-feedback"
import { useCanvas } from "@/context/canvas"
import { LinkButton } from "@components/link-button"
import { Book, BookOpen, Calendar, Settings, Sparkle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { mockQuiz } from "~/constants/classrooms"

export const DashboardSidebar = () => {
  const { closeCanvas } = useCanvas()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-100 px-3 py-6">
      <div className="mb-12">
        <Link href="/dashboard">
          <h1 className="min-w-max text-xl font-semibold"> 🎒School Designer</h1>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <LinkButton href="/dashboard/classrooms" icon={BookOpen} label="My Classrooms" buttonClassName="w-full" />
        <LinkButton href="/dashboard/timetable" icon={Calendar} label="My Timetable" buttonClassName="w-full" />
        <LinkButton href="/dashboard/cookbooks" icon={Book} label="My Cookbooks" buttonClassName="w-full" />
      </div>

      <div className="mt-4 mb-2 rounded-xl px-3 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkle className="text-primary-600 h-5 w-5" />
          <h3 className="text-primary-700 text-sm font-semibold">AI Tools</h3>
        </div>
        <div className="flex flex-col gap-1.5">
          <CanvasTrigger
            canvasId="create-notebook"
            canvasOptions={{
              content: (
                <CreateNotebook
                  onSuccess={() => closeCanvas("create-notebook")}
                  onError={() => toast.error("Failed to create notebook")}
                />
              ),
              width: "400px",
              position: "right",
              id: "create-notebook",
              pushElementId: "__dashboard-layout-container",
              wrapperClassName: "h-full p-0",
            }}
            triggerAsChild
            triggerChildren={
              <button className="cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors">
                Create Notebook
              </button>
            }
          />

          <CanvasTrigger
            canvasId="ai-chat"
            canvasOptions={{
              position: "right",
              width: "400px",
              content: <ChatWindow />,
              id: "ai-chat",
              pushElementId: "__dashboard-layout-container",
              wrapperClassName: "h-full p-0",
            }}
            triggerAsChild
            triggerChildren={
              <button className="w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors">
                AI Chat
              </button>
            }
          />

          <CanvasTrigger
            canvasId="study-helper"
            canvasOptions={{
              content: <QuizForm quiz={mockQuiz} />,
              width: "400px",
              position: "right",
              id: "study-helper",
              pushElementId: "__dashboard-layout-container",
            }}
            triggerAsChild
            triggerChildren={
              <button className="cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors">
                Quiz Helper
              </button>
            }
          />

          <CanvasTrigger
            canvasId="app-feedback"
            canvasOptions={{
              content: (
                <SendFeedback
                  onSubmit={() => {
                    closeCanvas("app-feedback")
                    toast.success("Feedback sent successfully")
                  }}
                />
              ),
              width: "400px",
              position: "right",
              id: "app-feedback",
              pushElementId: "__dashboard-layout-container",
            }}
            triggerAsChild
            triggerChildren={
              <button className="cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors">
                Send Feedback
              </button>
            }
          />
        </div>
      </div>

      <div className="mt-auto px-3">
        <LinkButton href="/dashboard/settings" icon={Settings} label="Settings" />
      </div>
    </div>
  )
}
