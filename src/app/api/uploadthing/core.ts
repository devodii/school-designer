import { postUploads } from "@/actions/file-upload"
import { getSession } from "@/actions/session"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const uploadthingMiddleware = async () => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  return session
}

export const ourFileRouter = {
  image: f(["image/png", "image/jpeg", "image/webp"])
    .middleware(uploadthingMiddleware)
    .onUploadError(async ({ error }) => {
      console.log({ error })
    })
    .onUploadComplete(async ({ file, metadata: { accountId } }) => {
      return await postUploads({
        accountId,
        url: file.ufsUrl,
        type: "IMAGE",
        metadata: { scope: "ACCOUNT_PROFILE" },
      })
    }),
  pdf: f(["application/pdf", "pdf"])
    .middleware(uploadthingMiddleware)
    .onUploadComplete(async ({ file, metadata: { accountId } }) => {
      return await postUploads({
        accountId,
        url: file.ufsUrl,
        type: "PDF",
        metadata: { scope: "TIMETABLE" },
      })
    }),

  "*": f(["image/png", "image/jpeg", "image/webp", "application/pdf", "pdf"])
    .middleware(uploadthingMiddleware)
    .onUploadComplete(async ({ file, metadata: { accountId } }) => {
      return await postUploads({
        accountId,
        url: file.ufsUrl,
        type: "PDF",
        metadata: { scope: "TIMETABLE" },
      })
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
