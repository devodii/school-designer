import { getFileById } from "@/actions/file-upload"
import { useQuery } from "@tanstack/react-query"

export const useGetFileById = (id: string | null) => {
  return useQuery({ queryKey: ["file", id], queryFn: async () => await getFileById(id as string), enabled: !!id })
}
