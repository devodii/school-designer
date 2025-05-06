import { findAccountById } from "@/actions/account"
import { findClassroomById, getClassroomEvents } from "@/actions/classroom"
import { getCurrentUser } from "@/actions/session"
import { ClassroomBody } from "@/components/classroom/classroom-body"
import { InviteButton } from "@/components/classroom/invite-button"
import { Button } from "@/components/ui/button"
import { Edit3, UserPlus } from "lucide-react"
import { notFound } from "next/navigation"

interface ClassroomPageProps {
  params: Promise<{ id: string }>
}

export default async function ClassroomPage({ params }: ClassroomPageProps) {
  const { id } = await params

  const classroom = await findClassroomById(id)

  if (!classroom) return notFound()

  const [owner, account, activities] = await Promise.all([
    findAccountById(classroom.ownerId),
    getCurrentUser(),
    getClassroomEvents(id),
  ])

  if (!owner || !account) return notFound()

  const shareLink = `${process.env.APP_URL}/join?room_code=${classroom.inviteCode}`

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6" id="__classroom_index">
        <div className="mb-6 flex w-full items-center justify-between">
          <header>
            <h1 className="mb-1 text-3xl font-bold">{classroom.name}</h1>
            <p className="text-sm text-gray-500">
              {classroom.subject} • {owner.id}
            </p>
          </header>

          <div className="flex items-center gap-3">
            {account.id == owner.id && (
              <Button className="gap-2" variant="outline" size="sm">
                <Edit3 size={16} />
                <span className="text-sm">Edit</span>
              </Button>
            )}

            <InviteButton
              shareLink={shareLink}
              variant="default"
              size="sm"
              className="gap-2"
              children={
                <>
                  <UserPlus size={16} />
                  <span className="text-sm text-white">Invite</span>
                </>
              }
            />
          </div>
        </div>

        <ClassroomBody activities={activities.slice(0, 5)} owner={owner} account={account} classroom={classroom} />
      </div>
    </div>
  )
}
