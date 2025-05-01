"use client"

import { ChatMessageTag, TaggedChatResponse } from "@/interfaces/chat"
import { cn } from "@/lib/tw-merge"
import { BlurImage } from "@components/blur-image"
import { DialogRoot } from "@components/dialog-root"
import { Button } from "@components/ui/button"
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

  console.log({ content, recommendation, explanation, summary, quiz })

  return (
    <li className={cn("flex w-full flex-col gap-2", persona === "user" ? "items-end" : "items-start")}>
      <Image src={image} alt={name} width={32} height={32} className="size-5 rounded-full" />
      <div
        className={cn(
          "flex w-fit max-w-[80%] flex-col gap-2 rounded-xl px-3 py-1",
          persona == "user" ? "bg-black text-white" : "bg-gray-100 text-black",
        )}
      >
        {tag && (
          <span className="inline-flex w-max items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800">
            {tag}
          </span>
        )}

        <div>{content}</div>
      </div>

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
    </li>
  )
}
