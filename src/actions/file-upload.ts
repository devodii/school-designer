"use server"

import { findUserById } from "@/actions/account"
import db from "@/db"
import { FileUploadSchema, fileUploadSchema, FileUploadType } from "@/db/schema/file-upload"
import { tryCatch } from "@/lib/try-catch"
import { nanoid } from "nanoid"

interface PostUploadsDto {
  accountId: string
  data: Array<{ url: string; type: FileUploadType }>
}

type PostUploadsResponse = { success: true; data: Array<FileUploadSchema> } | { success: false; error: string }

export const postUploads = async (dto: PostUploadsDto): Promise<PostUploadsResponse> => {
  const account = await findUserById(dto.accountId)

  if (!account) return { success: false, error: "Invalid account" }

  const { data, error } = await tryCatch(
    db.insert(fileUploadSchema).values(
      dto.data.map(d => ({
        accountId: dto.accountId,
        id: `fu_${nanoid(25)}`,
        url: d.url,
        type: d.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { SCOPE: "PROFILE" } as const,
      })),
    ),
  )

  if (error) return { success: false, error: "Database operation failed" }

  return { success: true, data }
}
