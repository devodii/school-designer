"use client"

import { CanvasTrigger } from "@/components/canvas-trigger"
import { QuizForm } from "@/components/quiz-form"
import { useCanvas } from "@/context/canvas"
import { ChatMessageTag, TaggedChatResponse } from "@/interfaces/chat"
import { cn } from "@/lib/tw-merge"
import { BlurImage } from "@components/blur-image"
import { CardRoot } from "@components/card-root"
import { DialogRoot } from "@components/dialog-root"
import { Button } from "@components/ui/button"
import { ArrowLeft, Timer } from "lucide-react"
import Image from "next/image"

export type ChatMessagePersona = "user" | "ai"

export type Message = {
  persona: ChatMessagePersona
  name: string
  image: string
  timestamp: number
  id: string
  content: string | null
  tag: ChatMessageTag | null
}

interface ChatMessageProps {
  structuredResponse: TaggedChatResponse | null
  dto: Message
}

export const ChatMessage = ({ dto: { persona, name, image, content, tag }, structuredResponse }: ChatMessageProps) => {
  const recommendation =
    structuredResponse && "recommendation" in structuredResponse ? structuredResponse.recommendation : null
  const explanation = structuredResponse && "explanation" in structuredResponse ? structuredResponse.explanation : null
  const summary = structuredResponse && "summary" in structuredResponse ? structuredResponse.summary : null
  const quiz = structuredResponse && "quiz" in structuredResponse ? structuredResponse.quiz : null

  const { closeCanvas } = useCanvas()

  return (
    <li className={cn("flex w-full flex-col gap-2", persona === "user" ? "items-end" : "items-start")}>
      <Image src={image} alt={name} width={32} height={32} className="size-5 rounded-full" />
      <div
        className={cn(
          "flex w-fit max-w-4/5 flex-col gap-2 rounded-xl px-3 py-1",
          persona == "user" ? "bg-black text-white" : "bg-gray-100 text-black",
        )}
      >
        {tag && (
          <span className="inline-flex w-max items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800">
            {tag}
          </span>
        )}
        <div className="text-sm">{content}</div>

        {recommendation && (
          <DialogRoot
            triggerChildren={
              <div className="mt-1 flex cursor-pointer items-center rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50">
                <BlurImage
                  width={50}
                  height={50}
                  src={recommendation.picture}
                  alt={recommendation.fullName}
                  className="mr-3 size-10 rounded-full"
                />
                <div className="flex flex-1 flex-col items-start gap-0">
                  <div className="font-medium text-black">{recommendation.fullName}</div>
                  <div className="text-xs text-gray-500">{recommendation.userName}</div>
                </div>
              </div>
            }
            title="Student Profile"
            description="More information about the student"
            contentChildren={
              <div className="flex flex-col items-center py-4">
                <Image
                  width={50}
                  height={50}
                  src={recommendation.picture}
                  alt={recommendation.fullName}
                  className="mr-3 size-10 rounded-full"
                />
                <h3 className="text-xl font-medium">{recommendation.fullName}</h3>
                <p className="text-gray-500">@{recommendation.userName}</p>

                <div className="mt-6 w-full space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Recent Activity</h4>
                    <div className="mt-1 space-y-2">
                      <div className="rounded-md bg-gray-50 p-2 text-sm">
                        Submitted assignment "Chemistry Lab Report" 2 days ago
                      </div>
                      <div className="rounded-md bg-gray-50 p-2 text-sm">
                        Asked a question in "Biology 101" 3 days ago
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="mt-6 w-full">Send Message</Button>
              </div>
            }
          />
        )}

        {quiz && (
          <CardRoot
            className="w-full border pt-2 pb-0"
            titleChildren={
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[15px] font-semibold">{quiz.title}</h4>
                <div className="flex items-center gap-1">
                  <Timer className="text-muted-foreground size-4" />
                  <span className="text-muted-foreground min-w-max text-sm">{quiz.estimatedTime} minutes</span>
                </div>
              </div>
            }
            titleClassName="text-lg font-semibold px-4 py-1"
            cardHeaderClassname="p-0"
            descriptionChildren={quiz.description}
            descriptionClassName="text-muted-foreground px-4 py-1 text-sm text-start"
            contentClassName="p-0 w-full"
            contentChildren={
              <div className="flex w-full flex-col gap-2 px-4">
                <div className="text-muted-foreground text-start text-sm">{quiz.questions.length} questions</div>

                <div className="bg-accent w-full rounded-lg p-2 text-sm">{quiz.questions[0].question}</div>

                <CanvasTrigger
                  triggerAsChild
                  triggerChildren={<Button className="w-full">Attempt Quiz</Button>}
                  canvasId="quiz"
                  canvasOptions={{
                    content: (
                      <QuizForm
                        quiz={quiz}
                        headerChildren={
                          <Button
                            variant="outline"
                            className="rounded-full"
                            size="icon"
                            onClick={() => closeCanvas("quiz")}
                          >
                            <ArrowLeft className="size-4" />
                          </Button>
                        }
                      />
                    ),
                    width: "400px",
                    position: "right",
                    id: "quiz",
                    pushElementId: "__dashboard-layout-container",
                    wrapperClassName: "h-full p-4",
                  }}
                />
              </div>
            }
          />
        )}
      </div>
    </li>
  )
}
