"use client"

import { createClassroomEvent } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { PopoverRoot } from "@/components/popover-root"
import { SimpleUpload } from "@/components/simple-upload"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/tw-merge"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { CalendarIcon } from "lucide-react"
import moment from "moment"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const createAssignmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueDate: z.date(),
  points: z.number().min(1),
  fileIds: z.array(z.string()).nullable(),
})

type CreateAssignmentForm = z.infer<typeof createAssignmentSchema>

interface CreateAssignmentProps {
  classroomId: string
}

export const CreateAssignment = ({ classroomId }: CreateAssignmentProps) => {
  const form = useForm<CreateAssignmentForm>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: { fileIds: null },
  })

  const { mutate: createAssignment, isPending: isCreatingAssignment } = useMutation({
    mutationFn: async (data: CreateAssignmentForm) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(data)

      const session = await getSession()

      if (!session) throw new Error("Unauthorized")

      const { fileIds, ...rest } = data

      const response = await createClassroomEvent({
        fileIds,
        classroomId,
        accountId: session.accountId,
        description: data.title,
        metadata: { tag: "ASSIGNMENT", ...rest },
      })

      console.log({ response })
      return data
    },
    onSuccess: () => toast.success("Assignment created successfully"),
    onError: () => toast.error("Something went wrong"),
  })

  const onSubmit = (data: CreateAssignmentForm) => {
    createAssignment(data)
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="title"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="Title"
            errorText={error?.message}
            inputValue={field.value}
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputName={field.name}
          />
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field, fieldState: { error } }) => (
          <TextareaField
            id="description"
            labelText="Description"
            errorText={error?.message}
            textareaValue={field.value}
            textareaOnChange={field.onChange}
            textareaOnBlur={field.onBlur}
          />
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={form.control}
          name="dueDate"
          render={({ field, fieldState: { error } }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <PopoverRoot
                triggerChildren={
                  <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? moment(field.value).format("Do MMMM YYYY") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                }
                contentChildren={
                  <Calendar
                    id="dueDate"
                    onDayClick={field.onChange}
                    min={new Date().getTime()}
                    selected={field.value}
                  />
                }
              />
              {error?.message && <p className="text-xs text-red-500">{error.message}</p>}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="points"
          render={({ field, fieldState: { error } }) => (
            <TextField
              id={field.name}
              labelText="Total Points"
              inputType="number"
              errorText={error?.message}
              inputValue={field.value}
              inputOnChange={e => field.onChange(Number(e.target.value))}
              inputOnBlur={field.onBlur}
              inputName={field.name}
            />
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="fileIds"
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <SimpleUpload
              labelEmptyChildren={<Input type="file" multiple />}
              onChangeFiles={files => field.onChange(files.map(({ id }) => id))}
              endpoint="*"
            />
            <span className="text-muted-foreground text-xs">You can upload multiple files (PDF, Word, images)</span>
          </div>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isCreatingAssignment} className="self-end">
          <span className="text-sm font-semibold">{isCreatingAssignment ? "Creating..." : "Create Assignment"}</span>
          {isCreatingAssignment && <Spinner size={16} />}
        </Button>
      </div>
    </form>
  )
}
