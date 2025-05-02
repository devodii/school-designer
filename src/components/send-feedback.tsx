"use client"

import { createFeedback } from "@/actions/feedback"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { Button } from "@components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

interface SendFeedbackProps {
  onSubmit: () => void
}

const feedbackSchema = z.object({
  text: z.string({ message: "Feedback is required" }).min(1),
  fileUploadId: z.string().nullable(),
})

type FeedbackSchema = z.infer<typeof feedbackSchema>

export const SendFeedback = ({ onSubmit }: SendFeedbackProps) => {
  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { fileUploadId: null, text: "" },
  })

  const {
    mutate: sendFeedback,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FeedbackSchema) => await createFeedback(data),
    onSuccess: () => {
      form.reset()
      onSubmit()
    },
  })

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-lg font-semibold">How can we improve the experience?</h4>
      <p className="text-sm text-gray-500">
        If you encountered any issues or have suggestions, please share them with us.
      </p>

      <form onSubmit={form.handleSubmit(data => sendFeedback(data))} className="mt-4 grid grid-cols-1 gap-4">
        <Controller
          control={form.control}
          name="text"
          render={({ field, fieldState: { error } }) => (
            <TextareaField
              labelText="Feedback"
              textareaPlaceholder="Type your feedback here..."
              textareaClassName="min-h-[100px]"
              textareaValue={field.value}
              textareaOnChange={field.onChange}
              errorText={error?.message}
              textareaOnBlur={field.onBlur}
              textareaName={field.name}
            />
          )}
        />

        {error && <span className="text-sm text-red-500">{error.message}</span>}

        <Button type="submit" className="flex w-full items-center gap-2" disabled={isPending}>
          <span>{isPending ? "Sending..." : "Send Feedback"}</span>
          {isPending && <Spinner size={20} />}
        </Button>
      </form>
    </div>
  )
}
