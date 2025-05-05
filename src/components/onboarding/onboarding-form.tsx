"use client"

import { useState } from "react"

import { updateAccount } from "@/actions/account"
import { getSession } from "@/actions/session"
import { FileUploader } from "@/components/file-uploader"
import { MultiStepForm, Step, StepComponentProps } from "@/components/multi-step-form"
import { SelectRoot } from "@/components/select-root"
import { Spinner } from "@/components/spinner"
import { TextField } from "@/components/text-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useFileUpload } from "@/hooks/use-file-upload"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm, useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { HIGH_SCHOOL_SUBJECTS, UNIVERSITY_SUBJECTS } from "~/constants/subjects"

const onboardingSchema = z.object({
  username: z.string({ message: "This is a required field" }).min(3).max(20),
  classroom_code: z.string().optional(),
  education_level: z.enum(["HIGH SCHOOL", "COLLEGE"]),
  school_name: z.string(),
  subjects: z.array(z.string()).min(1),
  referral_code: z.string().optional(),
  photos: z.array(z.object({ id: z.string(), url: z.string() })),
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

const ClassroomCodeStep = ({ onNext, onBack }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("classroom_code")
        if (valid) onNext()
      }}
      className="mx-auto flex w-full max-w-lg flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="classroom_code"
        render={({ field, fieldState: { error } }) => (
          <TextField
            id={field.name}
            labelText="Enter your classroom code (if you were invited)"
            inputValue={field.value}
            inputOnChange={field.onChange}
            inputOnBlur={field.onBlur}
            inputName={field.name}
            errorText={error?.message}
          />
        )}
      />

      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-4">
          <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
            Back
          </Button>
          <Button className="flex-1" type="submit">
            Next
          </Button>
        </div>

        <Button className="flex-1" type="button" variant="outline" onClick={() => onNext()}>
          Skip
        </Button>
      </div>
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
          return (
            <SelectRoot
              labelText="What's your level of education?"
              triggerClassName="w-[250px]"
              items={[
                { label: "High School", value: "HIGH SCHOOL" },
                { label: "College", value: "COLLEGE" },
              ]}
              value={field.value}
              onValueChange={value => field.onChange(value)}
              name={field.name}
              errorText={error?.message}
            />
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

const PhotoUrlsStep = ({ onNext, onBack }: StepComponentProps<OnboardingSchema>) => {
  const form = useFormContext()

  const { onUpload, progresses, isUploading } = useFileUpload("profilePic", { defaultUploadedFiles: [] }, error =>
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
    },
  })

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("photos")
        if (valid) updateAccountMutation(onNext())
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
                  await onUpload(files)
                  field.onChange(files)
                }}
                disabled={isUploading}
              />
              {error?.message && <p className="text-red-500">{error.message}</p>}
            </div>
          )
        }}
      />

      <div className="flex w-full items-center gap-4">
        <Button className="flex-1" type="button" variant="outline" onClick={() => onBack()}>
          Back
        </Button>
        <Button className="flex-1" type="submit" disabled={isUpdatingAccount}>
          {isUpdatingAccount ? "Uploading..." : "Next"}
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
    { key: "classroom_code", component: ClassroomCodeStep },
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
