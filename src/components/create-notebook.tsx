"use client"

import { SelectRoot } from "@/components/select-root"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { Button } from "@/components/ui/button"
import { getAccount } from "@/queries/account"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BookOpen, Wand } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const notebookSize = z.enum([
  'A4 (8.3" x 11.7")',
  'A5 (5.8" x 8.3")',
  'B5 (6.9" x 9.8")',
  'Letter (8.5" x 11")',
  'Pocket (4.1" x 5.8")',
])

const createNotebookSchema = z.object({
  subject: z.string(),
  extraNotes: z.string().optional(),
  size: notebookSize,
})

interface CreateNotebookProps {
  onSuccess: () => void
  onError: () => void
}

export const CreateNotebook = ({ onSuccess, onError }: CreateNotebookProps) => {
  const form = useForm<z.infer<typeof createNotebookSchema>>({
    resolver: zodResolver(createNotebookSchema),
  })

  const { data: account } = useQuery(getAccount())

  const { mutate: createNotebook, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof createNotebookSchema>) => onSuccess(),
    onSuccess: onSuccess,
    onError: onError,
  })

  return (
    <div className="flex h-screen flex-col gap-4 px-4 py-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <BookOpen className="text-primary h-5 w-5" />
        Create New Notebook
      </h3>

      <p className="text-muted-foreground text-md">Create a new magical notebook for your studies</p>

      <form onSubmit={form.handleSubmit(data => createNotebook(data))} className="flex h-full flex-col gap-4">
        <div className="flex flex-col gap-4"></div>

        <Controller
          control={form.control}
          name="subject"
          render={({ field, fieldState: { error } }) => (
            <SelectRoot
              labelText="📚 Pick your subject"
              items={account?.profile?.subjectsOffered?.map(i => ({ label: i, value: i })) ?? []}
              onValueChange={value => field.onChange(value)}
              triggerClassName="w-full"
              name={field.name}
              errorText={error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="size"
          render={({ field, fieldState: { error } }) => (
            <SelectRoot
              labelText="📏 Choose your notebook size"
              items={notebookSize.options.map(i => ({ label: i, value: i })) ?? []}
              onValueChange={value => field.onChange(value)}
              triggerClassName="w-full"
              name={field.name}
              errorText={error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="extraNotes"
          render={({ field, fieldState: { error } }) => (
            <TextareaField
              id={field.name}
              labelText="Notes (optional)"
              textareaPlaceholder="Add any additional notes you want to include"
              textareaName={field.name}
              textareaValue={field.value}
              textareaOnChange={field.onChange}
              errorText={error?.message}
              textareaOnBlur={field.onBlur}
              textareaClassName="h-24"
            />
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline">Close</Button>
          <Button type="submit">
            <span>Generate</span>
            {isPending ? <Spinner size={20} /> : <Wand className="ml-2 size-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}
