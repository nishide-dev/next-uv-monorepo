"use client"

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-full">
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      {/* Typing Animation */}
      <Card className="bg-muted border-border">
        <CardContent className="p-3">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              AI is thinking...
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
