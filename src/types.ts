export interface AccountProfile {
  fullName: string
  userName: string
  subjectsOffered: string[]
  pictures: { id: string; url: string }[]
}

// Auth

export type AuthIntent = "SIGN_IN" | "SIGN_UP"

export interface AuthMetadata {
  intent: AuthIntent
}

// Payments

export interface SubscriptionMetadata {
  provider: "POLAR"
}

export interface CheckoutSessionMetadata {
  intent: string
}

// Classroom

export type ClassroomActivityNoteMetadata = {
  type: "NOTE"
  content: { title: string; notes: string; chapterReference?: string }
}

export type ClassroomActivityPlanMetadata = {
  type: "STUDY_PLAN"
  content: { title: string; description: string; date?: string; steps: string[] }
}

export type ClassroomActivityHomeworkMetadata = {
  type: "HOMEWORK"
  content: { title: string; description: string; dueDate: Date; answers: string[] }
}

export type ClassroomActivityQuestionMetadata = {
  type: "QUESTION"
  content: { title: string; description: string }
}

export type ClassroomActivityAnnouncementMetadata = {
  type: "ANNOUNCEMENT"
  content: { title: string; description: string; isImportant: boolean }
}

export type ClassroomActivityResourceMetadata = {
  type: "RESOURCE"
  content: {
    title: string
    description: string
    url: string
    fileType: "link" | "document" | "presentation" | "image" | "other"
  }
}

export type ClassroomActivityMetadata =
  | ClassroomActivityNoteMetadata
  | ClassroomActivityPlanMetadata
  | ClassroomActivityHomeworkMetadata
  | ClassroomActivityQuestionMetadata
  | ClassroomActivityAnnouncementMetadata
  | ClassroomActivityResourceMetadata
