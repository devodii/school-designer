import { educationLevelEnum } from "@/db/schema/account"
import { z } from "zod"

export interface FileWithPreview extends File {
  preview: string
}

export const onboardingSchema = z.object({
  fullName: z.string({ message: "This is a required field" }).min(3).max(20),
  educationLevel: z.enum(educationLevelEnum.enumValues),
  schoolName: z.string(),
  referralCode: z.string(),
  picture: z.custom<FileWithPreview>(val => val instanceof File && "preview" in val),
})

export type OnboardingSchema = z.infer<typeof onboardingSchema>
