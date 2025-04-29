import * as React from "react"

import { type OurFileRouter } from "@/app/api/uploadthing/core"
import { uploadFiles } from "@/lib/uploadthing"
import type { AnyFileRoute, UploadFilesOptions } from "uploadthing/types"
import { type ClientUploadedFileData } from "uploadthing/types"
import { Response } from "~/typescript"

interface UseFileUploadOptions<TFileRoute extends AnyFileRoute>
  extends Pick<UploadFilesOptions<TFileRoute>, "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"> {
  defaultUploadedFiles?: ClientUploadedFileData<unknown>[]
}

export function useFileUpload(
  endpoint: keyof OurFileRouter,
  forwardedProps: UseFileUploadOptions<OurFileRouter[keyof OurFileRouter]> = {},
  onUploadError: (error: string) => void,
) {
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadResult, setUploadResult] = React.useState<Response<{ url: string; id: string }> | null>(null)

  async function onUpload(files: File[]) {
    setIsUploading(true)
    try {
      const res = await uploadFiles(endpoint, {
        ...forwardedProps,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses(prev => {
            return {
              ...prev,
              [file.name]: progress,
            }
          })
        },
      })

      setUploadResult({ success: true, data: { url: res[0].serverData.url, id: res[0].serverData.id } })
    } catch (err: unknown) {
      if (err instanceof Error) {
        onUploadError(err.message)
      } else {
        onUploadError("Something went wrong")
      }
    } finally {
      setProgresses({})
      setIsUploading(false)
    }
  }

  return {
    onUpload,
    progresses,
    isUploading,
    uploadResult,
  }
}
