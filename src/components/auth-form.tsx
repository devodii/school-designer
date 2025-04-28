"use client"

import { useState } from "react"

import { sendMagicLink } from "@/actions/send-magic-link"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Spinner } from "./spinner"

const authSchema = z.object({ email: z.string() })

type AuthSchema = z.infer<typeof authSchema>

interface AuthFormProps {
  onSendMagicLink: (data: AuthSchema) => void
  onError: (data: string) => void
}

export const AuthForm = ({ onSendMagicLink, onError }: AuthFormProps) => {
  const { handleSubmit, control } = useForm<AuthSchema>({ resolver: zodResolver(authSchema) })
  const [isPending, setIsPending] = useState(false)

  const onSubmit = async (data: AuthSchema) => {
    setIsPending(true)
    try {
      const response = await sendMagicLink(data)
      onSendMagicLink(data)

      if (!response.success) onError(response.error.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form className="flex w-full max-w-sm flex-1 flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            labelHtmlFor="email"
            inputId="email"
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
