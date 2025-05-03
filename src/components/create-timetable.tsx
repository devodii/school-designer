"use client"

import { Button } from "@/components/ui/button"
import { useCanvas } from "@/context/canvas"
import { Spinner } from "@components/spinner"
import { TextField } from "@components/text-field"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { CREATE_TIMETABLE_CANVAS_NAME } from "~/constants/timetables"

const createTimetableSchema = z.object({
  name: z.string({ message: "Name is required" }).min(1),
  description: z.string({ message: "Description is required" }).min(1),
  classroomIds: z.array(z.string()).nullable(),
})

type CreateTimetableSchema = z.infer<typeof createTimetableSchema>

export const CreateTimetable = () => {
  const { closeCanvas } = useCanvas()

  const form = useForm({ resolver: zodResolver(createTimetableSchema), defaultValues: { classroomIds: null } })

  const {
    mutate: createTimetable,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (dto: CreateTimetableSchema) => {
      console.log({ dto })
    },
    onSuccess: () => {
      closeCanvas(CREATE_TIMETABLE_CANVAS_NAME)
    },
  })

  return (
    <div className="flex w-full flex-col gap-2 py-6">
      <h1 className="text-xl font-semibold">Create New Timetable</h1>
      <span className="text-muted-foreground text-sm">Create a new timetable to start your learning journey.</span>

      <form onSubmit={form.handleSubmit(data => createTimetable(data))} className="flex w-full flex-col gap-4 mt-4">
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

        {error && <p className="text-sm text-red-500">{error?.message}</p>}

        <div className="flex w-full items-center justify-end gap-2">
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
