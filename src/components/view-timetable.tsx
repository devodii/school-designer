"use client"

import { useMemo, useState } from "react"

import { updateTimetable } from "@/actions/timetable"
import { CanvasTrigger } from "@/components/canvas-trigger"
import { DialogRoot } from "@/components/dialog-root"
import { Spinner } from "@/components/spinner"
import { TableRoot } from "@/components/table-root"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Timetable } from "@/db/schema/timetable"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { Eye, Trash } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { mockTimetables, VIEW_TIMETABLE_CANVAS_NAME } from "~/constants/timetables"

const columnHelper = createColumnHelper<Timetable>()

const defaultColumns = [
  columnHelper.accessor("name", {
    header: () => <Label className="text-md font-semibold">Name</Label>,
    cell: info => info.getValue() as string,
  }),
  columnHelper.accessor("createdAt", {
    header: () => <Label className="text-md font-semibold">Uploaded At</Label>,
    cell: info => {
      const value = info.getValue()
      return value instanceof Date ? value.toLocaleDateString() : value
    },
  }),
  columnHelper.accessor("description", {
    header: () => <Label className="text-md font-semibold">Description</Label>,
    cell: info => info.getValue() as string,
  }),
]

const deleteTimetableSchema = z.object({
  name: z.string(),
})

type DeleteTimetableForm = z.infer<typeof deleteTimetableSchema>

export const ViewTimetable = () => {
  const [timetable, setTimetable] = useState(mockTimetables)
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null)

  const deleteForm = useForm<DeleteTimetableForm>({ resolver: zodResolver(deleteTimetableSchema) })

  const queryClient = useQueryClient()

  const { mutate: handleTimetableDelete, isPending: isDeletingTimetable } = useMutation({
    mutationFn: async (dto: { id: string; name: string }) => {
      console.log({ dto, formName: deleteForm.watch("name") })
      if (dto.name !== deleteForm.watch("name")) {
        deleteForm.setError("name", { message: "Name must be a match" })
        return false
      }

      await updateTimetable(dto.id, { deletedAt: new Date() })

      setTimetable(timetable.filter(t => t.id !== dto.id))
      return true
    },

    onSuccess: res => {
      if (res) {
        setSelectedTimetable(null)
        toast.success("Timetable deleted successfully")
        queryClient.invalidateQueries({ queryKey: ["timetables"] })
      }
    },
    onError: () => {
      setSelectedTimetable(null)
      toast.error("Failed to delete timetable")
    },
  })

  const columns = useMemo(() => {
    return [
      ...defaultColumns,
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Trash onClick={() => setSelectedTimetable(row.original)} className="size-4 cursor-pointer" />

              <CanvasTrigger
                canvasId={VIEW_TIMETABLE_CANVAS_NAME}
                canvasOptions={{
                  content: <div>Timetable view</div>,
                  id: VIEW_TIMETABLE_CANVAS_NAME,
                  position: "right",
                  pushElementId: "__canvas-push-element",
                  width: "400px",
                }}
                triggerChildren={<Eye className="size-4 cursor-pointer" />}
              />
            </div>
          )
        },
      }),
    ]
  }, [defaultColumns])

  return (
    <>
      <TableRoot data={timetable} columns={columns as any} />
      {selectedTimetable && (
        <DialogRoot
          open={!!selectedTimetable}
          onOpenChange={open => {
            if (!open) setSelectedTimetable(null)
          }}
          titleChildren="Confirm Timetable Deletion"
          component={() => {
            const { name, id } = selectedTimetable

            return (
              <form
                onSubmit={deleteForm.handleSubmit(() => handleTimetableDelete({ id, name }))}
                className="flex flex-col items-center gap-4"
              >
                <Controller
                  control={deleteForm.control}
                  name="name"
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      id="name"
                      labelText="Name"
                      inputPlaceholder={`Type ${selectedTimetable.name} to confirm`}
                      inputValue={field.value}
                      inputOnChange={field.onChange}
                      inputOnBlur={field.onBlur}
                      errorText={error?.message}
                    />
                  )}
                />

                <div className="flex w-full items-center justify-end gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setSelectedTimetable(null)}>
                    <span className="text-sm font-semibold">Cancel</span>
                  </Button>

                  <Button type="submit" size="sm" className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Delete</span>
                    {isDeletingTimetable && <Spinner size={20} />}
                  </Button>
                </div>
              </form>
            )
          }}
        />
      )}
    </>
  )
}
