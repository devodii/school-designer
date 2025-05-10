import { updateProfile } from "@/actions/account"
import { AvatarRoot } from "@/components/avatar-root"
import { CardRoot } from "@/components/card-root"
import { TabsRoot } from "@/components/tabs-root"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useUrlState } from "@/hooks/use-url-state"
import { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface AccountSettingsProps {
  profileId: string
  email: string
  fullName: string
  pictureUrl: string
}

const updateProfileSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  pictureUrl: z.string().min(1),
  picture: z.custom<FileWithPreview>(val => val instanceof File && "preview" in val),
})

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

export const AccountSettings = ({ profileId, email, fullName, pictureUrl }: AccountSettingsProps) => {
  const { set } = useUrlState()
  const { onUpload } = useFileUpload("image", { defaultUploadedFiles: [] }, error => toast.error(error))
  const searchParams = useSearchParams()

  const profileForm = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { email, fullName, pictureUrl },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const fileWithPreview = Object.assign(file, { preview: reader.result as string })
        profileForm.setValue("picture", fileWithPreview)
      }
      reader.readAsDataURL(file)
    }
  }

  const { mutate: saveProfile } = useMutation({
    mutationFn: async (values: UpdateProfileSchema) => {
      const { picture, ...rest } = values

      const upload = await onUpload([picture])

      if (!upload) throw new Error("Failed to upload picture")

      const response = await updateProfile(profileId, { ...rest, pictureUrl: upload[0] })

      return response
    },
  })

  const defaultTab = useMemo(() => {
    return searchParams.get("tab") || "profile"
  }, [searchParams])

  return (
    <TabsRoot
      defaultValue={defaultTab}
      onValueChange={value => set([{ name: "tab", value }])}
      data={[
        {
          value: "profile",
          label: () => <div>Profile</div>,
          component: () => (
            <CardRoot
              className="w-full shadow-md"
              titleChildren="Profile Information"
              descriptionChildren="Update your profile information visible to other users"
              contentChildren={
                <form onSubmit={profileForm.handleSubmit(data => saveProfile(data))} className="space-y-6">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <AvatarRoot className="size-24" imageSrc={pictureUrl} fallbackChildren={fullName.charAt(0)} />

                    <div>
                      <Label htmlFor="picture" className="cursor-pointer rounded-md bg-gray-100 px-3 py-1 text-sm">
                        Change Photo
                      </Label>
                      <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <Controller
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          labelText="Display Name"
                          inputValue={field.value}
                          inputOnChange={field.onChange}
                        />
                      )}
                    />

                    <Controller
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <TextField
                          id={field.name}
                          labelText="Email"
                          inputValue={field.value}
                          inputDisabled
                          errorText="Email cannot be changed. Contact support if needed."
                          errorClassName="text-muted-foreground"
                        />
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                      Save Changes
                    </Button>
                  </div>
                </form>
              }
            />
          ),
        },
        {
          label: () => <div>Account</div>,
          component: () => (
            <CardRoot
              className="w-full shadow-md"
              titleChildren="Account Settings"
              descriptionChildren="Manage your account settings and preferences"
              contentChildren={<div>Account settings content would go here</div>}
            />
          ),
          value: "account",
        },
      ]}
    />
  )
}
