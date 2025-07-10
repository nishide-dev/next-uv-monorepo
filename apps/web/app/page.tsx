import { ChatInterface } from "@/components/chat/chat-interface"

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Powered by LangGraph and FastAPI
          </p>
        </div>
        
        <ChatInterface />
      </div>
    </div>
  )
}
