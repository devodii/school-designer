"use client"

import { createElement } from "react"

import { CardRoot } from "@/components/card-root"
import { Spinner } from "@/components/spinner"
import { TabsRoot } from "@/components/tabs-root"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AccountSchema } from "@/db/schema/account"
import { ClassroomActivityType } from "@/db/schema/classroom"
import { ClassroomActivityHomeworkMetadata } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Book, Calendar, MessageSquare, File, ShieldQuestion, Ear, Plus, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { mockActivities, mockClassmates, mockDocuments } from "~/constants/classrooms"

interface ClassroomBodyProps {
  room: { name: string; description: string }
  owner: AccountSchema
  account: AccountSchema
}

const editClassroomSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

type EditClassroomForm = z.infer<typeof editClassroomSchema>

export const ClassroomBody = ({ owner, account, room }: ClassroomBodyProps) => {
  const getActivityIcon = (type: ClassroomActivityType): any => {
    if (type == "NOTE") return Book
    else if (type == "ANNOUNCEMENT") return Ear
    else if (type == "HOMEWORK") return MessageSquare
    else if (type == "QUESTION") return ShieldQuestion
    else if (type == "STUDY_PLAN") return Calendar
    else if (type == "RESOURCE") return File
    else if (type == "OTHER") return Book
  }

  const classmates = mockClassmates.slice(0, 5)

  const editClassroomForm = useForm<EditClassroomForm>({
    resolver: zodResolver(editClassroomSchema),
    defaultValues: {
      name: room.name,
      description: room.description,
    },
  })

  const { mutate: updateClassroom, isPending: isUpdatingClassroom } = useMutation({
    mutationFn: async (data: EditClassroomForm) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return data
    },
    onSuccess: () => toast.success("Classroom updated successfully"),
    onError: () => toast.error("Something went wrong"),
  })

  const isOwner = owner.id === account.id

  return (
    <TabsRoot
      defaultValue="feed"
      className="w-full"
      triggerClassName="cursor-pointer"
      data={[
        {
          value: "feed",
          label: () => <div className="cursor-pointer text-sm font-medium">Feed</div>,
          component: () => (
            <div className="grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CardRoot
                  titleChildren="Recent Activity"
                  className="w-full shadow-sm"
                  contentChildren={
                    <ul className="space-y-6">
                      {mockActivities.map(activity => (
                        <li key={activity.id} className="flex items-start gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
                            {activity.accountId.charAt(0).toUpperCase()}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{activity.accountId}</p>
                              <span className="text-xs text-gray-500">{activity.createdAt.toLocaleString()}</span>
                            </div>
                            <p className="mt-1 text-sm">{activity.metadata.content.title}</p>
                            <div className="mt-2 flex items-center">
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                              >
                                {createElement(getActivityIcon(activity.type), { className: "size-4 text-gray-500" })}
                                <span>{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                              </Badge>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  }
                  footerChildren={
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Activity
                    </Button>
                  }
                />
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                <CardRoot
                  titleChildren="Upcoming"
                  className="Upcoming"
                  contentChildren={
                    <ul className="space-y-4">
                      {mockActivities
                        .filter(activity => activity.metadata.type === "HOMEWORK")
                        .map(assignment => {
                          const homework = assignment.metadata as ClassroomActivityHomeworkMetadata
                          return (
                            <li key={assignment.id} className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-300"></span>
                              <div>
                                <p className="font-medium">{homework.content.title}</p>
                                <p className="text-sm text-gray-500">{homework.content.dueDate.toLocaleString()}</p>
                              </div>
                            </li>
                          )
                        })}
                    </ul>
                  }
                  footerChildren={
                    <Button variant="ghost" size="sm" className="w-full">
                      <span className="flex items-center gap-2">
                        <Plus size={16} />
                        <span className="text-sm font-semibold">Add Assignment</span>
                      </span>
                    </Button>
                  }
                />

                <CardRoot
                  titleChildren={<div className="text-2xl font-semibold">Classmates</div>}
                  contentChildren={
                    <ul className="space-y-4">
                      {classmates.map(classmate => (
                        <li key={classmate.id} className="flex items-center gap-3 rounded-md p-3 hover:bg-gray-50">
                          <Image
                            src={classmate.avartar}
                            alt={classmate.name}
                            width={40}
                            height={40}
                            className="size-12 rounded-full"
                          />

                          <div className="flex-1">
                            <p className="font-medium">{classmate.name}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {classmate.role}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  }
                />
              </div>
            </div>
          ),
        },

        {
          value: "documents",
          label: () => <div className="cursor-pointer text-sm font-medium">Documents</div>,
          component: () => (
            <CardRoot
              className="max-w-7xl shadow-sm"
              titleClassName="flex flex-row items-center justify-between pb-"
              titleChildren={
                <>
                  <div className="text-xl font-semibold">Documents</div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus size={16} />
                    <span className="text-sm font-semibold">Upload</span>
                  </Button>
                </>
              }
              contentChildren={
                <ul className="space-y-4">
                  {mockDocuments.map(doc => (
                    <li key={doc.id} className="flex items-center gap-3 rounded-md p-3 hover:bg-gray-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                        <File className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              }
              footerChildren={<div className="text-sm text-gray-500">View All Documents</div>}
            />
          ),
        },
        {
          value: "members",
          label: () => <div className="cursor-pointer text-sm font-medium">Members</div>,
          component: () => (
            <>
              <CardRoot
                titleChildren={<div className="text-2xl font-semibold">Classmates</div>}
                className="w-full max-w-7xl shadow-sm"
                contentChildren={
                  <ul className="space-y-4">
                    {classmates.map(classmate => (
                      <li className="flex items-center gap-3 rounded-md p-3 hover:bg-gray-50">
                        <Image
                          src={classmate.avartar}
                          alt={`${classmate.name} on ClassyNotes`}
                          height={50}
                          width={50}
                          className="size-10 rounded-full"
                        />

                        <div className="flex-1">
                          <p className="font-medium">{classmate.name}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {classmate.role}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                }
              />
            </>
          ),
        },
        {
          value: "settings",
          label: () => <div className="cursor-pointer text-sm font-medium">Settings</div>,
          component: () => (
            <>
              <CardRoot
                className="w-full max-w-7xl shadow-sm"
                titleChildren={<div className="text-2xl font-semibold">General Setings</div>}
                contentClassName="space-y-4"
                contentChildren={
                  <form onSubmit={editClassroomForm.handleSubmit(data => updateClassroom(data))} className="space-y-4">
                    <Controller
                      control={editClassroomForm.control}
                      name="name"
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          labelText="Classroom Name"
                          inputOnChange={field.onChange}
                          inputName={field.name}
                          inputOnBlur={field.onBlur}
                          inputValue={field.value}
                          inputDisabled={!isOwner}
                        />
                      )}
                    />

                    <Controller
                      control={editClassroomForm.control}
                      name="description"
                      render={({ field }) => (
                        <TextareaField
                          id={field.name}
                          labelText="Description"
                          textareaOnChange={field.onChange}
                          textareaName={field.name}
                          textareaOnBlur={field.onBlur}
                          textareaValue={field.value}
                          textareaDisabled={!isOwner}
                        />
                      )}
                    />

                    <Button disabled={!isOwner || isUpdatingClassroom} type="submit" className="w-full max-w-xs gap-2">
                      <span className="text-sm font-semibold">Save Changes</span>
                      {isUpdatingClassroom && <Spinner size={20} />}
                    </Button>
                  </form>
                }
              />
            </>
          ),
        },
      ]}
    />
  )
}
