"use client"

import { useState } from "react"

import { updateAccount } from "@/actions/account"
import { addClassroomMember, createClassroomEvent } from "@/actions/classroom"
import { getSession } from "@/actions/session"
import { FileUploader } from "@/components/file-uploader"
import { MultiStepForm, Step, StepComponentProps } from "@/components/multi-step-form"
import { SelectableCard } from "@/components/selectable-card"
import { Spinner } from "@/components/spinner"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useFileUpload } from "@/hooks/use-file-upload"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { GraduationCap, School } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Controller, useForm, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { HIGH_SCHOOL_SUBJECTS, UNIVERSITY_SUBJECTS } from "~/constants/subjects"

const onboardingSchema = z.object({
  username: z.string({ message: "This is a required field" }).min(3).max(20),
  education_level: z.enum(["HIGH SCHOOL", "COLLEGE"]),
  school_name: z.string(),
  subjects: z.array(z.string()).min(1),
  referral_code: z.string().optional(),
  photos: z.array(z.string()),
})

type OnboardingSchema = z.infer<typeof onboardingSchema>

const UsernameStep = ({ onNext }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("username")
        if (valid) onNext()
      }}
      className="mx-auto flex w-full max-w-lg flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="username"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="What is your name?"
            inputValue={field.value}
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputName={field.name}
            errorText={error?.message}
          />
        )}
      />

      <Button type="submit">Next</Button>
    </form>
  )
}

const SchoolNameStep = ({ onNext, onBack }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("school_name")
        if (valid) onNext()
      }}
      className="mx-auto flex w-full max-w-lg flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="school_name"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="What school do you attend?"
            inputValue={field.value}
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputName={field.name}
            errorText={error?.message}
          />
        )}
      />

      <div className="flex w-full items-center gap-4">
        <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
          Back
        </Button>
        <Button className="flex-1" type="submit">
          Next
        </Button>
      </div>
    </form>
  )
}

const EducationLevelStep = ({ onNext, onBack }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("education_level")
        if (valid) onNext()
      }}
      className="mx-auto flex w-full max-w-lg flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="education_level"
        render={({ field, fieldState: { error } }) => {
          const options = [
            { value: "HIGH SCHOOL", title: "High School", description: "I'm a high school student", icon: School },
            { value: "COLLEGE", title: "College", description: "I'm a college student", icon: GraduationCap },
          ]
          return (
            <>
              <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {options.map(option => (
                  <SelectableCard
                    type="button"
                    key={option.value}
                    titleText={option.title}
                    descriptionText={option.description}
                    icon={option.icon}
                    titleClassName="text-lg font-semibold"
                    isSelected={field.value === option.value}
                    onClick={() => field.onChange(option.value)}
                  />
                ))}
              </div>
              {error?.message && <p className="text-red-500">{error.message}</p>}
            </>
          )
        }}
      />

      <div className="flex w-full items-center gap-4">
        <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
          Back
        </Button>
        <Button className="flex-1" type="submit">
          Next
        </Button>
      </div>
    </form>
  )
}

const SubjectsStep = ({ onNext, onBack }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()

  const subjects = form.watch("education_level") === "HIGH SCHOOL" ? HIGH_SCHOOL_SUBJECTS : UNIVERSITY_SUBJECTS

  type Subject = (typeof subjects)[number]

  const selectedSubjects = form.watch("subjects") as string[]

  const toggleSubject = (subject: Subject) => {
    const current = selectedSubjects
    const updated = current.includes(subject.name)
      ? current.filter(s => s !== subject.name)
      : [...current, subject.name]
    form.setValue("subjects", updated)
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("subjects")
        if (valid) onNext()
      }}
      className="mx-auto flex w-full max-w-3xl flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="subjects"
        render={() => {
          return (
            <div className="flex w-full flex-col gap-4 overflow-y-auto">
              <Label>Select your area of focus</Label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => {
                  const isSelected = selectedSubjects?.includes(subject.name)
                  return (
                    <button
                      key={subject.name}
                      type="button"
                      onClick={() => toggleSubject(subject)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-1 transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-500 text-white shadow"
                          : "border-border bg-white text-black hover:bg-blue-50"
                      } `}
                    >
                      <span className="text-sm">
                        {subject.emoji} {subject.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }}
      />

      <div className="mx-auto flex w-full max-w-xl items-center gap-4">
        <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
          Back
        </Button>
        <Button className="flex-1" type="submit">
          Next
        </Button>
      </div>
    </form>
  )
}

const ReferralCodeStep = ({ onNext, onBack }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("referral_code")
        if (valid) onNext()
      }}
      className="mx-auto flex w-full max-w-lg flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="referral_code"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="Customize your referral code"
            inputValue={field.value}
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputName={field.name}
            errorText={error?.message}
            defaultValue="re_je8ud90m3c"
          />
        )}
      />

      <div className="flex w-full items-center gap-4">
        <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
          Back
        </Button>
        <Button className="flex-1" type="submit">
          Next
        </Button>
      </div>
    </form>
  )
}

const PhotoUrlsStep = ({ onBack }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()
  const searchParams = useSearchParams()
  const router = useRouter()

  const roomCode = searchParams.get("room_code")

  const { onUpload, progresses, isUploading } = useFileUpload("image", { defaultUploadedFiles: [] }, error =>
    toast.error(error),
  )

  const { mutate: updateAccountMutation, isPending: isUpdatingAccount } = useMutation({
    mutationFn: async (values: OnboardingSchema) => {
      console.log({ values })

      const session = await getSession()

      if (!session) throw new Error("Unauthorized")

      await updateAccount(session.accountId, {
        level: values.education_level,
        referral_code: values.referral_code,
        profile: { fullName: values.username, subjectsOffered: values.subjects, pictures: values.photos, userName: "" },
        isOnboarded: true,
      })

      if (roomCode) {
        const response = await addClassroomMember(roomCode)

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
      if ("classroomId" in response) router.push(`/dashboard/classrooms/${response.classroomId}?first`)
      else router.push("/dashboard")
    },
    onError: () => toast.error("Sorry, something went wrong"),
  })

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("photos")
        const formData = form.getValues() as OnboardingSchema
        console.log({ formData })
        if (valid) updateAccountMutation(formData)
      }}
      className="mx-auto flex w-full max-w-lg flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="photos"
        render={({ field, fieldState: { error } }) => {
          return (
            <div className="flex w-full flex-col gap-2">
              <Label>Upload up to 5 photos of yourself</Label>
              <FileUploader
                accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"], "image/webp": [".webp"] }}
                maxFileCount={5}
                maxSize={1024 * 1024 * 1} // 1MB
                progresses={progresses}
                onUpload={async files => {
                  const response = await onUpload(files)
                  if (!response) return
                  field.onChange((prev: string[]) => [...prev, ...response])
                }}
                disabled={isUploading}
              />
              {error?.message && <p className="text-red-500">{error.message}</p>}
            </div>
          )
        }}
      />

      <div className="flex w-full flex-col items-center gap-4 md:flex-row">
        <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
          Back
        </Button>
        <Button className="flex-1" type="submit" disabled={isUpdatingAccount}>
          {isUpdatingAccount ? "Please wait ..." : "Next"}
          {isUpdatingAccount && <Spinner size={24} />}
        </Button>
      </div>
    </form>
  )
}

export const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { subjects: [], photos: [] },
  })

  const onboardingSteps = [
    { key: "username", component: UsernameStep },
    { key: "education_level", component: EducationLevelStep },
    { key: "school_name", component: SchoolNameStep },
    { key: "subjects", component: SubjectsStep },
    { key: "referral_code", component: ReferralCodeStep },
    { key: "photo_urls", component: PhotoUrlsStep },
  ] as Step<OnboardingSchema>[]

  return (
    <MultiStepForm
      form={form}
      currentStep={currentStep}
      steps={onboardingSteps}
      onStepSubmit={() => setCurrentStep(prev => prev + 1)}
      onStepBack={() => setCurrentStep(prev => prev - 1)}
      onComplete={async data => console.log({ data })}
    />
  )
}
