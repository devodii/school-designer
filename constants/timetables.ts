import { Timetable } from "@/db/schema/timetable"

export const CREATE_TIMETABLE_CANVAS_NAME = "create-timetable"
export const VIEW_TIMETABLE_CANVAS_NAME = "view-timetable"

export const mockTimetables: Timetable[] = [
  {
    id: "tt-001",
    name: "Fall Semester 2025",
    fileIds: ["file-001"],
    description: "Main schedule for Fall 2025",
    createdAt: new Date("2025-03-15T10:30:00Z"),
    updatedAt: new Date("2025-03-15T10:30:00Z"),
    deletedAt: null,
    accountId: "acc-123",
  },
  {
    id: "tt-002",
    name: "Spring Classes 2026",
    fileIds: ["file-002"],
    description: "Updated spring schedule with lab hours",
    createdAt: new Date("2025-11-20T14:15:00Z"),
    updatedAt: new Date("2025-11-20T14:15:00Z"),
    deletedAt: null,
    accountId: "acc-123",
  },
  {
    id: "tt-003",
    name: "Summer Workshop Schedule",
    fileIds: ["file-003"],
    description: "Intensive summer workshops",
    createdAt: new Date("2026-01-05T09:45:00Z"),
    updatedAt: new Date("2026-01-05T09:45:00Z"),
    deletedAt: null,
    accountId: "acc-123",
  },
]
