"use client"

import { Canvas } from "@/components/canvas"
import { useCanvas } from "@/context/canvas"

export default function Page() {
  return (
    <>
      <Canvas pushElementId="main-content" containerStyle={{ top: 20 }} />
      <div className="flex h-screen" id="root-app">
        {/* Sidebar or other content that doesn't move */}
        <div className="w-64 bg-gray-100 p-4">
          <h2 className="font-bold">Sidebar</h2>
          <p>This won't move when canvas opens</p>
        </div>

        {/* Main content that will be pushed */}
        <div id="main-content" className="flex-1 p-8">
          <ExamplePage />
        </div>
      </div>
    </>
  )
}

function DashboardPanel() {
  return (
    <div className="space-y-4">
      <h2>Dashboard Content</h2>
      <p>This is the dashboard panel content</p>
    </div>
  )
}

export function ExamplePage() {
  const { state, openCanvas } = useCanvas()

  const handleOpenDashboard = () => {
    openCanvas({
      content: <DashboardPanel />,
      width: "25%",
      position: "right",
    })
  }

  return (
    <>
      <button onClick={handleOpenDashboard} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        {state.isOpen ? "Close Dashboard" : "Open Dashboard"}
      </button>

      <div className="mt-6">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p className="mt-4">This content will be pushed when the canvas opens</p>
      </div>
    </>
  )
}
