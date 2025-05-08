"use client"

import { useEffect, useState } from "react"

import { MultiStepForm, Step } from "@/components/multi-step-form"
import { onboardingSchema, OnboardingSchema } from "@/components/onboarding/schema"
import { Step1 } from "@/components/onboarding/step1"
import { Step2 } from "@/components/onboarding/step2"
import { Step3 } from "@/components/onboarding/step3"
import { Step4 } from "@/components/onboarding/step4"
import { Step5 } from "@/components/onboarding/step5"
import { getAccount } from "@/queries/account"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

export const OnboardingForm = () => {
  const { data: account } = useQuery(getAccount())
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<OnboardingSchema>({ resolver: zodResolver(onboardingSchema) })

  useEffect(() => {
    if (account?.referralCode) form.setValue("referralCode", account.referralCode)
  }, [account])

  const onboardingSteps = [
    { key: "fullName", component: Step1 },
    { key: "educationLevel", component: Step2 },
    { key: "schoolName", component: Step3 },
    { key: "referralCode", component: Step4 },
    { key: "picture", component: Step5 },
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
