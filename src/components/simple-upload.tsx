"use client"

import { ComponentProps, useRef, useState } from "react"

import { Spinner } from "@/components/spinner"
import { Input, InputProps } from "@/components/ui/input"
import { useFileUpload } from "@/hooks/use-file-upload"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import { Upload } from "lucide-react"
import { toast } from "sonner"

type FileWithId = File & { id: string }

interface SimpleUploadProps
  extends MixinProps<"container", ComponentProps<"div">>,
    MixinProps<"trigger", ComponentProps<"button">>,
    MixinProps<"input", InputProps>,
    MixinProps<"file", ComponentProps<"span">>,
    MixinProps<"icon", ComponentProps<"svg">> {
  onChangeFiles: (files: FileWithId[]) => void
}

export const SimpleUpload = ({ onChangeFiles, ...mixinProps }: SimpleUploadProps) => {
  const { container, trigger, file, input, icon } = splitProps(
    mixinProps,
    "container",
    "trigger",
    "file",
    "input",
    "icon",
  )

  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleTrigger = () => {
    inputRef.current?.click()
  }

  const { onUpload, isUploading, uploadResult } = useFileUpload("timetable", { defaultUploadedFiles: [] }, error =>
    toast.error(error),
  )

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      await onUpload([selected])
      if (uploadResult?.success) {
        setFiles(prev => prev.filter(file => file.name !== selected.name))
        setTimeout(() => onChangeFiles(files.map(file => ({ ...file, id: uploadResult?.data.id }))), 100)
      }
    }
  }

  return (
    <div className={cn("flex items-center gap-2", container.className)} {...container}>
      <button
        {...trigger}
        type="button"
        onClick={handleTrigger}
        className={cn("cursor-pointer", trigger.className)}
        aria-label="Upload file"
      >
        <Upload className={cn("size-5", icon.className)} {...icon} />
      </button>

      <Input {...input} ref={inputRef} type="file" className="hidden" onChange={handleChange} />

      {isUploading && <Spinner size={20} />}

      <ul className="flex flex-wrap gap-2">
        {files.map(({ name }) => (
          <li
            key={name}
            className={cn("bg-muted inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", file.className)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
