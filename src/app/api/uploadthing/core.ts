import { findAccountById } from "@/actions/account"
import { postUploads } from "@/actions/file-upload"
import { getSession } from "@/actions/session"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

const uploadthingMiddleware = async () => {
  const session = await getSession()

  if (!session) throw new Error("Unauthorized")

  const account = await findAccountById(session.accountId)

  if (!account) throw new Error("Invalid account")

  return { accountId: account.id }
}

export const ourFileRouter = {
  profilePic: f(["image/png", "image/jpeg", "image/webp"])
    .middleware(uploadthingMiddleware)
    .onUploadComplete(async ({ file }) => {
      const [response] = await postUploads({
        data: [{ url: file.ufsUrl, type: "IMAGE", metadata: { scope: "ACCOUNT_PROFILE" } }],
      })

      return response
    }),
  timetable: f(["application/pdf", "pdf"])
    .middleware(uploadthingMiddleware)
    .onUploadComplete(async ({ file }) => {
      const [response] = await postUploads({
        data: [{ url: file.ufsUrl, type: "PDF", metadata: { scope: "TIMETABLE" } }],
      })

      return response
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
