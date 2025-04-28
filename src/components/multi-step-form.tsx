"use client"

import { ComponentType } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form"

export interface StepComponentProps {
  onNext: () => void
  onBack: () => void
  isLastStep: boolean
}

export interface Step<T extends FieldValues> {
  key: keyof T
  component: ComponentType<StepComponentProps>
}

export interface MultiStepFormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  steps: Step<T>[]
  currentStep: number
  onStepSubmit: (data: Partial<T>) => void
  onStepBack: () => void
  onComplete: (data: T) => void
}

export function MultiStepForm<T extends FieldValues>({
  form,
  steps,
  currentStep,
  onStepSubmit,
  onComplete,
  onStepBack,
}: MultiStepFormProps<T>) {
  const CurrentStepComponent = steps[currentStep].component
  const isLastStep = currentStep === steps.length - 1

  const handleSubmit = async (data: T) => {
    if (!isLastStep) return onStepSubmit(data)
    onComplete(data)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <CurrentStepComponent
              onNext={() => onStepSubmit(form.getValues())}
              onBack={onStepBack}
              isLastStep={isLastStep}
            />
          </motion.div>
        </AnimatePresence>
      </form>
    </FormProvider>
  )
}
