"use client"

import { ReactNode } from "react"

import { getAccount } from "@/queries/account"
import { SelectField } from "@components/select-field"
import { SheetField } from "@components/sheet-field"
import { Button } from "@components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { BookOpen, Wand } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { TextField } from "./text-field"

const notebookSize = z.enum([
  'A4 (8.3" x 11.7")',
  'A5 (5.8" x 8.3")',
  'B5 (6.9" x 9.8")',
  'Letter (8.5" x 11")',
  'Pocket (4.1" x 5.8")',
])

const createNotebookSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  subject: z.string(),
  size: notebookSize,
})

interface CreateNotebookProps {
  trigger: ReactNode
}

export const CreateNotebook = ({ trigger }: CreateNotebookProps) => {
  const form = useForm<z.infer<typeof createNotebookSchema>>({
    resolver: zodResolver(createNotebookSchema),
  })

  const onSubmit = (data: z.infer<typeof createNotebookSchema>) => {
    console.log(data)
  }

  const { data: account } = useQuery(getAccount())

  return (
    <SheetField
      triggerChildren={trigger}
      contentChildren={
        <div className="flex h-screen flex-col gap-4 px-4 py-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="text-primary h-5 w-5" />
            Create New Notebook
          </h3>

          <p className="text-muted-foreground text-md">Create a new magical notebook for your studies</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-4">
              <Controller
                control={form.control}
                name="title"
                render={({ field }) => (
                  <TextField
                    labelText="Title"
                    inputPlaceholder="Quantum Notebook"
                    inputOnBlur={field.onBlur}
                    inputName={field.name}
                    inputValue={field.value}
                    inputOnChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <TextField
                    labelText="Description"
                    inputPlaceholder="Where ideas become equation"
                    inputOnBlur={field.onBlur}
                    inputName={field.name}
                    inputValue={field.value}
                    inputOnChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="subject"
                render={({ field, fieldState: { error } }) => (
                  <SelectField
                    labelText="📚 Pick your subject"
                    items={account?.profile?.subjects_offered.map(i => ({ label: i, value: i })) ?? []}
                    onValueChange={value => field.onChange(value)}
                    triggerClassName="w-[300px]"
                    name={field.name}
                    errorText={error?.message}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="size"
                render={({ field, fieldState: { error } }) => (
                  <SelectField
                    labelText="📏 Choose your notebook size"
                    items={notebookSize.options.map(i => ({ label: i, value: i })) ?? []}
                    onValueChange={value => field.onChange(value)}
                    triggerClassName="w-[300px]"
                    name={field.name}
                    errorText={error?.message}
                  />
                )}
              />
            </div>

            <Button type="submit" className="flex items-center gap-2">
              <span>Generate</span>
              <Wand className="ml-2 size-4" />
            </Button>
          </form>
        </div>
      }
    />
  )
}
