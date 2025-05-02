"use client"

import { useEffect, useState } from "react"

import { QuizResponse } from "@/interfaces/chat"
import { cn } from "@/lib/tw-merge"
import { CheckboxRoot } from "@components/checkbox-root"
import { QuizResults } from "@components/quiz-results"
import { RadioGroupRoot } from "@components/radio-group-root"
import { Spinner } from "@components/spinner"
import { Button } from "@components/ui/button"
import { Clock } from "lucide-react"
import moment from "moment"
import { Controller, useForm } from "react-hook-form"

interface QuizFormProps {
  quiz: QuizResponse["quiz"]
}

interface QuizAnswers {
  [key: string]: string
}

export const QuizForm = ({ quiz }: QuizFormProps) => {
  const form = useForm<QuizAnswers>({ defaultValues: {} })
  const [timeRemaining, setTimeRemaining] = useState(quiz.estimatedTime)
  const [submitted, setSubmitted] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (_data: QuizAnswers) => {
    if (submitting) return

    setSubmitting(true)

    setTimeout(() => {
      setSubmitted(true)
      setSubmitting(false)
    }, 2000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev < 1) {
          handleSubmit(form.getValues())
          clearInterval(interval)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  if (submitted) {
    return <QuizResults quiz={quiz} userAnswers={form.getValues()} score={0} />
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{quiz.title}</h2>
        <p className="text-muted-foreground text-sm">{quiz.description}</p>

        <div className="bg-accent flex items-center justify-between rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span className={cn("text-muted-foreground text-sm", timeRemaining < 60 && "text-red-500")}>
              Time remaining
            </span>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            {moment.utc(timeRemaining * 1000).format("mm:ss")}
          </div>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-4">
        {quiz.questions.map((question, index) => (
          <li key={index} className="grid gap-1">
            <h3 className="text-lg font-normal">{question.question}</h3>

            {question.type === "multiple_choice" && (
              <Controller
                control={form.control}
                name={question.question}
                render={({ field }) => (
                  <div className="grid gap-2">
                    {question.options.map((option, index) => (
                      <CheckboxRoot
                        checkboxOnChange={field.onChange}
                        checkboxValue={field.value}
                        checkboxName={field.name}
                        key={index}
                        id={option}
                        labelText={option}
                        labelOnClick={e => {
                          console.log("clicked")
                          e.stopPropagation()
                          const checkboxElement = document.getElementById(option) as HTMLInputElement
                          checkboxElement?.click()
                        }}
                      />
                    ))}
                  </div>
                )}
              />
            )}

            {question.type === "single_choice" && (
              <Controller
                control={form.control}
                name={question.question}
                render={({ field }) => (
                  <RadioGroupRoot
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    key={question.question}
                    id={question.question}
                    data={question.options.map(option => ({ value: option, label: option }))}
                  />
                )}
              />
            )}
          </li>
        ))}

        <Button type="submit" className="mt-4 flex w-full items-center gap-2">
          <span className="text-sm">{submitting ? "Submitting..." : "Submit Quiz"}</span>
          {submitting && <Spinner size={20} />}
        </Button>
      </ul>
    </form>
  )
}
