"use client"

import { ReactNode, useState } from "react"

import { tryCatch } from "@/lib/try-catch"
import { DialogRoot } from "@components/dialog-root"
import { TextField } from "@components/text-field"
import { Button } from "@components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface ShareClassroomLinkProps {
  trigger: ReactNode
  shareLink: string
}

export const ShareClassroomLink = ({ trigger, shareLink }: ShareClassroomLinkProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyLink = async () => {
    const { error } = await tryCatch(navigator.clipboard.writeText(shareLink))
    if (error) return toast.error("Failed to copy link")
    toast.success("Link copied to clipboard")
  }

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={setIsOpen}
      titleClassName="text-lg font-semibold"
      titleChildren="Invite Students"
      descriptionClassName="text-sm text-muted-foreground"
      descriptionChildren="Share this link with your friends"
      triggerAsChild
      triggerChildren={trigger}
      component={() => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <TextField
              id="link"
              labelText="Link"
              labelClassName="sr-only"
              inputReadOnly
              inputDefaultValue={shareLink}
            />

            <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
              <span className="sr-only">Copy</span>
              <Copy />
            </Button>
          </div>
        </div>
      )}
    />
  )
}
