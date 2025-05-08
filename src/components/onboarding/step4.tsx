import { StepComponentProps } from "@/components/multi-step-form"
import { OnboardingSchema } from "@/components/onboarding/schema"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Controller, useFormContext } from "react-hook-form"

interface Step4Props extends StepComponentProps<OnboardingSchema> {}

export const Step4 = ({ onNext, onBack }: Step4Props) => {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Your Invite Code</h1>
        <p className="text-muted-foreground">Customize a code to invite friends.</p>
      </div>

      <form
        onSubmit={async e => {
          e.preventDefault()
          const valid = await form.trigger("referralCode")
          if (valid) onNext()
        }}
        className="mx-auto flex w-full max-w-lg flex-col gap-10"
      >
        <Controller
          control={form.control}
          name="referral_code"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              labelText=""
              inputValue={field.value}
              inputOnChange={field.onChange}
              inputOnBlur={field.onBlur}
              inputName={field.name}
              errorText={error?.message}
              defaultValue="re_je8ud90m3c"
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
