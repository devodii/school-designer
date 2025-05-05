"use client"

import { sendMagicLink as sendMagicLinkAction } from "@/actions/auth"
import { Spinner } from "@/components/spinner"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { AuthIntent } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { LogIn } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const authSchema = z.object({ email: z.string().email({ message: "Please provide a valid email address" }) })

type AuthSchema = z.infer<typeof authSchema>

interface AuthFormProps {
  intent: AuthIntent
  onSendMagicLink: () => void
  onError: (message: string) => void
}

export const AuthForm = ({ onSendMagicLink, onError, intent }: AuthFormProps) => {
  const { handleSubmit, control } = useForm<AuthSchema>({ resolver: zodResolver(authSchema) })

  const { mutate: sendMagicLink, isPending } = useMutation({
    mutationFn: async (data: AuthSchema) => {
      return await sendMagicLinkAction({ ...data, intent })
    },
    onSuccess: onSendMagicLink,
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
            inputPlaceholder="johndoe@gmail.com"
          />
        )}
      />
      <Button className="flex w-full items-center justify-between" disabled={isPending}>
        <div className="flex flex-1 items-center justify-center gap-2">
          <LogIn className="size-4" />
          <span className="text-sm font-semibold">Continue with Email</span>
        </div>

        {isPending && <Spinner size={20} />}
      </Button>
    </form>
  )
}
