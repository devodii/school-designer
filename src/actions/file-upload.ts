import { findAccountById } from "@/actions/account"
import { getSession } from "@/actions/session"
import db from "@/db"
import { FileMetadata, FileUploadSchema, fileUploadSchema, FileUploadType } from "@/db/schema/file-upload"
import { tryCatch } from "@/lib/try-catch"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"

;("use server")

interface PostUploadsDto {
  data: Array<{ url: string; type: FileUploadType; metadata?: FileMetadata }>
}

export const postUploads = async (dto: PostUploadsDto) => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const account = await findAccountById(session.accountId)

  if (!account) throw new Error("Invalid account")

  const { data, error } = await tryCatch(
    db.insert(fileUploadSchema).values(
      dto.data.map(d => ({
        accountId: session.accountId,
        id: `fu_${nanoid(25)}`,
        url: d.url,
        type: d.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: d.metadata,
      })),
    ),
  )

  if (error) throw new Error("Failed to save uploaded files")

  return data.map((d: FileUploadSchema) => ({ id: d.id, url: d.url }))
}

export const getFileById = async (id: string) => {
  const { data, error } = await tryCatch(db.select().from(fileUploadSchema).where(eq(fileUploadSchema.id, id)))

  if (error) throw new Error("Failed to get file")

  return data[0]
}
