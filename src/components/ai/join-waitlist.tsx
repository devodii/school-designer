"use client"

import { createWaitlist } from "@/actions/waitlist"
import { CheckboxRoot } from "@/components/checkbox-root"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const waitlistSchema = z.object({
  email: z.string().email(),
  would_pay: z.string().transform(v => v === "yes"),
  study_challenge: z.string().optional(),
})

type WaitlistFormData = {
  email: string
  would_pay: string
  study_challenge?: string
}

export const JoinWaitlist = () => {
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema, undefined, { raw: true }),
    defaultValues: { would_pay: "no", study_challenge: undefined },
  })

  const { mutate: joinWaitlist, isPending } = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      const { email, would_pay, study_challenge = null } = data
      console.log(email, would_pay, study_challenge)
      return await createWaitlist({ email, would_pay, study_challenge })
    },
    onSuccess: () => {
      toast.success("You've been added to the waitlist!")
    },
    onError: () => {
      toast.error("Failed to join waitlist")
    },
  })

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={form.handleSubmit(data => joinWaitlist(data))}>
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="What's your email?"
            inputOnChange={field.onChange}
            inputValue={field.value}
            inputOnBlur={field.onBlur}
            inputName={field.name}
            errorText={error?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="study_challenge"
        render={({ field }) => (
          <TextareaField
            id={field.name}
            labelText="What is your study challenge?"
            textareaOnChange={field.onChange}
            textareaValue={field.value}
            textareaOnBlur={field.onBlur}
            textareaName={field.name}
            textareaClassName="min-h-[70px]"
          />
        )}
      />

      <Controller
        control={form.control}
        name="would_pay"
        render={({ field }) => (
          <CheckboxRoot
            id="would_pay"
            labelText="I would pay for the app"
            checkboxValue={field.value ? "yes" : "no"}
            checkboxOnCheckedChange={checked => field.onChange(checked ? "yes" : "no")}
            checkboxName={field.name}
            checkboxOnBlur={field.onBlur}
          />
        )}
      />

      <Button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2">
        <span className="text-sm font-medium">Join Waitlist</span>
        {isPending && <Spinner size={20} />}
      </Button>
    </form>
  )
}
