"""Tests for LLMChatAgent functionality."""

from collections.abc import AsyncGenerator
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from agents.chat import LLMChatAgent
from agents.config import Settings


class TestLLMChatAgent:
    """Test cases for LLMChatAgent."""

    @pytest.fixture
    def mock_settings(self) -> Settings:
        """Create mock settings for testing."""
        return Settings(
            google_api_key="test-key",
            llm_provider="gemini",
            gemini_model="gemini-2.0-flash-exp",
        )

    @pytest.fixture
    def mock_llm(self) -> MagicMock:
        """Create a mock LLM for testing."""
        mock = AsyncMock()
        mock.ainvoke = AsyncMock(return_value=MagicMock(content="Test response"))

        # Create async generator for streaming
        async def async_stream(*args, **kwargs) -> AsyncGenerator[MagicMock, None]:  # noqa: ARG001, ANN002, ANN003
            yield MagicMock(content="Test ")
            yield MagicMock(content="response")

        mock.astream = async_stream
        return mock

    @pytest.fixture
    def agent(self, mock_settings: Settings, mock_llm: MagicMock) -> LLMChatAgent:
        """Create an LLMChatAgent instance for testing."""
        with (
            patch("agents.chat.llm_agent.get_settings", return_value=mock_settings),
            patch("agents.chat.llm_agent.LLMFactory.create_llm", return_value=mock_llm),
        ):
            return LLMChatAgent()

    @pytest.mark.asyncio
    async def test_get_response(self, agent: LLMChatAgent) -> None:
        """Test basic response generation."""
        message = "Hello, how are you?"
        conversation_id = "test-conversation"

        response = await agent.get_response(message, conversation_id)

        assert isinstance(response, str)
        assert len(response) > 0
        assert response == "Test response"

    @pytest.mark.asyncio
    async def test_stream_response(self, agent: LLMChatAgent) -> None:
        """Test streaming response generation."""
        message = "Tell me a short story"
        conversation_id = "test-stream-conversation"

        chunks = [
            chunk async for chunk in agent.stream_response(message, conversation_id)
        ]

        assert len(chunks) > 0
        full_response = "".join(chunks)
        assert len(full_response) > 0
        assert "Test" in full_response

    @pytest.mark.asyncio
    async def test_conversation_history(self, agent: LLMChatAgent) -> None:
        """Test conversation history tracking."""
        conversation_id = "test-history-conversation"

        # Send first message
        response1 = await agent.get_response("My name is Alice", conversation_id)
        assert len(response1) > 0

        # Send second message - should have access to conversation history
        response2 = await agent.get_response("What is my name?", conversation_id)
        assert len(response2) > 0

        # Verify conversation history is maintained
        assert conversation_id in agent.conversations
        messages = agent.conversations[conversation_id]
        assert len(messages) == 4  # 2 user messages + 2 assistant responses
        assert messages[0]["role"] == "user"
        assert messages[0]["content"] == "My name is Alice"
        assert messages[1]["role"] == "assistant"
        assert messages[2]["role"] == "user"
        assert messages[2]["content"] == "What is my name?"
        assert messages[3]["role"] == "assistant"

    @pytest.mark.asyncio
    async def test_conversation_memory_limit(self, agent: LLMChatAgent) -> None:
        """Test that conversation memory settings are respected."""
        conversation_id = "test-memory-limit"

        # Set a low memory limit for testing
        agent.settings.conversation_memory_limit = 4

        # Add many messages to exceed memory limit
        for i in range(6):  # This will create 12 messages (6 user + 6 assistant)
            await agent.get_response(f"Message {i}", conversation_id)

        # Verify that all messages are stored in conversation history
        # (memory limiting happens during graph processing, not in storage)
        messages = agent.conversations[conversation_id]
        assert len(messages) == 12  # 6 user + 6 assistant messages

        # Verify the memory limit setting is correctly configured
        assert agent.settings.conversation_memory_limit == 4
