"use client"

import { useEffect, useState } from "react"
import { ChatInterface } from "./chat-interface"

export function ClientOnlyChat() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading chat interface...</p>
        </div>
      </div>
    )
  }

  return <ChatInterface />
}