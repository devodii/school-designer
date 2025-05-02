"use client"

import { sendMagicLink as sendMagicLinkAction } from "@/actions/auth"
import { Spinner } from "@/components/spinner"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const authSchema = z.object({ email: z.string() })

type AuthSchema = z.infer<typeof authSchema>

interface AuthFormProps {
  onSendMagicLink: (data: AuthSchema) => void
  onError: (message: string) => void
}

export const AuthForm = ({ onSendMagicLink, onError }: AuthFormProps) => {
  const { handleSubmit, control } = useForm<AuthSchema>({ resolver: zodResolver(authSchema) })

  const { mutate: sendMagicLink, isPending } = useMutation({
    mutationFn: async (data: AuthSchema) => {
      onSendMagicLink(data)
      return await sendMagicLinkAction(data)
    },
    onError: ({ message }) => onError(message),
  })

  return (
    <form className="flex w-full max-w-sm flex-1 flex-col gap-3" onSubmit={handleSubmit(data => sendMagicLink(data))}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            id={field.name}
            labelText="Email"
            inputValue={field.value}
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputName={field.name}
            errorText={error?.message}
            inputDisabled={isPending}
          />
        )}
      />
      <Button className="w-full" disabled={isPending}>
        {isPending ? "Sending link..." : "Continue"}
        {isPending && <Spinner size={24} />}
      </Button>
    </form>
  )
}
