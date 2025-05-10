import { StepComponentProps } from "@/components/multi-step-form"
import { OnboardingSchema } from "@/components/onboarding/schema"
import { RadioCard } from "@/components/radio-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/tw-merge"
import { GraduationCap, School, TestTube } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

const options = [
  {
    value: "ELEMENTARY_SCHOOL",
    title: "Elementary School",
    description: "I'm an elementary school student",
    icon: School,
  },
  {
    value: "HIGH_SCHOOL",
    title: "High School",
    description: "I'm a high school student",
    icon: School,
  },
  {
    value: "COLLEGE",
    title: "College",
    description: "I'm a college student",
    icon: GraduationCap,
  },
  {
    value: "RESEARCHER",
    title: "Researcher",
    description: "I'm a researcher",
    icon: TestTube,
  },
]

interface Step2Props extends StepComponentProps<OnboardingSchema> {}

export const Step2 = ({ onNext, onBack }: Step2Props) => {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Select your education level</h1>
        <p className="text-muted-foreground">
          This helps us personalize your experience and recommend the best content for you.
        </p>
      </div>

      <form
        onSubmit={async e => {
          e.preventDefault()
          const valid = await form.trigger("educationLevel")
          if (valid) onNext()
        }}
        className="mx-auto flex w-full max-w-lg flex-col gap-10"
      >
        <Controller
          control={form.control}
          name="educationLevel"
          render={({ field, fieldState: { error } }) => {
            return (
              <>
                <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {options.map(option => (
                    <RadioCard
                      type="button"
                      key={option.value}
                      titleText={option.title}
                      descriptionText={option.description}
                      icon={option.icon}
                      titleClassName="text-lg font-semibold"
                      isSelected={field.value === option.value}
                      onClick={() => field.onChange(option.value)}
                    />
                  ))}
                </div>
                {error?.message && <p className="text-red-500">{error.message}</p>}

                <div
                  className={cn(
                    "rounded-md border bg-gray-50 p-3",
                    "transition-all duration-300 ease-in-out",
                    "overflow-hidden",
                    field.value === "RESEARCHER" ? "max-h-[100px] opacity-100" : "h-0 border-0 p-0 opacity-0",
                  )}
                >
                  <p className="text-muted-foreground text-center text-sm">
                    As a researcher, you'll have access to features for creating and sharing research papers, including
                    survey distribution tools.
                  </p>
                </div>
              </>
            )
          }}
        />

        <div className="flex w-full items-center gap-4">
          <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
            Back
          </Button>
          <Button className="flex-1" type="submit">
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}
