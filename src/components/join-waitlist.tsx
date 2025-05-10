"use client"

import { createWaitlist } from "@/actions/waitlist"
import { CheckboxRoot } from "@/components/checkbox-root"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Spinner } from "@components/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const waitlistSchema = z.object({
  email: z.string().email(),
  would_pay: z.string().transform(v => v === "yes"),
  feature_request: z.string().optional(),
})

type WaitlistFormData = {
  email: string
  would_pay: string
  feature_request?: string
}

export const JoinWaitlist = () => {
  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema, undefined, { raw: true }),
    defaultValues: { would_pay: "no", feature_request: undefined },
  })

  const { mutate: joinWaitlist, isPending } = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      const { email, would_pay, feature_request = null } = data
      return await createWaitlist({ email, would_pay, feature_request })
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
        name="feature_request"
        render={({ field }) => (
          <TextareaField
            id={field.name}
            labelText="What specific features would you like to see?"
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
