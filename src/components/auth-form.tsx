"use client"

import { sendMagicLink } from "@/actions/send-magic-link"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const authSchema = z.object({ email: z.string() })

type AuthSchema = z.infer<typeof authSchema>

export const AuthForm = () => {
  const { handleSubmit, control } = useForm<AuthSchema>({ resolver: zodResolver(authSchema) })

  return (
    <form
      className="flex max-w-sm flex-1 flex-col gap-3"
      onSubmit={handleSubmit(async data => await sendMagicLink(data))}
    >
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
          />
        )}
      />
      <Button className="w-full">Continue</Button>
    </form>
  )
}
