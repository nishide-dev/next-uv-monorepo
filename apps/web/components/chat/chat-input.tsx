"use client"

import { useState, useRef } from "react"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Smile, 
  Square,
  Loader2 
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  conversationId: string
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false,
  conversationId 
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
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
        textareaRef.current.style.height = 'auto'
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
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handleAttachment = () => {
    // File attachment logic would go here
  }

  const handleEmojiClick = () => {
    // Emoji picker logic would go here
  }

  const handleStopGeneration = () => {
    // Stop generation logic would go here
  }

  const canSend = message.trim() && !disabled && message.length <= maxChars

  return (
    <Card className="rounded-none border-x-0 border-b-0">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Conversation: {conversationId !== 'temp-id' ? conversationId.slice(0, 8) + '...' : 'Loading...'}
              </Badge>
            </div>
            
            {disabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStopGeneration}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Square className="h-3 w-3 mr-1" />
                Stop
              </Button>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  disabled 
                    ? "AI is thinking..." 
                    : "Type your message... (Press Enter to send, Shift+Enter for new line)"
                }
                disabled={disabled}
                className={cn(
                  "min-h-[60px] max-h-[120px] resize-none pr-12 transition-colors",
                  message.length > maxChars * 0.9 && "border-destructive focus-visible:ring-destructive"
                )}
                style={{ height: '60px' }}
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

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAttachment}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceToggle}
                  disabled={disabled}
                  className={cn(
                    "h-8 w-8 p-0",
                    isRecording && "text-destructive"
                  )}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleEmojiClick}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>

              <Button 
                type="submit" 
                disabled={!canSend}
                size="sm"
                className="h-8 px-3"
              >
                {disabled ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3 w-3 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Suggestions */}
          {message.length === 0 && !disabled && (
            <div className="flex flex-wrap gap-2">
              {[
                "Explain this concept",
                "Write a summary",
                "Help me brainstorm",
                "Translate this text"
              ].map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors text-xs"
                  onClick={() => setMessage(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}