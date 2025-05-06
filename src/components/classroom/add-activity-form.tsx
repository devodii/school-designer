"use client"

import { createClassroomEvent } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { CardRoot } from "@/components/card-root"
import { RadioGroupRoot } from "@/components/radio-group-root"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { classroomActivityType } from "@/db/schema/classroom"
import { tryCatch } from "@/lib/try-catch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Book, Calendar, File } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const addActivitySchema = z.object({
  content: z.string({ message: "Content is required" }).min(1),
  description: z.string({ message: "Description is required" }).min(1),
  activityType: z.enum(classroomActivityType.enumValues, { message: "Please select an activity type" }),
})

type AddActivitySchema = z.infer<typeof addActivitySchema>

interface AddActivityFormProps {
  classroomId: string
}

export const AddActivityForm = ({ classroomId }: AddActivityFormProps) => {
  const form = useForm<AddActivitySchema>({ resolver: zodResolver(addActivitySchema) })

  const { mutateAsync: addActivity } = useMutation({
    mutationFn: async (dto: AddActivitySchema) => {
      console.log({ dto, classroomId })

      const session = await getSession()

      if (!session) throw new Error("Unauthorized")

      const response = await createClassroomEvent({
        classroomId,
        accountId: session.accountId,
        description: dto.description,
        metadata: { tag: dto.activityType, content: dto.content, description: dto.description },
      })

      return response
    },
    onError: () => toast.error("Failed to create activity"),
  })

  const handleSubmit = form.handleSubmit(async data => {
    await addActivity(data)
  })

  return (
    <CardRoot
      className="shadow-sm"
      titleChildren="Add activity"
      titleClassName="text-2xl"
      descriptionChildren="Share something with your class"
      contentChildren={
        <form onSubmit={handleSubmit} className="space-y-4">
          <Controller
            control={form.control}
            name="content"
            render={({ field, fieldState: { error } }) => (
              <TextareaField
                id={field.name}
                labelText="Content"
                textareaPlaceholder="What would you like to share?"
                textareaValue={field.value}
                textareaOnChange={field.onChange}
                textareaClassName="min-h-[100px] max-h-[150px]"
                errorText={error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState: { error } }) => (
              <TextField
                id={field.name}
                labelText="Description"
                inputPlaceholder="Short description (e.g. 'Added notes for Chapter 5')"
                inputValue={field.value}
                inputOnChange={field.onChange}
                errorText={error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="activityType"
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <Label>Activity Type</Label>
                <RadioGroupRoot
                  errorText={error?.message}
                  data={[
                    {
                      id: "notes",
                      label: "Notes",
                      icon: () => <Book size={16} />,
                      value: classroomActivityType.enumValues[0],
                    },
                    {
                      id: "plan",
                      label: "Study Plan",
                      icon: () => <Calendar size={16} />,
                      value: classroomActivityType.enumValues[1],
                    },
                    {
                      id: "homework",
                      label: "Homework",
                      icon: () => <File size={16} />,
                      value: classroomActivityType.enumValues[2],
                    },
                  ]}
                  onValueChange={field.onChange}
                  value={field.value}
                />
              </div>
            )}
          />
        </form>
      }
      footerChildren={<Button onClick={handleSubmit}>Add Activity</Button>}
    />
  )
}
