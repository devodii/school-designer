import { findAccountById } from "@/actions/account"
import { getSession } from "@/actions/session"
import { getAccountTimetables } from "@/actions/timetable"

export const getAccount = () => ({
  queryKey: ["timetables"],
  queryFn: async () => {
    const timetables = await getAccountTimetables()

    return timetables
  },
})
