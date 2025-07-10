"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"
import { Bot, User, Copy, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { MarkdownContent } from "./markdown-content"

interface ChatMessageProps {
  content: string
  role: "user" | "assistant"
  timestamp: Date
  isStreaming?: boolean
}

export function ChatMessage({ 
  content, 
  role, 
  timestamp, 
  isStreaming = false 
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isUser = role === "user"

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) { // Less than 1 minute
      return "just now"
    } else if (diff < 3600000) { // Less than 1 hour
      return format(date, "HH:mm")
    } else if (diff < 86400000) { // Less than 1 day
      return format(date, "HH:mm")
    } else {
      return format(date, "MMM d, HH:mm")
    }
  }

  return (
    <div className={cn(
      "group flex gap-3 max-w-full",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        isUser ? "order-2" : "order-1"
      )}>
        <AvatarImage 
          src={isUser ? "/user-avatar.png" : "/bot-avatar.png"} 
          alt={isUser ? "User" : "AI Assistant"} 
        />
        <AvatarFallback className={cn(
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col space-y-2 max-w-[70%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message Bubble */}
        <Card className={cn(
          "relative",
          isUser 
            ? "bg-primary text-primary-foreground border-primary/20" 
            : "bg-muted border-border"
        )}>
          <CardContent className="p-3">
            {content ? (
              <div className="space-y-2">
                {isUser ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {content}
                    {isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current opacity-75 animate-pulse ml-1" />
                    )}
                  </p>
                ) : (
                  <div className="text-sm leading-relaxed">
                    <MarkdownContent content={content} />
                    {isStreaming && (
                      <span className="inline-block w-2 h-4 bg-current opacity-75 animate-pulse ml-1" />
                    )}
                  </div>
                )}
              </div>
            ) : isStreaming ? (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                Generating response...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Meta */}
        <div className={cn(
          "flex items-center space-x-2 px-1",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs text-muted-foreground">
            {mounted ? formatTime(timestamp) : '...'}
          </span>
          
          {/* Message Actions */}
          {!isStreaming && content && (
            <div className={cn(
              "flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity",
              isUser ? "flex-row-reverse" : "flex-row"
            )}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopy}
              >
                <Copy className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}

          {copied && (
            <Badge variant="secondary" className="text-xs">
              Copied!
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}