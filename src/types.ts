import { ClassroomEventType } from "./db/schema/classroom"

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

export type NewMemberClassroomEventMetadata = {
  tag: "NEW_MEMBER"
}

export type AssignmentClassroomEventMetadata = {
  tag: "ASSIGNMENT"
  title: string
  description: string
  dueDate: Date
  points: number
}

export type OtherClassroomEventMetadata = { content: string; description: string; tag: ClassroomEventType }

export type ClassroomEventMetadata =
  | NewMemberClassroomEventMetadata
  | OtherClassroomEventMetadata
  | AssignmentClassroomEventMetadata
