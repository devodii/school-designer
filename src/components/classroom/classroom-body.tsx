"use client"

import { useState } from "react"

import { updateClassroomById } from "@/actions/classroom"
import { AvatarRoot } from "@/components/avatar-root"
import { CardRoot } from "@/components/card-root"
import { ActivityFeed } from "@/components/classroom/activity-feed"
import { AddActivityForm } from "@/components/classroom/add-activity-form"
import { CreateAssignment } from "@/components/classroom/create-assignment"
import { DialogRoot } from "@/components/dialog-root"
import { Spinner } from "@/components/spinner"
import { TabsRoot } from "@/components/tabs-root"
import { TextareaField } from "@/components/text-area-field"
import { TextField } from "@/components/text-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AccountSchema } from "@/db/schema/account"
import { ClassroomEventSchema, ClassroomMemberAccount, ClassroomSchema } from "@/db/schema/classroom"
import { AssignmentClassroomEventMetadata } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Calendar, FileText, Plus } from "lucide-react"
import moment from "moment"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface ClassroomBodyProps {
  classroom: ClassroomSchema
  owner: AccountSchema | null
  account: AccountSchema
  activities: Array<{ event: ClassroomEventSchema; userName: string; userAvatar: string }>
  members: ClassroomMemberAccount[]
}

const editClassroomSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

type EditClassroomForm = z.infer<typeof editClassroomSchema>

export const ClassroomBody = ({ owner, account, classroom, activities, members }: ClassroomBodyProps) => {
  const editClassroomForm = useForm<EditClassroomForm>({
    resolver: zodResolver(editClassroomSchema),
    defaultValues: { name: classroom.name, description: classroom.description },
  })

  const { mutate: updateClassroom, isPending: isUpdatingClassroom } = useMutation({
    mutationFn: async (data: EditClassroomForm) => {
      return await updateClassroomById(classroom.id, data)
    },
    onSuccess: () => toast.success("Classroom updated successfully"),
    onError: () => toast.error("Something went wrong"),
  })

  const isOwner = owner?.id === account.id

  const router = useRouter()

  const upcomingAssignments = activities.filter(activity => activity.event.metadata?.tag === "ASSIGNMENT")

  const [selectedAssignment, setSelectedAssignment] = useState<ClassroomEventSchema | null>(null)
  const selectedAssignmentMetadata = selectedAssignment?.metadata as AssignmentClassroomEventMetadata | undefined

  console.log({ selectedAssignment })
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
              <div className="space-y-6 lg:col-span-2">
                <AddActivityForm classroomId={classroom.id} />

                <ActivityFeed activities={activities.slice(0, 3)} classroomId={classroom.id} hasMore={true} />
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                <CardRoot
                  titleChildren="Upcoming Assignments"
                  className="Upcoming"
                  contentChildren={
                    <>
                      <ul className="space-y-4">
                        {upcomingAssignments.length > 0 ? (
                          upcomingAssignments.map(({ event: assignment }) => (
                            <li
                              key={assignment.id}
                              className="flex cursor-pointer items-center justify-between rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                              onClick={() => setSelectedAssignment(assignment)}
                            >
                              {assignment.metadata && "title" in assignment.metadata && (
                                <p className="font-medium">{assignment.metadata.title}</p>
                              )}
                              {assignment.metadata && "dueDate" in assignment.metadata && (
                                <span className="text-xs text-gray-500">
                                  {assignment.metadata?.tag === "ASSIGNMENT" &&
                                    "Due: " + moment(assignment.metadata.dueDate).fromNow()}
                                </span>
                              )}
                            </li>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                              <Calendar className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-md mb-2 font-medium">No upcoming assignments</h3>
                            <p className="max-w-sm text-sm text-gray-500">
                              When assignments are added, they'll appear here so you can stay on track.
                            </p>
                          </div>
                        )}
                      </ul>

                      {selectedAssignment && (
                        <DialogRoot
                          open={!!selectedAssignment}
                          onOpenChange={prev => {
                            if (!prev) setSelectedAssignment(null)
                          }}
                          titleClassName="text-start w-full"
                          titleChildren={selectedAssignmentMetadata?.title}
                          descriptionClassName="text-start w-full"
                          descriptionChildren={
                            <div className="flex items-center text-sm">
                              <span className="text-sm font-medium">
                                Due: {moment(selectedAssignmentMetadata?.dueDate).fromNow()}
                              </span>
                              {selectedAssignmentMetadata?.points && (
                                <span className="ml-2">• {selectedAssignmentMetadata.points} Points</span>
                              )}
                            </div>
                          }
                          triggerClassName="w-full"
                          component={() => (
                            <div className="flex flex-col gap-4">
                              <div className="space-y-4">
                                {selectedAssignment.description && (
                                  <div>
                                    <h4 className="mb-1 text-sm font-medium">Description</h4>
                                    <p className="text-sm">{selectedAssignment.description}</p>
                                  </div>
                                )}

                                {selectedAssignment?.fileIds && selectedAssignment.fileIds.length > 0 && (
                                  <div>
                                    <h4 className="mb-2 text-sm font-medium">Attachments</h4>
                                    <div className="space-y-2">
                                      {selectedAssignment.fileIds.map((fileId: string) => (
                                        <a
                                          key={fileId}
                                          href={`/api/files/${fileId}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                                        >
                                          <FileText className="mr-2 h-4 w-4 text-gray-500" />
                                          <div className="flex-1">
                                            <p className="truncate text-sm font-medium">{fileId}</p>
                                            <p className="text-xs text-gray-500">{fileId}</p>
                                          </div>
                                          <Badge variant="outline" className="ml-2">
                                            View
                                          </Badge>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <Button variant="outline" className="w-max" onClick={() => setSelectedAssignment(null)}>
                                  Close
                                </Button>
                              </div>
                            </div>
                          )}
                        />
                      )}
                    </>
                  }
                  footerChildren={
                    <DialogRoot
                      titleClassName="text-start w-full"
                      titleChildren="Add Assignment"
                      descriptionClassName="text-start w-full"
                      descriptionChildren="Create a new assignment for your class"
                      triggerClassName="w-full"
                      triggerChildren={
                        <Button variant="ghost" size="sm" className="w-full">
                          <Plus size={16} />
                          <span className="text-sm font-semibold">Add Assignment</span>
                        </Button>
                      }
                      component={() => <CreateAssignment classroomId={classroom.id} />}
                    />
                  }
                />

                <CardRoot
                  titleChildren={<div className="text-2xl font-semibold">Classmates</div>}
                  contentChildren={
                    <ul className="space-y-4">
                      {members.slice(0, 5).map(({ avatar, accountId, accountName, isOwner }) => (
                        <li key={accountId} className="flex items-center gap-3 rounded-md hover:bg-gray-50">
                          <AvatarRoot
                            className="size-8 rounded-full"
                            imageSrc={avatar}
                            imageAlt={accountName}
                            imageWidth={40}
                            imageHeight={40}
                          />

                          <div className="flex flex-1 flex-col gap-1">
                            <p className="font-medium">{accountName}</p>
                            <Badge variant={isOwner ? "default" : "outline"} className="mt-1 text-xs">
                              {isOwner ? "Admin" : "Member"}
                            </Badge>
                          </div>
                        </li>
                      ))}

                      <li className="flex w-full items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            router.push(`/dashboard/classrooms/${classroom.id}/members`)
                          }}
                        >
                          <span className="text-sm font-semibold">View All Members ({members.length})</span>
                        </Button>
                      </li>
                    </ul>
                  }
                />
              </div>
            </div>
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

                    <div className="flex justify-end">
                      <Button
                        disabled={!isOwner || isUpdatingClassroom}
                        type="submit"
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm font-semibold">Save Changes</span>
                        {isUpdatingClassroom && <Spinner size={20} />}
                      </Button>
                    </div>
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
