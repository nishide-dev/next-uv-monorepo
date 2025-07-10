"""Chat agents package."""

from .llm_agent import LLMChatAgent

# Alias for backward compatibility
ChatAgent = LLMChatAgent

__all__ = ["ChatAgent", "LLMChatAgent"]
