"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

interface ChatMessageProps {
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <Card className={cn(
        "max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <CardContent className="p-3">
          <div className="space-y-2">
            <p className="text-sm leading-relaxed">{content}</p>
            <p className={cn(
              "text-xs opacity-70",
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {timestamp.toLocaleTimeString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}