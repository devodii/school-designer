import { DashboardHeader } from "@/components/dashboard/header"

export default function DashboardPage() {
  return (
    <div className="flex w-full flex-col">
      <DashboardHeader />
      <div className="flex flex-col">
        <div className="container"></div>
      </div>
    </div>
  )
}
