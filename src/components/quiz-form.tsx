import { useState } from "react"

import { QuizResponse } from "@/interfaces/chat"
import { Controller, useForm } from "react-hook-form"

import { CheckboxRoot } from "./checkbox-root"
import { RadioGroupRoot } from "./radio-group-root"
import { TextField } from "./text-field"

interface QuizFormProps {
  quiz: QuizResponse["quiz"]
  onSubmit: (answers: Record<string, string | string[]>) => void
}

interface QuizAnswers {
  [key: string]: string
}

export const QuizForm = ({ quiz, onSubmit }: QuizFormProps) => {
  const form = useForm<QuizAnswers>({ defaultValues: {} })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{quiz.topic}</h2>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>Total Points: {quiz.totalPoints}</span>
          <span>•</span>
          <span>Estimated Time: {quiz.estimatedTime}</span>
        </div>
      </div>

      {quiz.questions.map((question, index) => (
        <div key={index} className="mt-4 grid gap-1">
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
                    />
                  ))}
                </div>
              )}
            />
          )}

          {question.type === "true_false" && (
            <Controller
              control={form.control}
              name={question.question}
              render={({ field }) => (
                <RadioGroupRoot
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  key={question.question}
                  id={question.question}
                  data={[
                    { value: "true", label: "True" },
                    { value: "false", label: "False" },
                  ]}
                />
              )}
            />
          )}

          {question.type === "short_answer" && (
            <Controller
              control={form.control}
              name={question.question}
              render={({ field }) => (
                <TextField
                  labelText=""
                  id={question.question}
                  key={question.question}
                  inputPlaceholder="Enter your answer here"
                  inputOnChange={field.onChange}
                  inputValue={field.value}
                  inputName={field.name}
                  inputOnBlur={field.onBlur}
                />
              )}
            />
          )}
        </div>
      ))}
    </form>
  )
}
