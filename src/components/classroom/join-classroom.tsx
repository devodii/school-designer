"use client"

import { findAccountById } from "@/actions/account"
import { postClassroomJoin } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { CardRoot } from "@/components/card-root"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { ClassroomSchema } from "@/db/schema/classroom"
import { sleep } from "@/lib/sleep"
import { useMutation } from "@tanstack/react-query"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface JoinClassroomProps {
  data: ClassroomSchema
}

export const JoinClassroom = ({ data }: JoinClassroomProps) => {
  const router = useRouter()

  const { mutate: joinClassroom, isPending } = useMutation({
    mutationFn: async () => {
      const session = await getSession()

      await sleep(1000)

      if (!session) return router.push(`/signin?redirect=/join?roomCode=${data.inviteCode}`)

      const account = await findAccountById(session.accountId)

      if (!account) return router.push(`/signin?redirect=/join?roomCode=${data.inviteCode}`)

      const { id } = await postClassroomJoin(data.id)

      router.push(`/dashboard/classrooms/${id}`)
    },
    onError: error => toast.error(error.message),
  })

  return (
    <CardRoot
      className="mx-4 h-max w-full max-w-2xl"
      titleChildren={
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-12 w-12 text-gray-500" />
          </div>

          <h2 className="text-center text-2xl font-semibold">Join ‘{data.name}‘</h2>
        </div>
      }
      descriptionChildren="You‘ve been invited to join Ms. Johnson's classroom"
      descriptionClassName="text-center"
      contentChildren={
        <div className="flex w-full flex-col items-center gap-4">
          <p className="text-center text-sm text-gray-600">
            By joining this classroom, you'll get access to all course materials, assignments, and be able to
            participate in class discussions.
          </p>

          <Button
            disabled={isPending}
            onClick={() => joinClassroom()}
            className="mx-auto flex w-full max-w-xs items-center gap-2"
          >
            <span className="text-sm font-semibold"> Join Classroom</span>
            {isPending && <Spinner size={20} />}
          </Button>
        </div>
      }
    />
  )
}
