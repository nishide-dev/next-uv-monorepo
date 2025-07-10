"""Pydantic models for API requests and responses."""

from pydantic import BaseModel


class ChatMessage(BaseModel):
    """Chat message model."""

    content: str
    role: str = "user"


class ChatRequest(BaseModel):
    """Chat request model."""

    message: str
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    """Chat response model."""

    content: str
    conversation_id: str
    role: str = "assistant"
