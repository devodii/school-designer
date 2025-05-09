import { findProfileByAccountId } from "@/actions/account"
import { getAccountClassrooms } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { ViewClassrooms } from "@/components/classroom/view-classrooms"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { redirect } from "next/navigation"

export default async function ClassroomsPage() {
  const session = await getSession()

  if (!session) redirect("/login")

  const [classrooms, profile] = await Promise.all([
    getAccountClassrooms(session.accountId),
    findProfileByAccountId(session.accountId),
  ])

  if (!profile) redirect("/onboarding")

  return (
    <div className="flex h-screen w-full flex-col p-4">
      <DashboardHeader profile={profile} />

      <div className="flex flex-col gap-6" id="__canvas-push-element">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">My Classrooms</h1>
        <ViewClassrooms classrooms={classrooms} />
      </div>
    </div>
  )
}
