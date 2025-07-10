"""LLM factory for creating LLM instances based on configuration."""

from typing import ClassVar

from langchain_core.language_models.base import BaseLanguageModel

from agents.config import Settings

from .providers import AnthropicProvider, GeminiProvider, LLMProvider, OpenAIProvider


class LLMFactory:
    """Factory class for creating LLM instances."""

    _providers: ClassVar[dict[str, LLMProvider]] = {
        "gemini": GeminiProvider(),
        "openai": OpenAIProvider(),
        "anthropic": AnthropicProvider(),
    }

    @classmethod
    def create_llm(cls, settings: Settings) -> BaseLanguageModel:
        """Create an LLM instance based on settings."""
        provider_name = settings.llm_provider.lower()

        if provider_name not in cls._providers:
            available = ", ".join(cls._providers.keys())
            msg = f"Unsupported LLM provider: {provider_name}. Available: {available}"
            raise ValueError(msg)

        provider = cls._providers[provider_name]
        llm_config = settings.get_llm_config()

        # Validate API key
        api_key = llm_config.get("api_key")
        if not api_key:
            msg = f"API key not found for provider: {provider_name}"
            raise ValueError(msg)

        return provider.create_llm(**llm_config)

    @classmethod
    def register_provider(cls, provider: LLMProvider) -> None:
        """Register a new LLM provider."""
        cls._providers[provider.provider_name] = provider

    @classmethod
    def list_providers(cls) -> list[str]:
        """List available LLM providers."""
        return list(cls._providers.keys())

    @classmethod
    def get_provider(cls, name: str) -> LLMProvider:
        """Get a specific provider by name."""
        if name not in cls._providers:
            available = ", ".join(cls._providers.keys())
            msg = f"Provider not found: {name}. Available: {available}"
            raise ValueError(msg)
        return cls._providers[name]
