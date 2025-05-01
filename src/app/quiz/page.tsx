"use client"

import { QuizForm } from "@/components/quiz-form"
import { mockQuiz } from "~/constants/classrooms"

export default function QuizTestPage() {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <h1 className="mb-8 text-2xl font-bold">Quiz Test Page</h1>

      <QuizForm quiz={mockQuiz} />
    </div>
  )
}
