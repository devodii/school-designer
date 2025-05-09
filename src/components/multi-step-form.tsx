"use client"

import { ComponentType, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form"

export interface StepComponentProps<T> {
  onNext: () => T
  onBack: () => void
  isLastStep: boolean
}

export interface Step<T extends FieldValues> {
  key: keyof T
  component: ComponentType<StepComponentProps<T>>
}

type Direction = "forward" | "back"

export interface MultiStepFormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  steps: Step<T>[]
  currentStep: number
  onStepSubmit: () => void
  onStepBack: () => void
  onComplete: (data: T) => void
}

export function MultiStepForm<T extends FieldValues>({
  form,
  steps,
  currentStep,
  onStepSubmit,
  onStepBack,
}: MultiStepFormProps<T>) {
  const [direction, setDirection] = useState<Direction>("forward")
  const CurrentStepComponent = steps[currentStep].component
  const isLastStep = currentStep === steps.length - 1

  const handleBack = () => {
    setDirection("back")
    onStepBack()
  }

  const handleNext = () => {
    setDirection("forward")
    onStepSubmit()
    return form.getValues()
  }

  const variants = {
    enter: (direction: Direction) => ({ x: direction === "forward" ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: Direction) => ({ x: direction === "forward" ? -40 : 40, opacity: 0 }),
  }

  return (
    <FormProvider {...form}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="px-4"
        >
          <CurrentStepComponent onNext={handleNext} onBack={handleBack} isLastStep={isLastStep} />
        </motion.div>
      </AnimatePresence>
    </FormProvider>
  )
}
