"use client"

import { useState } from "react"

import { useFileUpload } from "@/hooks/use-file-upload"
import { SelectField } from "@components/select-field"
import { TextField } from "@components/text-field"
import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { HIGH_SCHOOL_SUBJECTS, UNIVERSITY_SUBJECTS } from "~/constants/subjects"

import { FileUploader } from "./file-uploader"

const onboardingSchema = z.object({
  username: z.string().min(3).max(20),
  classroom_code: z.string().optional(),
  education_level: z.enum(["HIGH SCHOOL", "COLLEDGE"]),
  school_name: z.string(),
  subjects: z.array(z.string()).min(1),
  referral_code: z.string().optional(),
  photo_urls: z.array(z.string()).optional(),
})

type OnboardingSchema = z.infer<typeof onboardingSchema>

type OnboardingFieldKey = keyof OnboardingSchema

export function OnboardingForm() {
  const [step, setStep] = useState<OnboardingFieldKey>("username")
  const form = useForm<OnboardingSchema>({
    resolver: zodResolver(onboardingSchema),
  })

  const nextStep = () => {
    switch (step) {
      case "username":
        setStep("classroom_code")
        break
      case "classroom_code":
        setStep("education_level")
        break
      case "education_level":
        setStep("school_name")
        break
      case "school_name":
        setStep("subjects")
        break
      case "subjects":
        setStep("referral_code")
        break
      case "referral_code":
        setStep("photo_urls")
        break
    }
  }

  const onSubmit = async (data: OnboardingSchema) => {
    if (step !== "photo_urls") {
      nextStep()
      return
    }
    // Submit final form
    console.log(data)
  }

  let subjects: { name: string; emoji: string }[] = []
  if (step === "education_level") {
    subjects = form.watch("education_level") === "HIGH SCHOOL" ? HIGH_SCHOOL_SUBJECTS : UNIVERSITY_SUBJECTS
  }

  const selectedSubjects = form.watch("subjects")

  const toggleSubject = (subject: string) => {
    const current = selectedSubjects
    const updated = current.includes(subject) ? current.filter(s => s !== subject) : [...current, subject]
    form.setValue("subjects", updated)
  }

  const { onUpload, progresses, isUploading, uploadResult } = useFileUpload(
    "image",
    { defaultUploadedFiles: [] },
    error => toast.error(error),
  )

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          {step === "username" && (
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
          )}

          {step === "classroom_code" && (
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
          )}

          {step === "school_name" && (
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
          )}

          {step === "education_level" && (
            <Controller
              control={form.control}
              name="education_level"
              render={() => {
                return (
                  <div className="flex flex-col gap-2">
                    <Label>What's your level of education?</Label>
                    <SelectField
                      items={[
                        { label: "High School", value: "HIGH SCHOOL" },
                        { label: "College", value: "COLLEGE" },
                      ]}
                    />
                  </div>
                )
              }}
            />
          )}
          {step === "subjects" && (
            <Controller
              control={form.control}
              name="subjects"
              render={() => {
                return (
                  <div className="flex flex-col gap-2">
                    <Label>Select your area of focus</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {subjects.map(subject => (
                        <button
                          key={subject.name}
                          type="button"
                          onClick={() => toggleSubject(subject.name)}
                          className={`flex items-center gap-2 rounded-lg border p-3 transition ${
                            selectedSubjects.includes(subject.name) ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <span className="text-2xl">{subject.emoji}</span>
                          <span>{subject.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          )}

          {step === "referral_code" && (
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
          )}

          {step == "photo_urls" && (
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
          )}
        </motion.div>

        <Button type="submit" className="w-full">
          {step === "photo_urls" ? "Complete Setup" : "Next"}
        </Button>
      </form>
    </FormProvider>
  )
}
