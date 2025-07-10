"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@workspace/ui/components/card"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { streamMessage, type ChatMessage as ChatMessageType } from "@/lib/chat-api"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)

    try {
      // Create assistant message placeholder
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        content: "",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])

      // Stream the response
      let fullContent = ""
      for await (const chunk of streamMessage(message, conversationId)) {
        fullContent += chunk
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: fullContent }
              : msg
          )
        )
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      
      // Add error message
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isStreaming}
      />
    </Card>
  )
}