"use client"

import { useState, KeyboardEvent, useRef } from "react"

import { ChatMessageTag } from "@/interfaces/chat"
import { ChatMessage, Message } from "@components/chat-message"
import { ChatMessageSkeleton } from "@components/chat-message-skeleton"
import { ChatTagPicker } from "@components/chat-tag-picker"
import { Button } from "@components/ui/button"
import { Textarea } from "@components/ui/textarea"
import { Plus, SendHorizontal } from "lucide-react"
import { nanoid } from "nanoid"

interface ChatWindowProps {
  sessionId: string
}

export const ChatWindow = ({ sessionId }: ChatWindowProps) => {
  const [selectedTag, setSelectedTag] = useState<ChatMessageTag | null>(null)
  const [tagPickerOpen, setTagPickerOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleInsertTag = (tag: ChatMessageTag) => {
    setSelectedTag(tag)
    setTagPickerOpen(false)
    setMessage(message + " " + tag + " ")

    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-0 pt-4">
      <h4 className="w-full justify-center text-center text-lg font-semibold">AI Chat</h4>

      <div className="flex h-full w-full flex-col items-center justify-between">
        <div className="max-h-[calc(100vh-175px)] w-full flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map(message => (
            <div key={message.id} className="flex w-full flex-col gap-2">
              <ChatMessage
                structuredResponse={
                  message.persona === "user"
                    ? null
                    : {
                        tag: "@Recommendation",
                        recommendation: {
                          fullName: "Emmanuel Odii",
                          userName: "@devodii",
                          id: "1",
                          picture: "https://randomuser.me/api/portraits/men/82.jpg",
                        },
                      }
                }
                dto={message}
              />
              {isTyping && <ChatMessageSkeleton />}
            </div>
          ))}
        </div>

        <div className="flex w-full items-end gap-1 border-t bg-white px-2 py-4">
          {tagPickerOpen && <ChatTagPicker onSelect={handleInsertTag} onClose={() => setTagPickerOpen(false)} />}

          <Button
            onClick={() => setTagPickerOpen(prev => !prev)}
            variant="outline"
            size="icon"
            className="h-[36px] flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Textarea
            ref={textareaRef}
            id="__message-input"
            placeholder="Type your message..."
            rows={1}
            className="flex-1"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{ minHeight: "36px", maxHeight: "120px" }}
          />

          <Button size="icon" className="h-[36px]" onClick={handleSendMessage} disabled={!message.trim()}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
