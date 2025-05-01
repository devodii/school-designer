import { QuizResponse } from "@/interfaces/chat"

interface QuizResultsProps {
  quiz: QuizResponse["quiz"]
  userAnswers: Record<string, string>
  score: number
}

export const QuizResults = ({ quiz, userAnswers, score }: QuizResultsProps) => {
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
                <div className="text-red-500">
                  Your answer: {userAnswers[question.question] ? userAnswers[question.question] : "Not answered"}
                </div>
                {question.type === "multiple_choice" && (
                  <div className="text-green-500">Correct answer: {question.correctOptions.join(", ")}</div>
                )}
                {question.type === "single_choice" && (
                  <div className="text-green-500">Correct answer: {question.correctAnswer}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
