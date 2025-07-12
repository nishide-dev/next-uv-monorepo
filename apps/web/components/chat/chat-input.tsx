"use client"

import { useState, useRef } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  Send,
  Square,
  Loader2
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onStopGeneration: () => void
  disabled?: boolean
  conversationId: string
}

export function ChatInput({
  onSendMessage,
  onStopGeneration,
  disabled = false,
  conversationId
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const maxChars = 2000

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim() && !disabled && message.length <= maxChars) {
      onSendMessage(message.trim())
      setMessage("")
      setCharCount(0)

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    setCharCount(value.length)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleStopGeneration = () => {
    onStopGeneration()
  }

  const canSend = message.trim() && !disabled && message.length <= maxChars

  return (
    <Card className="rounded-none border-x-0 border-b-0">
      <CardContent className="px-4">
        <div className="space-y-3">
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Conversation: {conversationId !== 'temp-id' ? conversationId.slice(0, 8) + '...' : 'Loading...'}
              </Badge>
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    disabled
                      ? "AI is thinking..."
                      : "Type your message..."
                  }
                  disabled={disabled}
                  className={cn(
                    "min-h-[44px] max-h-[120px] resize-none transition-colors",
                    message.length > maxChars * 0.9 && "border-destructive focus-visible:ring-destructive"
                  )}
                  style={{ height: '44px' }}
                />

                {/* Character Count */}
                {message.length > maxChars * 0.8 && (
                  <div className="absolute bottom-2 right-2">
                    <Badge
                      variant={message.length > maxChars ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {charCount}/{maxChars}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Send/Stop Button */}
              <Button
                type={disabled ? "button" : "submit"}
                onClick={disabled ? handleStopGeneration : undefined}
                disabled={!disabled && !canSend}
                size="icon"
                className={cn(
                  "h-[44px] w-[44px] shrink-0 transition-colors",
                  disabled && "bg-red-100 hover:bg-red-200 text-red-600 border-red-200 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-400 dark:border-red-800"
                )}
              >
                {disabled ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Input Hints */}
            {!disabled && (
              <div className="text-xs text-muted-foreground px-1">
                Press Enter to send, Shift+Enter for new line
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
