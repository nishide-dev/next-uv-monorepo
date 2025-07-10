"""Chat router for streaming chat endpoints."""

import json
import uuid
from collections.abc import AsyncGenerator

from agents.chat import LLMChatAgent
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from api.models import ChatRequest, ChatResponse

router = APIRouter()


async def generate_chat_stream(
    message: str, conversation_id: str
) -> AsyncGenerator[str, None]:
    """Generate streaming chat responses."""
    agent = LLMChatAgent()

    # Create initial response
    response_id = str(uuid.uuid4())

    async for chunk in agent.stream_response(message, conversation_id):
        response = {
            "id": response_id,
            "content": chunk,
            "conversation_id": conversation_id,
            "role": "assistant",
        }
        yield f"data: {json.dumps(response)}\n\n"

    # Send end marker
    yield "data: [DONE]\n\n"


@router.post("/stream")
async def stream_chat(request: ChatRequest) -> StreamingResponse:
    """Stream chat response endpoint."""
    conversation_id = request.conversation_id or str(uuid.uuid4())

    return StreamingResponse(
        generate_chat_stream(request.message, conversation_id),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        },
    )


@router.post("/")
async def chat(request: ChatRequest) -> ChatResponse:
    """Non-streaming chat endpoint."""
    agent = LLMChatAgent()
    conversation_id = request.conversation_id or str(uuid.uuid4())

    response = await agent.get_response(request.message, conversation_id)

    return ChatResponse(
        content=response, conversation_id=conversation_id, role="assistant"
    )
