"use client"

import { useEffect } from "react"

import { SendFeedback } from "@/components/ai/send-feedback"
import { ChatWindow } from "@/components/chat/chat-window"
import { CreateNotebook } from "@/components/create-notebook"
import { LinkButton } from "@/components/link-button"
import { Logo } from "@/components/logo"
import { useCanvas } from "@/context/canvas"
import { useUrlState } from "@/hooks/use-url-state"
import { Book, BookOpen, Calendar, Settings, Sparkle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { AI_CHAT_CANVAS_NAME, APP_FEEDBACK_CANVAS_NAME, CREATE_NOTEBOOK_CANVAS_NAME } from "~/constants/canvas"

export const DashboardSidebar = () => {
  const { closeCanvas, openCanvas } = useCanvas()
  const searchParams = useSearchParams()
  const { set } = useUrlState()

  const handleOpenAIChatCanvas = () => {
    openCanvas({
      position: "right",
      width: "350px",
      content: <ChatWindow />,
      id: AI_CHAT_CANVAS_NAME,
      pushElementId: "__dashboard-layout-container",
      wrapperClassName: "h-full p-0",
    })
  }

  const handleOpenCreateNotebookCanvas = () => {
    openCanvas({
      content: (
        <CreateNotebook
          onSuccess={() => closeCanvas("create-notebook")}
          onError={() => toast.error("Failed to create notebook")}
        />
      ),
      width: "350px",
      position: "right",
      id: CREATE_NOTEBOOK_CANVAS_NAME,
      pushElementId: "__dashboard-layout-container",
      wrapperClassName: "h-full p-0",
    })
  }

  const handleOpenAppFeedbackCanvas = () => {
    openCanvas({
      content: (
        <SendFeedback
          onSubmit={() => {
            closeCanvas(APP_FEEDBACK_CANVAS_NAME)
            toast.success("Feedback sent successfully")
          }}
        />
      ),
      width: "350px",
      position: "right",
      id: APP_FEEDBACK_CANVAS_NAME,
      pushElementId: "__dashboard-layout-container",
    })
  }

  useEffect(() => {
    const sid = searchParams.get("sid")
    if (sid == AI_CHAT_CANVAS_NAME) handleOpenAIChatCanvas()
    else if (sid == CREATE_NOTEBOOK_CANVAS_NAME) handleOpenCreateNotebookCanvas()
    else if (sid == APP_FEEDBACK_CANVAS_NAME) handleOpenAppFeedbackCanvas()
  }, [searchParams])

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-100 px-3 py-6">
      <div className="mb-12">
        <div className="flex items-center gap-2">
          <Logo wrapperClassName="size-8" />
          <h2 className="text-lg font-bold">ClassyNotes</h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <LinkButton href="/dashboard/classrooms" icon={BookOpen} label="My Classrooms" buttonClassName="w-full" />
        <LinkButton href="/dashboard/timetables" icon={Calendar} label="My Timetable" buttonClassName="w-full" />
        <LinkButton href="/dashboard/notes" icon={Book} label="My Notes" buttonClassName="w-full" />
        <LinkButton href="?pricing=auto" icon={Sparkle} label="Upgrade to Plus" buttonClassName="w-full" />
      </div>

      <div className="bg-accent mt-4 mb-2 rounded-xl px-3 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkle className="text-primary-600 h-5 w-5" />
          <h3 className="text-primary-700 text-sm font-semibold">AI Tools</h3>
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={e => {
              e.stopPropagation()
              handleOpenCreateNotebookCanvas()
              set([{ name: "sid", value: CREATE_NOTEBOOK_CANVAS_NAME }])
            }}
            className="cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors"
          >
            Create Notebook
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              handleOpenAIChatCanvas()
              set([{ name: "sid", value: AI_CHAT_CANVAS_NAME }])
            }}
            className="w-full cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors"
          >
            AI Chat
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              handleOpenAppFeedbackCanvas()
              set([{ name: "sid", value: APP_FEEDBACK_CANVAS_NAME }])
            }}
            className="cursor-pointer rounded-md px-3 py-1.5 text-left text-sm transition-colors"
          >
            Send Feedback
          </button>
        </div>
      </div>

      <div className="mt-auto px-3">
        <LinkButton href="/dashboard/settings" icon={Settings} label="Settings" />
      </div>
    </div>
  )
}
