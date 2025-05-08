import { QuizResponse } from "@/interfaces/chat"

export const mockAssignments = [
  { id: "001", title: "Math Homework", dueDate: "Due Tuesday" },
  { id: "002", title: "Book Report", dueDate: "Due Wednesday" },
]

export const mockQuiz: QuizResponse["quiz"] = {
  id: "qu_1odunec",
  title: "Current Affairs",
  description: "Test your knowledge of current affairs",
  questions: [
    {
      question: "What is the capital of France?",
      type: "single_choice",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      question: "What states are in Nigeria?",
      type: "multiple_choice",
      options: ["Lagos", "Abuja", "Mississippi", "New York"],
      correctOptions: ["Lagos", "Abuja"],
    },
    {
      question: "What is the capital of Nigeria?",
      type: "single_choice",
      options: ["Lagos", "Abuja", "Mississippi", "New York"],
      correctAnswer: "Abuja",
    },
    {
      question: "Who is the current president of Nigeria?",
      type: "single_choice",
      options: ["Bola Tinubu", "Atiku Abubakar", "Peter Obi", "Yemi Osinbajo"],
      correctAnswer: "Bola Tinubu",
    },
  ],
  totalPoints: 60,
  estimatedTime: 60 * 10, // 10 minutes
}
