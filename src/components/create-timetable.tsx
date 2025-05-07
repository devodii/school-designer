"use client"

import { createTimetable as createTimetableAction } from "@/actions/timetable"
import { SimpleUpload } from "@/components/simple-upload"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useCanvas } from "@/context/canvas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { CREATE_TIMETABLE_CANVAS_NAME } from "~/constants/canvas"

const createTimetableSchema = z.object({
  name: z.string({ message: "Name is required" }).min(1),
  description: z.string().optional(),
  files: z.array(z.string()).min(1, { message: "At least one file is required" }),
})

type CreateTimetableSchema = z.infer<typeof createTimetableSchema>

export const CreateTimetable = () => {
  const { closeCanvas } = useCanvas()

  const form = useForm<CreateTimetableSchema>({
    resolver: zodResolver(createTimetableSchema),
    defaultValues: { description: undefined, files: [], name: "" },
  })

  const {
    mutate: createTimetable,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (dto: CreateTimetableSchema) => {
      await createTimetableAction({ description: dto.description ?? null, fileIds: dto.files, name: dto.name })
    },
    onSuccess: () => {
      closeCanvas(CREATE_TIMETABLE_CANVAS_NAME)
      toast.success("Timetable created successfully")
    },
  })

  return (
    <div className="flex w-full flex-col gap-2 py-6">
      <h1 className="text-xl font-semibold">Create New Timetable</h1>
      <span className="text-muted-foreground text-sm">Create a new timetable to start your learning journey.</span>

      <form onSubmit={form.handleSubmit(data => createTimetable(data))} className="mt-4 flex w-full flex-col gap-6">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              labelText="Timetable Name"
              inputName={field.name}
              inputValue={field.value}
              inputOnChange={field.onChange}
              inputOnBlur={field.onBlur}
              errorText={error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <TextareaField
              id={field.name}
              labelText="Timetable Description"
              textareaName={field.name}
              textareaValue={field.value}
              textareaOnChange={field.onChange}
              textareaOnBlur={field.onBlur}
              textareaPlaceholder="Some extra information about the timetable"
              errorText={error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="files"
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col gap-2">
              <Label>Upload Timetable Files</Label>
              <SimpleUpload
                labelEmptyChildren={<p className="text-muted-foreground text-sm">No file selected</p>}
                endpoint="pdf"
                inputAccept="application/pdf"
                iconClassName="size-4 text-muted-foreground"
                onChangeFiles={files => field.onChange(files.map(({ id }) => id))}
              />
              {error && <p className="text-sm text-red-500">{error?.message}</p>}
            </div>
          )}
        />

        {error && <p className="text-sm text-red-500">{error?.message}</p>}

        <div className="mt-6 flex w-full items-center justify-end gap-2">
          <Button
            type="button"
            className="text-sm"
            variant="outline"
            onClick={() => closeCanvas(CREATE_TIMETABLE_CANVAS_NAME)}
          >
            Close
          </Button>

          <Button type="submit" className="flex" disabled={isPending}>
            <span className="text-sm font-semibold">{isPending ? "Creating..." : "Create"}</span>
            {isPending && <Spinner size={20} />}
          </Button>
        </div>
      </form>
    </div>
  )
}
