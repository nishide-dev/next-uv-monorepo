"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardHeader, CardContent } from "@workspace/ui/components/card"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { streamMessage, type ChatMessage as ChatMessageType } from "@/lib/chat-api"
import { Bot, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Generate conversation ID only on client side to avoid hydration mismatch
  const conversationId = useMemo(() => {
    if (typeof window !== 'undefined') {
      return crypto.randomUUID()
    }
    return 'temp-id'
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!mounted) return

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
    <div className="flex flex-col h-screen max-w-4xl mx-auto border-x bg-background">
      {/* Chat Header - Fixed */}
      <div className="flex-none">
        <Card className="rounded-none border-x-0 border-t-0">
          <CardHeader className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">AI Assistant</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                      Online
                    </Badge>
                    {isStreaming && (
                      <Badge variant="outline" className="text-xs">
                        Typing...
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  {messages.length} messages
                </Badge>
                <ThemeToggle />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Separator />
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-0 relative z-0" ref={scrollAreaRef}>
          <div className="p-4 space-y-6 min-h-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="p-4 rounded-full bg-primary/10">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Welcome to AI Chat</h3>
                  <p className="text-muted-foreground max-w-md">
                    Start a conversation with our AI assistant. Ask questions, get help, or just chat!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 max-w-md">
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Tell me a joke
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Explain quantum physics
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    Write a poem
                  </Badge>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    role={message.role}
                    timestamp={message.timestamp}
                    isStreaming={isStreaming && index === messages.length - 1 && message.role === "assistant"}
                  />
                ))}
                {isStreaming && <TypingIndicator />}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="flex-none">
        <Separator />
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isStreaming}
          conversationId={conversationId}
        />
      </div>
    </div>
  )
}
