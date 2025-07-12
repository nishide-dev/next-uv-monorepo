# Chat API

FastAPI backend providing streaming chat endpoints powered by LangGraph agents.

## Architecture

This API serves as the backend for the chat application, integrating with:
- **LangGraph StateGraph agents** from `@workspace/agents`
- **Multiple LLM providers** (Gemini, OpenAI, Anthropic) via LangChain
- **Server-Sent Events** for real-time streaming responses

## Endpoints

### Chat Endpoints

- `POST /api/chat` - Send chat message and get streaming response
- `POST /api/chat/simple` - Send chat message and get complete response

Both endpoints accept:
```json
{
  "message": "Your message here",
  "conversation_id": "optional-conversation-id"
}
```

Streaming endpoint returns Server-Sent Events with:
```json
{
  "id": "response-id",
  "content": "response chunk",
  "conversation_id": "conversation-id",
  "role": "assistant"
}
```

## Development

### Setup
```bash
cd apps/api
uv sync
```

### Environment Variables
Create `.env` file:
```bash
GOOGLE_API_KEY=your_google_api_key_here
LLM_PROVIDER=gemini  # or openai, anthropic
```

### Running
```bash
# Development server
uv run uvicorn src.api.main:app --reload --port 8888

# Production
uv run uvicorn src.api.main:app --port 8888
```

### Testing
```bash
# Run tests
uv run pytest

# With coverage
uv run pytest --cov=src
```

### Code Quality
```bash
# Linting and formatting
uv run ruff check
uv run ruff format
```

## Configuration

The API automatically configures:
- **CORS** for frontend integration (localhost:3333, 3000, 3001)
- **LLM Provider** via environment variables
- **Conversation Memory** for multi-turn chat
- **Error Handling** with proper HTTP status codes

## Integration

Frontend integration example:
```typescript
// Streaming chat
for await (const chunk of streamMessage(message, conversationId)) {
  // Handle streaming response chunks
}

// Simple chat
const response = await sendMessage(message, conversationId);
```

The API runs on port 8888 by default and accepts requests from the frontend running on port 3333.