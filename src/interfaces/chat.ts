export type ChatMessageTag = "@Recommendation" | "@Explain" | "@Summarize" | "@Quiz"

interface ChatMessageBaseResponse {
  tag: ChatMessageTag
}

export interface RecommendationResponse extends ChatMessageBaseResponse {
  tag: "@Recommendation"
  recommendation: { id: string; picture: string; fullName: string; userName: string }
}

export interface ExplanationResponse extends ChatMessageBaseResponse {
  tag: "@Explain"
  explanation: {
    mainConcept: string
    keyPoints: string[]
    examples: { problem: string; solution: string; explanation: string }[]
    visualAids?: { type: "diagram" | "formula" | "graph"; content: string }[]
    sources: { title: string; url: string }[]
  }
}

export interface SummaryResponse extends ChatMessageBaseResponse {
  tag: "@Summarize"
  summary: {
    mainPoints: string[]
    keyTerms: { term: string; definition: string }[]
    tldr: string
    originalLength: number
    summaryLength: number
  }
}

export interface QuizResponse extends ChatMessageBaseResponse {
  tag: "@Quiz"
  quiz: {
    id: string
    title: string
    description: string
    questions: Array<
      | { question: string; type: "multiple_choice"; options: string[]; correctOptions: string[] }
      | { question: string; type: "single_choice"; options: string[]; correctAnswer: string }
    >
    totalPoints: number
    estimatedTime: number
  }
}

export type TaggedChatResponse = RecommendationResponse | ExplanationResponse | SummaryResponse | QuizResponse
