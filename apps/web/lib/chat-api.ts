// Chat API utilities for streaming and non-streaming requests

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export interface StreamResponse {
  id: string
  content: string
  conversation_id: string
  role: "assistant"
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888"

export async function sendMessage(message: string, conversationId?: string): Promise<ChatMessage> {
  const response = await fetch(`${API_BASE_URL}/api/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to send message")
  }

  const data = await response.json()
  return {
    id: data.conversation_id,
    content: data.content,
    role: data.role,
    timestamp: new Date(),
  }
}

export async function* streamMessage(
  message: string,
  conversationId?: string
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to stream message")
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error("Failed to get response reader")
  }

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)

          if (data === "[DONE]") {
            return
          }

          try {
            const parsed: StreamResponse = JSON.parse(data)
            yield parsed.content
          } catch (error) {
            console.warn("Failed to parse streaming data:", error)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
