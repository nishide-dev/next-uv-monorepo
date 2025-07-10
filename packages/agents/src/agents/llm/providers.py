"""LLM provider interface and implementations."""

from abc import ABC, abstractmethod
from typing import Any

from langchain_core.language_models.base import BaseLanguageModel


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    def create_llm(self, **kwargs: Any) -> BaseLanguageModel:  # noqa: ANN401
        """Create and return an LLM instance."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the provider name."""


class GeminiProvider(LLMProvider):
    """Google Gemini LLM provider."""

    @property
    def provider_name(self) -> str:
        """Return the provider name."""
        return "gemini"

    def create_llm(self, **kwargs: Any) -> BaseLanguageModel:  # noqa: ANN401
        """Create a Gemini LLM instance."""
        from langchain_google_genai import ChatGoogleGenerativeAI  # noqa: PLC0415

        return ChatGoogleGenerativeAI(
            model=kwargs.get("model", "gemini-2.0-flash-exp"),
            google_api_key=kwargs.get("api_key"),
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 8192),
        )


class OpenAIProvider(LLMProvider):
    """OpenAI LLM provider."""

    @property
    def provider_name(self) -> str:
        """Return the provider name."""
        return "openai"

    def create_llm(self, **kwargs: Any) -> BaseLanguageModel:  # noqa: ANN401
        """Create an OpenAI LLM instance."""
        try:
            from langchain_openai import ChatOpenAI  # noqa: PLC0415
        except ImportError as e:
            msg = (
                "langchain-openai is required for OpenAI provider. "
                "Install with: pip install langchain-openai"
            )
            raise ImportError(msg) from e

        return ChatOpenAI(
            model=kwargs.get("model", "gpt-4o-mini"),
            api_key=kwargs.get("api_key"),
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 4096),
        )


class AnthropicProvider(LLMProvider):
    """Anthropic Claude LLM provider."""

    @property
    def provider_name(self) -> str:
        """Return the provider name."""
        return "anthropic"

    def create_llm(self, **kwargs: Any) -> BaseLanguageModel:  # noqa: ANN401
        """Create an Anthropic LLM instance."""
        try:
            from langchain_anthropic import ChatAnthropic  # noqa: PLC0415
        except ImportError as e:
            msg = (
                "langchain-anthropic is required for Anthropic provider. "
                "Install with: pip install langchain-anthropic"
            )
            raise ImportError(msg) from e

        return ChatAnthropic(
            model=kwargs.get("model", "claude-3-5-haiku-20241022"),
            api_key=kwargs.get("api_key"),
            temperature=kwargs.get("temperature", 0.7),
            max_tokens=kwargs.get("max_tokens", 8192),
        )
