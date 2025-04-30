"use client"

import { ReactNode, useState } from "react"

import { getAccount } from "@/queries/account"
import { SelectField } from "@components/select-field"
import { SheetField } from "@components/sheet-field"
import { Spinner } from "@components/spinner"
import { TextareaField } from "@components/text-area-field"
import { Button } from "@components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { BookOpen, Wand } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
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
  trigger: ReactNode
}

export const CreateNotebook = ({ trigger }: CreateNotebookProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const form = useForm<z.infer<typeof createNotebookSchema>>({
    resolver: zodResolver(createNotebookSchema),
  })

  const onSubmit = (data: z.infer<typeof createNotebookSchema>) => {
    console.log(data)
  }

  const { data: account } = useQuery(getAccount())

  const { mutate: createNotebook, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof createNotebookSchema>) => {
      console.log({ data })
    },
    onSuccess: () => {
      toast.success("Notebook created successfully")
      setIsSheetOpen(false)
    },
    onError: () => {
      toast.error("Failed to create notebook")
    },
  })

  return (
    <SheetField
      open={isSheetOpen}
      onOpenChange={setIsSheetOpen}
      triggerChildren={trigger}
      contentChildren={
        <div className="flex h-screen flex-col gap-4 px-4 py-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="text-primary h-5 w-5" />
            Create New Notebook
          </h3>

          <p className="text-muted-foreground text-md">Create a new magical notebook for your studies</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-4">
            <div className="flex flex-col gap-4"></div>

            <Controller
              control={form.control}
              name="subject"
              render={({ field, fieldState: { error } }) => (
                <SelectField
                  labelText="📚 Pick your subject"
                  items={account?.profile?.subjects_offered.map(i => ({ label: i, value: i })) ?? []}
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
                <SelectField
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
      }
    />
  )
}
