"use client"

import { useState, useRef } from "react"

import { ChatMessage, Message } from "@/components/chat/chat-message"
import { ChatMessageSkeleton } from "@/components/chat/chat-message-skeleton"
import { ChatTagPicker } from "@/components/chat/chat-tag-picker"
import { ContentEditable, ContentEditableRef } from "@/components/contenteditable"
import { SimpleUpload } from "@/components/simple-upload"
import { Button } from "@/components/ui/button"
import { ChatMessageTag } from "@/interfaces/chat"
import { SendHorizontal } from "lucide-react"
import { nanoid } from "nanoid"
import { mockQuiz } from "~/constants/classrooms"

interface ChatWindowProps {}

export const ChatWindow = ({}: ChatWindowProps) => {
  const [selectedTag, setSelectedTag] = useState<ChatMessageTag | null>(null)
  const [tagPickerOpen, setTagPickerOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const contentEditableRef = useRef<ContentEditableRef>(null)

  const handleSendMessage = () => {
    if (!message.trim()) return

    setIsTyping(true)

    setMessages(prev => [
      ...prev,
      {
        id: `me_${nanoid(25)}`,
        content: message,
        persona: "user",
        name: "You",
        image: "https://randomuser.me/api/portraits/men/82.jpg",
        timestamp: Date.now(),
        tag: selectedTag,
      },
    ])
    setMessage("")
    setSelectedTag(null)

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `ai_${nanoid(25)}`,
          content: "Hello",
          persona: "ai",
          name: "AI",
          image: "https://randomuser.me/api/portraits/women/32.jpg",
          timestamp: Date.now(),
          tag: null,
        },
      ])
    }, 1000)

    setIsTyping(false)
  }

  const handleInsertTag = (tag: ChatMessageTag) => {
    contentEditableRef.current?.insertCustomElement(tag)
    setTagPickerOpen(false)
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-0 pt-4">
      <h4 className="w-full justify-center text-center text-lg font-semibold">AI Chat</h4>

      <div className="flex h-full w-full flex-col items-center justify-between">
        <div className="max-h-[calc(100vh-175px)] w-full flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map(message => (
            <div key={message.id} className="flex w-full flex-col gap-2">
              <ChatMessage
                structuredResponse={message.persona === "user" ? null : { tag: "@Quiz", quiz: mockQuiz }}
                dto={message}
              />
              {isTyping && <ChatMessageSkeleton />}
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-2 border-t bg-white px-2 py-4">
          <SimpleUpload
            endpoint="*"
            inputAccept="image/*"
            iconClassName="size-4 text-muted-foreground"
            labelEmptyText="Add Context.."
            onChangeFiles={() => []}
          />

          <div className="flex w-full items-end gap-1">
            {tagPickerOpen && <ChatTagPicker onSelect={handleInsertTag} onClose={() => setTagPickerOpen(false)} />}

            <div className="focus-within:ring-ring/50 border-input focus-within:border-ring relative flex w-full flex-col rounded-md border focus-within:ring-2">
              <ContentEditable
                ref={contentEditableRef}
                id="__message-input"
                placeholderText="Ask a question..."
                placeholderClassName="text-sm -mt-1"
                onSend={handleSendMessage}
                className="max-h-[120px] min-h-[65px] border-none text-sm focus-within:border-none focus-within:ring-0"
                createCustomElement={tag => {
                  const span = document.createElement("span")
                  span.textContent = tag
                  span.className = "text-black font-semibold text-sm mx-1"
                  span.contentEditable = "false"
                  return span
                }}
              />

              <div className="flex items-center justify-between px-2 py-1">
                <button
                  type="button"
                  className="text-muted-foreground cursor-pointer font-sans text-lg font-bold transition"
                  onClick={() => setTagPickerOpen(prev => !prev)}
                  tabIndex={-1}
                >
                  @
                </button>

                <Button className="flex h-[24px] items-center gap-2 font-sans" onClick={handleSendMessage}>
                  <span className="text-xs font-semibold">Send</span>
                  <SendHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
