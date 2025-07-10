"""Tests for LLM factory and providers."""

from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from agents.config import Settings
from agents.llm import LLMFactory
from agents.llm.providers import GeminiProvider, LLMProvider


class TestLLMFactory:
    """Test cases for LLMFactory."""

    def test_create_gemini_llm(self) -> None:
        """Test creating Gemini LLM."""
        settings = Settings(
            llm_provider="gemini",
            google_api_key="test-key",
            gemini_model="gemini-2.0-flash-exp",
        )

        with patch("agents.llm.providers.ChatGoogleGenerativeAI") as mock_gemini:
            mock_instance = MagicMock()
            mock_gemini.return_value = mock_instance

            llm = LLMFactory.create_llm(settings)

            assert llm == mock_instance
            mock_gemini.assert_called_once_with(
                model="gemini-2.0-flash-exp",
                google_api_key="test-key",
                temperature=0.7,
                max_tokens=8192,
            )

    def test_create_llm_no_api_key(self) -> None:
        """Test error when API key is missing."""
        settings = Settings(
            llm_provider="gemini",
            google_api_key="",  # Empty API key
        )

        with pytest.raises(ValueError, match="API key not found"):
            LLMFactory.create_llm(settings)

    def test_unsupported_provider(self) -> None:
        """Test error for unsupported provider."""
        settings = Settings(llm_provider="unsupported")  # type: ignore[arg-type]

        with pytest.raises(ValueError, match="Unsupported LLM provider"):
            LLMFactory.create_llm(settings)

    def test_list_providers(self) -> None:
        """Test listing available providers."""
        providers = LLMFactory.list_providers()

        assert "gemini" in providers
        assert "openai" in providers
        assert "anthropic" in providers

    def test_register_custom_provider(self) -> None:
        """Test registering a custom provider."""
        class CustomProvider(LLMProvider):
            @property
            def provider_name(self) -> str:
                return "custom"

            def create_llm(self, **kwargs: Any) -> MagicMock:  # noqa: ANN401, ARG002
                return MagicMock()

        custom_provider = CustomProvider()
        LLMFactory.register_provider(custom_provider)

        providers = LLMFactory.list_providers()
        assert "custom" in providers

        retrieved_provider = LLMFactory.get_provider("custom")
        assert retrieved_provider == custom_provider

    def test_get_provider_not_found(self) -> None:
        """Test error when getting non-existent provider."""
        with pytest.raises(ValueError, match="Provider not found"):
            LLMFactory.get_provider("nonexistent")


class TestGeminiProvider:
    """Test cases for GeminiProvider."""

    def test_provider_name(self) -> None:
        """Test provider name."""
        provider = GeminiProvider()
        assert provider.provider_name == "gemini"

    def test_create_llm(self) -> None:
        """Test creating Gemini LLM."""
        provider = GeminiProvider()

        with patch("agents.llm.providers.ChatGoogleGenerativeAI") as mock_gemini:
            mock_instance = MagicMock()
            mock_gemini.return_value = mock_instance

            llm = provider.create_llm(
                model="gemini-2.0-flash-exp",
                api_key="test-key",
                temperature=0.5,
                max_tokens=4096,
            )

            assert llm == mock_instance
            mock_gemini.assert_called_once_with(
                model="gemini-2.0-flash-exp",
                google_api_key="test-key",
                temperature=0.5,
                max_tokens=4096,
            )
