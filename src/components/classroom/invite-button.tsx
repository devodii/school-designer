"use client"

import { Button } from "@/components/ui/button"
import { tryCatch } from "@/lib/try-catch"
import { UsersRound } from "lucide-react"
import { toast } from "sonner"

export function InviteButton({ shareLink }: { shareLink: string }) {
  return (
    <Button
      variant="outline"
      className="gap-1"
      onClick={async () => {
        const { error } = await tryCatch(navigator.clipboard.writeText(shareLink))
        if (error) return toast.error("Failed to copy link")
        toast.success("Link copied to clipboard")
      }}
    >
      <UsersRound className="size-4" />
      <span className="text-sm">Invite Students</span>
    </Button>
  )
}
