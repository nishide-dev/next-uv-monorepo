# Chat Web Application

Next.js 15 frontend with real-time streaming chat interface built using shadcn/ui components.

## Features

- **Real-time Streaming Chat** - Server-Sent Events for live response streaming
- **Modern UI** - shadcn/ui components with dark/light theme support
- **TypeScript** - Full type safety across the application
- **Responsive Design** - Mobile-friendly chat interface

## Architecture

### Components

- **ChatInterface** (`components/chat/chat-interface.tsx`) - Main chat component with streaming support
- **ChatMessage** (`components/chat/chat-message.tsx`) - Individual message rendering
- **ChatInput** (`components/chat/chat-input.tsx`) - Message input with send functionality

### API Integration

- **chat-api.ts** (`lib/chat-api.ts`) - API client for streaming and simple chat
- Connects to FastAPI backend at `http://localhost:8001`
- Handles Server-Sent Events for real-time responses

## Development

### Setup
```bash
cd apps/web
pnpm install
```

### Running
```bash
# Development server
pnpm dev

# Build
pnpm build

# Start production server
pnpm start
```

### Code Quality
```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix
```

## Usage

### Basic Chat
```tsx
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return <ChatInterface />
}
```

### API Client
```typescript
import { streamMessage, sendMessage } from "@/lib/chat-api"

// Streaming chat
for await (const chunk of streamMessage("Hello", "conversation-id")) {
  console.log(chunk) // Response chunks
}

// Simple chat
const response = await sendMessage("Hello", "conversation-id")
```

## Dependencies

### Key Packages
- **Next.js 15** - React framework with App Router
- **shadcn/ui** - UI component library (@workspace/ui)
- **next-themes** - Dark/light theme support
- **TypeScript** - Type safety

### Shared Components
All UI components are imported from the shared `@workspace/ui` package:
```tsx
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
```

## Configuration

### Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Theme Support
Dark/light mode is configured via `components/providers.tsx` using `next-themes`.

## Deployment

The application is configured for Vercel deployment:
- Build command: `pnpm build`
- Output directory: `.next`
- Framework preset: Next.js