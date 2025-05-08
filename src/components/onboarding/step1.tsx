import { StepComponentProps } from "@/components/multi-step-form"
import { OnboardingSchema } from "@/components/onboarding/schema"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Controller, useFormContext } from "react-hook-form"

interface Step1Props extends StepComponentProps<OnboardingSchema> {}

export const Step1 = ({ onNext }: Step1Props) => {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-3xl font-bold">What is your full name?</h3>
        <p className="text-muted-foreground">Choose how you'll appear to others in the app.</p>
      </div>

      <form
        onSubmit={async e => {
          e.preventDefault()
          const valid = await form.trigger("fullName")
          if (valid) onNext()
        }}
        className="mx-auto flex w-full max-w-lg flex-col gap-10"
      >
        <Controller
          control={form.control}
          name="fullName"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              labelText=""
              inputPlaceholder="Emmanuel Odii.."
              inputValue={field.value}
              inputOnChange={field.onChange}
              inputOnBlur={field.onBlur}
              inputName={field.name}
              errorText={error?.message}
            />
          )}
        />

        <Button type="submit">Next</Button>
      </form>
    </div>
  )
}
