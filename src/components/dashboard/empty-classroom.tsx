"use client"

import { CanvasTrigger } from "@/components/canvas-trigger"
import { CreateClassroom } from "@components/dashboard/create-classroom"
import { Button } from "@components/ui/button"

export const EmptyClassroom = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-500"
          >
            <path d="M22 10.5V12c0 4.418-3.582 8-8 8s-8-3.582-8-8V4.5" />
            <path d="M6 4.5V12a8 8 0 0 0 8 8c3.186 0 5.945-1.865 7.236-4.561" />
            <path d="M19 5V2" />
            <path d="M5 2v3" />
            <path d="M19 12h3" />
            <path d="M2 12h3" />
            <path d="M12 12v-9" />
          </svg>
        </div>

        <h2 className="mb-3 text-2xl font-bold">No classrooms yet</h2>

        <p className="mb-8 text-gray-500">
          Start your learning journey by creating your first classroom. Invite classmates and begin studying together!
        </p>

        <CanvasTrigger
          canvasPushElementId="__canvas-push-element"
          canvasId="create-classroom"
          canvasContainerStyle={{ top: -10 }}
          canvasOptions={{ content: <CreateClassroom />, width: "400px", position: "right", id: "create-classroom" }}
          triggerChildren={<Button>Create Your First Classroom</Button>}
        />
      </div>
    </div>
  )
}
