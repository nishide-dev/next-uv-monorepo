"""Base agent classes for LangGraph StateGraph implementations."""

from collections.abc import AsyncGenerator
from typing import Any, TypedDict

from pydantic import BaseModel


class ConversationState(TypedDict):
    """State for conversation tracking."""

    messages: list[dict[str, str]]
    conversation_id: str
    current_response: str
    current_message: str


class BaseAgent(BaseModel):
    """Base agent class for all conversation agents."""

    def __init__(self, **data: Any) -> None:  # noqa: ANN401
        """Initialize the base agent."""
        super().__init__(**data)

    async def get_response(self, message: str, conversation_id: str) -> str:
        """Get a complete response for the given message."""
        raise NotImplementedError

    async def stream_response(
        self,
        message: str,  # noqa: ARG002
        conversation_id: str,  # noqa: ARG002
    ) -> AsyncGenerator[str, None]:
        """Stream response chunks for the given message."""
        raise NotImplementedError
        yield  # This will never be reached but satisfies type checker
