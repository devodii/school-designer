import { StepComponentProps } from "@/components/multi-step-form"
import { OnboardingSchema } from "@/components/onboarding/schema"
import { SelectableCard } from "@/components/selectable-card"
import { Button } from "@/components/ui/button"
import { GraduationCap, School } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

interface Step2Props extends StepComponentProps<OnboardingSchema> {}

export const Step2 = ({ onNext, onBack }: Step2Props) => {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">High School or College?</h1>
        <p className="text-muted-foreground"> Select your current education level.</p>
      </div>

      <form
        onSubmit={async e => {
          e.preventDefault()
          const valid = await form.trigger("education_level")
          if (valid) onNext()
        }}
        className="mx-auto flex w-full max-w-lg flex-col gap-10"
      >
        <Controller
          control={form.control}
          name="education_level"
          render={({ field, fieldState: { error } }) => {
            const options = [
              { value: "HIGH SCHOOL", title: "High School", description: "I'm a high school student", icon: School },
              { value: "COLLEGE", title: "College", description: "I'm a college student", icon: GraduationCap },
            ]
            return (
              <>
                <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {options.map(option => (
                    <SelectableCard
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
