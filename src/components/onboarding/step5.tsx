import { createProfile, findAccountById, updateAccount } from "@/actions/account"
import { generateEmbedding } from "@/actions/ai/openai"
import { addClassroomMember, createClassroomEvent } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { StepComponentProps } from "@/components/multi-step-form"
import { OnboardingSchema } from "@/components/onboarding/schema"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useFileUpload } from "@/hooks/use-file-upload"
import { cn } from "@/lib/tw-merge"
import { FileWithPreview } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { Camera, Upload, User } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Controller, useFormContext } from "react-hook-form"
import { toast } from "sonner"

interface Step5Props extends StepComponentProps<OnboardingSchema> {}

export const Step5 = ({ onBack }: Step5Props) => {
  const form = useFormContext()
  const searchParams = useSearchParams()
  const router = useRouter()

  const roomCode = searchParams.get("room_code")

  const { onUpload } = useFileUpload("image", { defaultUploadedFiles: [] }, error => toast.error(error))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    form.setError("picture", { message: "" })

    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const fileWithPreview = Object.assign(file, { preview: reader.result as string })
        form.setValue("picture", fileWithPreview)
      }
      reader.readAsDataURL(file)
    }
  }

  const { mutate: updateAccountMutation, isPending: isUpdatingAccount } = useMutation({
    mutationFn: async (values: OnboardingSchema) => {
      const session = await getSession()

      if (!session) throw new Error("Unauthorized")

      const account = await findAccountById(session.accountId)

      if (!account) throw new Error("Invalid account")

      const response = await onUpload([values.picture])

      if (!response) throw new Error("Failed to upload picture")

      const { schoolName, referralCode, educationLevel, fullName } = values

      /**
       * Creates an embedding for the account based on the school name and education level
       */
      const embedding = await generateEmbedding(JSON.stringify({ schoolName, educationLevel }))

      await Promise.all([
        updateAccount(session.accountId, { educationLevel, referralCode, isOnboarded: true, embedding }),
        createProfile(session.accountId, { fullName, pictureUrl: response[0], schoolName }),
      ])

      if (roomCode) {
        const response = await addClassroomMember(roomCode, account.id)

        await createClassroomEvent({
          classroomId: response.classroomId,
          accountId: session.accountId,
          description: "Joined classroom",
          fileIds: null,
          metadata: { tag: "NEW_MEMBER" },
        })

        return response
      }

      return { success: true }
    },
    onSuccess: response => {
      toast.success("Profile updated successfully")
      if ("classroomId" in response) router.push(`/dashboard/classrooms/${response.classroomId}?first_time=true`)
      else router.push("/dashboard")
    },
    onError: () => toast.error("Sorry, something went wrong"),
  })

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Add Your Picture</h1>
        <p className="text-muted-foreground">This will be used to identify you in the app and in your classroom.</p>
      </div>

      <form
        onSubmit={async e => {
          e.preventDefault()
          const valid = await form.trigger("picture")
          const formData = form.getValues() as OnboardingSchema
          if (valid) updateAccountMutation(formData)
        }}
        className="mx-auto flex w-full max-w-lg flex-col gap-10"
      >
        <Controller
          control={form.control}
          name="picture"
          render={({ field, fieldState: { error } }) => {
            const file = field.value as FileWithPreview
            const previewUrl = file?.preview

            return (
              <div className="flex w-full flex-col items-center space-y-6">
                <div className="relative">
                  {file && (
                    <Image
                      src={previewUrl}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-full border-2 border-gray-200"
                    />
                  )}
                  {!file && <User className="h-16 w-16 text-gray-400" />}
                </div>

                <div className="w-full">
                  <Label
                    htmlFor="photo-upload"
                    className={cn(
                      "block w-full cursor-pointer rounded-lg border-2 border-dashed px-4 py-3 text-center transition-colors",
                      field.value ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {file ? (
                        <>
                          <Camera className="h-6 w-6 text-green-500" />
                          <span className="text-sm text-gray-600">Change photo</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-gray-500" />
                          <span className="text-sm text-gray-600">Choose a profile photo</span>
                          <span className="text-xs text-gray-400">JPG, PNG, or GIF up to 2MB</span>
                        </>
                      )}
                    </div>
                  </Label>
                  <input
                    id="photo-upload"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {error && <span className="text-sm text-red-500">{error.message}</span>}
                </div>
              </div>
            )
          }}
        />

        <div className="flex w-full flex-col items-center gap-4 md:flex-row">
          <Button
            disabled={isUpdatingAccount}
            className="flex-1"
            type="button"
            variant="outline"
            onClick={() => onBack()}
          >
            Back
          </Button>
          <Button disabled={isUpdatingAccount} className="flex-1" type="submit">
            <span className="text-sm font-semibold">Complete Setup</span>
            {isUpdatingAccount && <Spinner size={16} />}
          </Button>
        </div>
      </form>
    </div>
  )
}
