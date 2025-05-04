import { PropsWithChildren } from "react"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen w-screen flex-row overflow-x-hidden">
      <DashboardSidebar />
      <div id="__dashboard-layout-container" className="relative flex w-[calc(100vw-250px)] flex-col gap-6">
        {children}
      </div>
    </div>
  )
}
