"use client"

import { createClassroom as createClassroomAction } from "@/actions/classroom"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { useCanvas } from "@/context/canvas"
import { useUrlState } from "@/hooks/use-url-state"
import { sleep } from "@/lib/sleep"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { CREATE_CLASSROOM_CANVAS_NAME } from "~/constants/classrooms"

const createClassroomSchema = z.object({
  name: z.string({ message: "Classroom name is required" }).min(1),
  inviteCode: z.string({ message: "Invite code is required" }),
  description: z.string({ message: "Description is required" }),
})

type ClassroomSchema = z.infer<typeof createClassroomSchema>

export const CreateClassroom = () => {
  const { closeCanvas } = useCanvas()
  const { remove } = useUrlState()

  const router = useRouter()

  const {
    mutate: createClassroom,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: ClassroomSchema) => {
      await sleep(4000)
      return await createClassroomAction(data)
    },
    onSuccess: data => {
      closeCanvas(CREATE_CLASSROOM_CANVAS_NAME)
      form.reset()
      router.push(`/dashboard/classrooms/${data.id}`)
    },
  })

  const form = useForm({
    resolver: zodResolver(createClassroomSchema),
    defaultValues: { inviteCode: `cv_${nanoid(15)}` },
  })

  return (
    <div className="flex w-full flex-col gap-4 py-6">
      <h1 className="text-xl font-semibold">Create New Classroom</h1>
      <span className="text-muted-foreground text-sm">Create a new classroom to start your learning journey.</span>
      <form onSubmit={form.handleSubmit(data => createClassroom(data))} className="mt-6 flex w-full flex-col gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              labelText="Classroom Name"
              errorText={error?.message}
              inputPlaceholder="Defense Against Dark Arts"
              inputName={field.name}
              inputValue={field.value}
              inputOnChange={field.onChange}
              inputOnBlur={field.onBlur}
            />
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <TextareaField
              id={field.name}
              labelText="What’s this class about?"
              errorText={error?.message}
              textareaPlaceholder="Learn to fight the dark arts with friends."
              textareaName={field.name}
              textareaValue={field.value}
              textareaOnChange={field.onChange}
              textareaOnBlur={field.onBlur}
              textareaClassName="h-32"
            />
          )}
        />

        <Controller
          name="inviteCode"
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              labelText="Customize your invite code"
              errorText={error?.message}
              inputPlaceholder="Enter your invite code"
              inputName={field.name}
              inputValue={field.value}
              inputOnChange={field.onChange}
              inputOnBlur={field.onBlur}
            />
          )}
        />

        {isError && <p className="text-sm text-red-500">{error?.message}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            className="text-sm"
            variant="outline"
            onClick={() => {
              closeCanvas(CREATE_CLASSROOM_CANVAS_NAME)
              remove(["sid"])
            }}
          >
            Close
          </Button>
          <Button className="text-sm font-semibold" type="submit" disabled={isPending}>
            Create Classroom
            {isPending && <Spinner className="ml-2" size={20} />}
          </Button>
        </div>
      </form>
    </div>
  )
}
