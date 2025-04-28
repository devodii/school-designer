import { postUploads } from "@/actions/file-upload"
import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  image: f(["image/png", "image/jpeg", "image/webp"])
    .middleware(async ({ req }) => {
      const accountId = req.headers.get("x-account-id") as string
      return { accountId }
    })
    .onUploadComplete(
      async ({
        file,
        metadata: { accountId },
      }): Promise<{ success: true; data: { id: string; url: string } } | { success: false; error: string }> => {
        console.log({ file })

        return { success: true, data: { url: file.ufsUrl, id: file.key } }

        // const response = await postUploads({ accountId, data: [{ url: file.ufsUrl, type: "IMAGE" }] })

        // console.log({ response })
        // if (!response.success) return { success: false, error: response.error }

        // return { success: true, data: { url: file.ufsUrl, id: response.data[0].id } }
      },
    ),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
