import { PropsWithChildren } from "react"

import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen w-screen flex-row overflow-x-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col gap-6">{children}</div>
    </div>
  )
}
