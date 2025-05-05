"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { tryCatch } from "@/lib/try-catch"
import { cn } from "@/lib/tw-merge"
import { toast } from "sonner"

interface InviteButtonProps extends Omit<ButtonProps, "onClick"> {
  shareLink: string
}

export function InviteButton({ shareLink, ...forwardedProps }: InviteButtonProps) {
  return (
    <Button
      className={cn("cursor-pointer gap-1", forwardedProps.className)}
      onClick={async () => {
        const { error } = await tryCatch(navigator.clipboard.writeText(shareLink))
        if (error) return toast.error("Failed to copy link")
        toast.success("Link copied to clipboard")
      }}
      {...forwardedProps}
    />
  )
}
