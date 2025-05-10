import { StepComponentProps } from "@/components/multi-step-form"
import { OnboardingSchema } from "@/components/onboarding/schema"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Controller, useFormContext } from "react-hook-form"

interface Step3Props extends StepComponentProps<OnboardingSchema> {}

export const Step3 = ({ onNext, onBack }: Step3Props) => {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-3xl font-bold">Where Do You Study?</h3>
        <p className="text-muted-foreground">Tell us which school you attend. </p>
      </div>

      <form
        onSubmit={async e => {
          e.preventDefault()
          const valid = await form.trigger("schoolName")
          if (valid) onNext()
        }}
        className="mx-auto flex w-full max-w-lg flex-col gap-10"
      >
        <Controller
          control={form.control}
          name="schoolName"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              labelText=""
              inputValue={field.value}
              inputOnChange={field.onChange}
              inputOnBlur={field.onBlur}
              inputName={field.name}
              errorText={error?.message}
              inputPlaceholder="Enter your school name"
            />
          )}
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
