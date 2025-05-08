import { getAccountClassrooms } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { ViewClassrooms } from "@/components/classroom/view-classrooms"
import { redirect } from "next/navigation"

export default async function ClassroomsPage() {
  const session = await getSession()

  if (!session) redirect("/login")

  const classrooms = await getAccountClassrooms(session.accountId)

  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="flex flex-col gap-6" id="__canvas-push-element">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">My Classrooms</h1>
        <ViewClassrooms classrooms={classrooms} />
      </div>
    </div>
  )
}
