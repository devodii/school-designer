"use client"

import { useRef } from "react"

import { createClassroom as createClassroomAction } from "@/actions/classroom"
import { AvatarRoot } from "@/components/avatar-root"
import { Spinner } from "@/components/spinner"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { useCanvas } from "@/context/canvas"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useUrlState } from "@/hooks/use-url-state"
import { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { User } from "lucide-react"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { CREATE_CLASSROOM_CANVAS_NAME } from "~/constants/classrooms"

import { Input } from "../ui/input"

const createClassroomSchema = z.object({
  name: z.string({ message: "Classroom name is required" }).min(1),
  inviteCode: z.string({ message: "Invite code is required" }),
  description: z.string({ message: "Description is required" }),
  instructorName: z.string().min(1).optional(),
  instructorPicture: z.custom<FileWithPreview>(val => val instanceof File && "preview" in val).optional(),
})

type ClassroomSchema = z.infer<typeof createClassroomSchema>

export const CreateClassroom = () => {
  const { closeCanvas } = useCanvas()
  const { remove } = useUrlState()

  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const fileWithPreview = Object.assign(file, { preview: reader.result as string })
        form.setValue("instructorPicture", fileWithPreview)
      }
      reader.readAsDataURL(file)
    }
  }

  const { onUpload } = useFileUpload("image", { defaultUploadedFiles: [] }, error => toast.error(error))

  const {
    mutate: createClassroom,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: ClassroomSchema) => {
      let instructorAvatar = undefined

      if (data.instructorPicture) {
        const { preview, ...file } = data.instructorPicture

        const response = await onUpload([file])

        if (!response) throw new Error("Failed to upload picture")

        instructorAvatar = response[0]
      }

      const { instructorName, instructorPicture, ...rest } = data

      return await createClassroomAction({
        ...rest,
        instructor: { name: instructorName, avatar: instructorAvatar },
      })
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
          render={({ field }) => <input className="hidden" type="text" value={field.value} />}
        />

        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold">Teacher Information</div>

          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Controller
                name="instructorPicture"
                control={form.control}
                render={({ field }) => {
                  const file = field.value as FileWithPreview
                  const previewUrl = file?.preview

                  return (
                    <>
                      <button className="cursor-pointer" onClick={() => inputRef.current?.click()} type="button">
                        <AvatarRoot
                          imageSrc={previewUrl}
                          imageAlt=""
                          fallbackChildren={<User className="size-5 text-gray-400" />}
                        />
                      </button>

                      <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </>
                  )
                }}
              />
            </div>

            <div className="flex-grow">
              <Controller
                name="instructorName"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <Input {...field} id={field.name} className="w-full" placeholder="Teacher name" />
                )}
              />
            </div>
          </div>
        </div>

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
