import { findProfileByAccountId } from "@/actions/account"
import { findAllResearchByAccountId } from "@/actions/research"
import { getSession } from "@/actions/session"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ViewResearches } from "@/components/research/view-researches"
import { redirect } from "next/navigation"

export default async function ResearchesPage() {
  const session = await getSession()

  if (!session) redirect("/login")

  const [researches, profile] = await Promise.all([
    findAllResearchByAccountId(session.accountId),
    findProfileByAccountId(session.accountId),
  ])

  if (!profile) redirect("/onboarding")

  return (
    <div className="flex h-screen w-full flex-col p-4">
      <DashboardHeader profile={profile} />

      <div className="flex flex-col gap-6" id="__canvas-push-element">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Research Papers</h1>
          <p className="text-muted-foreground">Create and manage your research papers and surveys</p>
        </div>

        <ViewResearches researches={researches} />
      </div>
    </div>
  )
}
