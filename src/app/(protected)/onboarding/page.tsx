import { getAuth } from "@/actions/auth"
import { OnboardingForm } from "@/components/onboarding-form"

export default async function OnboardingPage() {
  return (
    <div className="bg-background flex min-h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Complete your profile</h1>
          <p className="text-muted-foreground">Tell us a bit about yourself to get started</p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  )
}
