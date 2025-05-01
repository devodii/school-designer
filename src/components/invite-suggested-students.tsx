"use client"

import { useState } from "react"

import { Combobox } from "@/components/combobox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { toast } from "sonner"
import { mockSuggestedStudents } from "~/constants/classrooms"

export const InviteSuggestedStudents = () => {
  const [selected, setSelected] = useState<{ label: string; value: string }[]>([])

  const handleSendInvites = () => {
    if (selected.length === 0) return toast.error("Please select at least one student")
    toast.success("Invites sent")
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {selected.map(({ label, value }) => (
          <Badge variant="outline" key={value} className="flex items-center gap-2">
            <span className="text-xs">{label}</span>
            <button
              onClick={() => setSelected(prev => prev.filter(student => student.value !== value))}
              className="rounded-full p-0"
            >
              <X className="size-4 cursor-pointer" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex w-full items-center gap-2">
        <Combobox
          selected={selected}
          commandOptions={[{ heading: "Suggested Students", items: mockSuggestedStudents }]}
          commandOptionOnSelect={value => {
            const selectedOption = mockSuggestedStudents.find(student => student.value === value)
            if (selectedOption) setSelected(prev => [...prev, selectedOption])
          }}
          commandInputPlaceholder="Search for students"
          triggerChildren={<Button variant="outline">Invite Students</Button>}
          triggerClassName="w-full flex-1"
          contentAlign="start"
          triggerAsChild
          contentClassName="w-[500px]"
          commandClassName="w-full"
          commandOptionClassName="cursor-pointer"
          commandEmptyChildren={<div className="text-muted-foreground font-semibold">No students found</div>}
        />
        <Button onClick={handleSendInvites}>Send invites</Button>
      </div>
    </div>
  )
}
