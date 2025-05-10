import { findAccountById, findProfileByAccountId } from "@/actions/account"
import { getSession } from "@/actions/session"
import { AccountSettings } from "@/components/settings/account-settings"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const session = await getSession()

  if (!session) redirect("/login")

  const [profile, account] = await Promise.all([
    findProfileByAccountId(session.accountId),
    findAccountById(session.accountId),
  ])

  if (!account) redirect("/signup")

  if (!profile) redirect("/onboarding")

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        <div className="flex flex-col gap-6">
          <AccountSettings
            profileId={profile.id}
            email={account?.email}
            fullName={profile.fullName}
            pictureUrl={profile.pictureUrl}
          />
        </div>
      </div>
    </div>
  )
}
