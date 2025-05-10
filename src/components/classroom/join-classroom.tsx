"use client"

import { findAccountById } from "@/actions/account"
import { addClassroomMember, createClassroomEvent } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { AvatarRoot } from "@/components/avatar-root"
import { CardRoot } from "@/components/card-root"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { ClassroomSchema } from "@/db/schema/classroom"
import { tryCatch } from "@/lib/try-catch"
import { useMutation } from "@tanstack/react-query"
import { BookOpen, Lock, User, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface JoinClassroomProps {
  data: Pick<ClassroomSchema, "id" | "name" | "description" | "inviteCode" | "instructor" | "type"> & {
    memberCount: number
  }
}

export const JoinClassroom = ({ data }: JoinClassroomProps) => {
  const router = useRouter()

  const { mutate: joinPublicClassroom, isPending } = useMutation({
    mutationFn: async () => {
      const session = await getSession()

      if (!session) return router.push(`/signin?redirect=/onboarding?room_code=${data.inviteCode}`)

      const account = await findAccountById(session.accountId)

      if (!account) return router.push(`/signin?redirect=/onboarding?room_code=${data.inviteCode}`)

      const { error: classroomMemberError } = await tryCatch(
        Promise.all([
          addClassroomMember(data.inviteCode, account.id),
          createClassroomEvent({
            classroomId: data.id,
            accountId: account.id,
            description: "Joined classroom",
            metadata: { tag: "NEW_MEMBER" },
            fileIds: null,
          }),
        ]),
      )

      if (classroomMemberError) throw new Error("Failed to join classroom")

      router.push(`/dashboard/classrooms/${data.id}`)
    },
    onError: error => toast.error(error.message),
  })

  const handleJoinClassroom = () => {
    if (data.type === "PUBLIC") {
      joinPublicClassroom()
    } else toast.success("Private classrooms are not available yet")
  }

  return (
    <CardRoot
      className="mx-4 h-max w-full max-w-2xl"
      titleChildren={
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="size-12 text-gray-500" />
          </div>

          <h2 className="text-center text-2xl font-semibold">Join ‘{data.name}‘</h2>
        </div>
      }
      descriptionChildren={data.description}
      descriptionClassName="text-center"
      contentClassName="space-y-4 md:space-y-6"
      contentChildren={
        <>
          {data.instructor && (
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center">
                <AvatarRoot
                  imageClassName=""
                  fallbackClassName="text-sm"
                  fallbackChildren={data.instructor?.name?.charAt(0) || "T"}
                  {...(data.instructor?.avatar && { imageSrc: data.instructor.avatar })}
                />
                <div>
                  <div className="text-sm text-gray-500">Teacher</div>
                  <div className="font-medium">{data.instructor?.name}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded-lg border border-gray-200 p-4">
              <User className="mr-2 size-5 text-gray-500" />
              <span className="font-medium">{data.memberCount} Members</span>
            </div>

            {data.type === "PRIVATE" ? (
              <button className="flex items-center justify-center rounded-lg border border-gray-200 p-4">
                <Lock className="mr-2 size-5 text-gray-500" />
                <span className="font-medium">Private Classroom</span>
              </button>
            ) : (
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 p-4">
                <UserPlus className="mr-2 size-5 text-gray-500" />
                <span className="font-medium">Open Enrollment</span>
                {isPending && <Spinner size={16} />}
              </button>
            )}
          </div>
        </>
      }
      footerClassName="flex flex-col items-center pb-8 pt-2"
      footerChildren={
        <>
          <p className="mb-4 text-center text-gray-600">You need to join this classroom to view its content</p>
          <div className="flex gap-4">
            <Link href="/dashboard/classrooms">
              <Button variant="outline">Go Back</Button>
            </Link>

            <Button
              onClick={handleJoinClassroom}
              disabled={isPending}
              className="bg-black text-white hover:bg-gray-800"
            >
              Request to Join
            </Button>
          </div>
        </>
      }
    />
  )
}
