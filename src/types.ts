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

export type ClassroomActivityMetadata = { content: string; description: string }
