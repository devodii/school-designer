import { findAccountById } from "@/actions/account"
import { postUploads } from "@/actions/file-upload"
import { getSession } from "@/actions/session"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  image: f(["image/png", "image/jpeg", "image/webp"])
    .middleware(async () => {
      const session = await getSession()

      if (!session) throw new Error("Unauthorized")

      const account = await findAccountById(session.accountId)

      if (!account) throw new Error("Invalid account")

      return { accountId: account.id }
    })
    .onUploadComplete(async ({ file }) => {
      console.log({ file })

      const [response] = await postUploads({
        data: [{ url: file.ufsUrl, type: "IMAGE", metadata: { scope: "PROFILE" } }],
      })

      return response
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
