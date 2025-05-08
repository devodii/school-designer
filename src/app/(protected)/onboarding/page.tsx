import { findClassroomById, findClassroomByInviteCode } from "@/actions/classroom"
import { CardRoot } from "@/components/card-root"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { Users } from "lucide-react"

interface OnboardingPageProps {
  searchParams: Promise<{ room_code: string; room_name: string }>
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { room_code } = await searchParams
  const hasRoomCode = room_code ? true : false

  let classroom = null

  if (hasRoomCode) {
    classroom = await findClassroomByInviteCode(room_code)
  }

  return (
    <div className="bg-background flex min-h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto w-full space-y-6 px-4">
        {hasRoomCode && (
          <CardRoot
            className="mx-auto w-full max-w-md p-0 px-4"
            contentChildren={
              <div className="flex items-start space-x-4">
                <div className="rounded-full bg-black p-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display mb-1 text-lg font-bold text-black">Classroom Invitation</h3>
                  <p className="mb-3 text-sm text-gray-700">
                    Complete your profile to join <strong>{classroom?.name}</strong>. Your classmates are waiting for
                    you!
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-black" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            }
          />
        )}

        <OnboardingForm />
      </div>
    </div>
  )
}
