"use client"

import { useEffect, useState, ComponentPropsWithoutRef } from "react"

import { CheckboxRoot } from "@/components/checkbox-root"
import { RadioGroupRoot } from "@/components/radio-group-root"
import { Spinner } from "@/components/spinner"
import { Button } from "@/components/ui/button"
import { QuizResponse } from "@/interfaces/chat"
import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import { snakeCase } from "lodash"
import { Clock, ArrowLeft } from "lucide-react"
import moment from "moment"
import { Controller, useForm } from "react-hook-form"

interface QuizAnswers {
  [key: string]: string
}

interface QuizFormProps extends MixinProps<"header", ComponentPropsWithoutRef<"header">> {
  quiz: QuizResponse["quiz"]
}

export const QuizForm = ({ quiz, ...mixinProps }: QuizFormProps) => {
  const { header } = splitProps(mixinProps, "header")
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
    }, 500)
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

    if (submitted) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [timeRemaining, form.getValues, handleSubmit, submitted])

  if (submitted) {
    return (
      <div className="flex flex-col gap-4">
        <header className="w-full">
          <Button
            variant="outline"
            className="rounded-full"
            size="icon"
            onClick={() => {
              setSubmitted(false)
              form.reset()
            }}
          >
            <ArrowLeft className="size-4" />
          </Button>
        </header>
        <QuizResults quiz={quiz} userAnswers={form.getValues()} score={0} />{" "}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="w-full" {...header} />
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
                          checkboxOnCheckedChange={checked => {
                            const value: string[] = (field.value as unknown as string[]) || []

                            if (checked) {
                              field.onChange([...value, option])
                            } else {
                              field.onChange(value.filter((v: string) => v !== option))
                            }
                          }}
                          checkboxValue={field.value}
                          checkboxName={field.name}
                          key={index}
                          id={snakeCase(`${question.question}-${index}-${option}`)}
                          labelText={option}
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
                      data={question.options.map((option, index) => ({
                        value: option,
                        label: option,
                        id: snakeCase(`${question.question}-${index}-${option}`),
                      }))}
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
    </div>
  )
}

interface QuizResultProps {
  quiz: QuizResponse["quiz"]
  score: number
  userAnswers: Record<string, string | string[]>
}

const QuizResults = ({ quiz, score, userAnswers }: QuizResultProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-primary/10 rounded-lg p-4">
        <h3 className="text-lg font-semibold">Quiz Results</h3>
        <p className="text-2xl font-bold">
          Score: {score}/{quiz.totalPoints}
        </p>
      </div>

      {quiz.questions.map((question, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span className="font-medium">Q{index + 1}.</span>
            <div className="flex flex-col gap-1">
              <span>{question.question}</span>
              <div className="text-sm">
                {(() => {
                  const userAnswer = userAnswers[question.question]
                  const isAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== ""
                  let isCorrect = false

                  if (question.type === "multiple_choice") {
                    const userArr = Array.isArray(userAnswer) ? userAnswer : []
                    const correctArr = question.correctOptions || []
                    isCorrect = userArr.length === correctArr.length && userArr.every(ans => correctArr.includes(ans))
                  } else if (question.type === "single_choice") {
                    isCorrect = userAnswer === question.correctAnswer
                  }

                  if (!isAnswered) {
                    return <div className="text-sm text-red-500">Not answered</div>
                  }

                  if (isCorrect) {
                    return <div className="text-sm font-semibold text-green-600">Correct!</div>
                  }

                  return (
                    <div className="text-sm">
                      <div className="text-red-500">
                        Your answer: {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer}
                      </div>
                      <div className="text-green-500">
                        Correct answer:{" "}
                        {question.type === "multiple_choice"
                          ? question.correctOptions.join(", ")
                          : question.correctAnswer}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
