"use client"

import { useState } from "react"

import { useFileUpload } from "@/hooks/use-file-upload"
import { FileUploader } from "@components/file-uploader"
import { MultiStepForm, Step, StepComponentProps } from "@components/multi-step-form"
import { SelectField } from "@components/select-field"
import { TextField } from "@components/text-field"
import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
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
  photo_urls: z.array(z.string()).optional(),
})

type OnboardingSchema = z.infer<typeof onboardingSchema>

const UsernameStep = ({ onNext }: StepComponentProps) => {
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

const ClassroomCodeStep = ({ onNext, onBack }: StepComponentProps) => {
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

const SchoolNameStep = ({ onNext, onBack }: StepComponentProps) => {
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

const EducationLevelStep = ({ onNext, onBack }: StepComponentProps) => {
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
        render={({ field }) => {
          return (
            <div className="flex flex-col gap-2">
              <Label>What's your level of education?</Label>
              <SelectField
                triggerClassName="w-[250px]"
                items={[
                  { label: "High School", value: "HIGH SCHOOL" },
                  { label: "College", value: "COLLEGE" },
                ]}
                onValueChange={value => field.onChange(value)}
              />
            </div>
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

const SubjectsStep = ({ onNext, onBack }: StepComponentProps) => {
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <Controller
        control={form.control}
        name="subjects"
        render={() => {
          return (
            <form
              onSubmit={async e => {
                e.preventDefault()
                const valid = await form.trigger("subjects")
                if (valid) onNext()
              }}
              className="flex w-full flex-col gap-4 overflow-y-auto"
            >
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
            </form>
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
    </div>
  )
}

const ReferralCodeStep = ({ onNext, onBack }: StepComponentProps) => {
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

const PhotoUrlsStep = ({ onNext, onBack }: StepComponentProps) => {
  const form = useFormContext()

  const { onUpload, progresses, isUploading, uploadResult } = useFileUpload(
    "image",
    { defaultUploadedFiles: [] },
    error => toast.error(error),
  )

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        const valid = await form.trigger("photo_urls")
        if (valid) onNext()
      }}
      className="mx-auto flex w-full max-w-lg flex-col gap-10"
    >
      <Controller
        control={form.control}
        name="photo_urls"
        render={() => {
          return (
            <div className="flex w-full flex-col gap-2">
              <Label>Upload up to 5 photos of yourself</Label>
              <FileUploader
                accept={{ "image/*": ["image/png", "image/jpeg", "image/webp"] }}
                maxFileCount={5}
                maxSize={1024 * 1024 * 1} // 1MB
                progresses={progresses}
                onUpload={onUpload}
                disabled={isUploading}
              />
            </div>
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

export const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { subjects: [] },
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
