"use client"

import { TableRoot } from "@/components/table-root"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ClassroomMemberAccount } from "@/db/schema/classroom"
import { createColumnHelper } from "@tanstack/react-table"

const columnHelper = createColumnHelper<ClassroomMemberAccount>()

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: info => info.getValue() as string,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: info => info.getValue() as string,
  }),
  columnHelper.display({
    id: "isOwner",
    header: "Role",
    cell: ({ row }) => {
      const isOwner = row.original.isOwner

      if (isOwner) return <Badge variant="outline">Owner</Badge>

      return <Badge variant="outline">Member</Badge>
    },
  }),
  columnHelper.accessor("joined", {
    header: "Joined",
    cell: info => {
      const value = info.getValue()
      return value instanceof Date ? value.toLocaleDateString() : value
    },
  }),
]

interface ClassroomMembersProps {
  members: ClassroomMemberAccount[]
}

export const ClassroomMembers = ({ members }: ClassroomMembersProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="Search members" />

      <TableRoot columns={columns as any} data={members} />
    </div>
  )
}
