import { findClassroomByInviteCode } from "@/actions/classroom"
import { JoinClassroom } from "@/components/join-classroom"
import { notFound } from "next/navigation"

interface JoinPageProps {
  searchParams: Promise<{ room_code: string }>
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const { room_code } = await searchParams

  const classroom = await findClassroomByInviteCode(room_code)

  if (!classroom) return notFound()

  return (
    <main className="flex min-h-screen w-screen justify-center py-12 md:py-24">
      <JoinClassroom data={classroom} />
    </main>
  )
}
