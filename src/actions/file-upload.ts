"use server"

import { findAccountById } from "@/actions/account"
import db from "@/db"
import { FileMetadata, fileUploadSchema, FileUploadType } from "@/db/schema/file-upload"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"

export const postUploads = async (dto: {
  accountId: string
  url: string
  type: FileUploadType
  metadata?: FileMetadata
}) => {
  const { accountId, ...file } = dto

  const account = await findAccountById(accountId)

  if (!account) throw new Error("Invalid account")

  const { data, error } = await tryCatch(
    db
      .insert(fileUploadSchema)
      .values({ ...file, accountId: account.id })
      .returning({
        id: fileUploadSchema.id,
        url: fileUploadSchema.url,
      }),
  )

  if (error) throw new Error("Failed to save uploaded files")

  return data[0]
}

export const getFileById = async (id: string) => {
  const { data, error } = await tryCatch(db.select().from(fileUploadSchema).where(eq(fileUploadSchema.id, id)))

  if (error) throw new Error("Failed to get file")

  return data[0]
}
