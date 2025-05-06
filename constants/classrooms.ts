import { ClassroomActivitySchema, ClassroomSchema } from "@/db/schema/classroom"
import { QuizResponse } from "@/interfaces/chat"

export const CREATE_CLASSROOM_CANVAS_NAME = "create-classroom"

export const mockClassrooms = [
  {
    id: "1",
    name: "SAT Bootcamp",
    backgroundImage: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&q=80&w=800",
    members: [
      { id: "c1", name: "Harry Potter", avartar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: "c2", name: "Hermione Granger", avartar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: "c3", name: "Ron Weasley", avartar: "https://randomuser.me/api/portraits/men/46.jpg" },
    ],
    isJoined: true,
  },
  {
    id: "2",
    name: "Dream Uni Prep",
    backgroundImage: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=800",
    members: [
      { id: "c7", name: "Draco Malfoy", avartar: "https://randomuser.me/api/portraits/men/22.jpg" },
      { id: "c8", name: "Pansy Parkinson", avartar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: "c9", name: "Blaise Zabini", avartar: "https://randomuser.me/api/portraits/men/46.jpg" },
      { id: "c10", name: "Theodore Nott", avartar: "https://randomuser.me/api/portraits/men/46.jpg" },
    ],
    isJoined: true,
  },
  {
    id: "3",
    name: "Potions 101",
    backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    members: [
      { id: "c11", name: "Cedric Diggory", avartar: "https://randomuser.me/api/portraits/men/62.jpg" },
      { id: "c12", name: "Cho Chang", avartar: "https://randomuser.me/api/portraits/women/52.jpg" },
      { id: "c13", name: "Marietta Edgecombe", avartar: "https://randomuser.me/api/portraits/women/52.jpg" },
    ],
    isJoined: false,
  },
  {
    id: "4",
    name: "Defense Against Dark Arts",
    backgroundImage: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&q=80&w=800",
    members: [
      { id: "c14", name: "Fred Weasley", avartar: "https://randomuser.me/api/portraits/men/82.jpg" },
      { id: "c15", name: "George Weasley", avartar: "https://randomuser.me/api/portraits/men/82.jpg" },
      { id: "c16", name: "Lee Jordan", avartar: "https://randomuser.me/api/portraits/men/82.jpg" },
      { id: "c17", name: "Angelina Johnson", avartar: "https://randomuser.me/api/portraits/women/32.jpg" },
      { id: "c18", name: "Katie Bell", avartar: "https://randomuser.me/api/portraits/women/72.jpg" },
      { id: "c19", name: "Alicia Spinnet", avartar: "https://randomuser.me/api/portraits/women/32.jpg" },
      { id: "c20", name: "Oliver Wood", avartar: "https://randomuser.me/api/portraits/men/12.jpg" },
    ],
    isJoined: true,
  },
  {
    id: "5",
    name: "Astronomy Night Class",
    backgroundImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=800",
    members: [
      { id: "c21", name: "Susan Bones", avartar: "https://randomuser.me/api/portraits/women/32.jpg" },
      { id: "c22", name: "Hannah Abbott", avartar: "https://randomuser.me/api/portraits/women/72.jpg" },
      { id: "c23", name: "Justin Finch-Fletchley", avartar: "https://randomuser.me/api/portraits/men/12.jpg" },
      { id: "c24", name: "Ernie Macmillan", avartar: "https://randomuser.me/api/portraits/men/12.jpg" },
    ],
    isJoined: true,
  },
]

export const mockAssignments = [
  { id: "001", title: "Math Homework", dueDate: "Due Tuesday" },
  { id: "002", title: "Book Report", dueDate: "Due Wednesday" },
]

export const mockDocuments = [
  { id: 1, title: "Study Guide", type: "PDF" },
  { id: 2, title: "Lecture Notes", type: "Word" },
  { id: 3, title: "Practice Questions", type: "PDF" },
]

export const mockActivities: ClassroomActivitySchema[] = [
  {
    id: "001",
    accountId: "10",
    classroomId: "1212",
    createdAt: new Date(),
    type: "NOTE",
    metadata: {
      content: "Chapter 1",
      description: "Added notes for Chapter 1",
    },
  },
  {
    id: "002",
    accountId: "10",
    classroomId: "1212",
    createdAt: new Date(),
    type: "PLAN",
    metadata: {
      description: "Study plan for the finals",
      content: "Study Chapter 1",
    },
  },
  {
    id: "003",
    accountId: "10",
    classroomId: "1212",
    createdAt: new Date(),
    type: "HOMEWORK",
    metadata: {
      content: "Chemistry Homework",
      description: "Answers to Chapter 2",
    },
  },
  {
    id: "005",
    accountId: "10",
    classroomId: "1212",
    createdAt: new Date(),
    type: "HOMEWORK",
    metadata: {
      content: "Chemistry Homework",
      description: "Answers to Chapter 2",
    },
  },
]

export const mockClassmates = [
  { id: "001", name: "Chloe", avartar: "https://randomuser.me/api/portraits/women/32.jpg", role: "Admin" },
  { id: "002", name: "Ethan", avartar: "https://randomuser.me/api/portraits/men/44.jpg", role: "Member" },
  { id: "003", name: "Maya", avartar: "https://randomuser.me/api/portraits/women/52.jpg", role: "Member" },
  { id: "004", name: "Jacob", avartar: "https://randomuser.me/api/portraits/men/62.jpg", role: "Member" },
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
