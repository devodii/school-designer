import { ClassroomActivityType } from "./db/schema/classroom"

export interface AccountProfile {
  fullName: string
  userName: string
  subjectsOffered: string[]
  pictures: string[]
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

export type NewMemberClassroomEventMetadata = {}

export type NewActivityClassroomEventMetadata = { content: string; description: string; tag: ClassroomActivityType }

export type ClassroomEventMetadata = NewMemberClassroomEventMetadata | NewActivityClassroomEventMetadata
