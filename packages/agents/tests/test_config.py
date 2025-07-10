"""Tests for configuration settings."""


import pytest

from agents.config import Settings, get_settings


class TestSettings:
    """Test cases for Settings configuration."""

    def test_default_settings(self) -> None:
        """Test default settings values."""
        settings = Settings()

        assert settings.llm_provider == "gemini"
        assert settings.gemini_model == "gemini-2.0-flash-exp"
        assert settings.gemini_temperature == 0.7
        assert settings.conversation_memory_limit == 20

    def test_gemini_config(self) -> None:
        """Test Gemini LLM configuration."""
        settings = Settings(
            llm_provider="gemini",
            google_api_key="test-api-key",
            gemini_model="gemini-2.0-flash-exp",
            gemini_temperature=0.5,
        )

        config = settings.get_llm_config()

        assert config["api_key"] == "test-api-key"
        assert config["model"] == "gemini-2.0-flash-exp"
        assert config["temperature"] == 0.5

    def test_openai_config(self) -> None:
        """Test OpenAI LLM configuration."""
        settings = Settings(
            llm_provider="openai",
            openai_api_key="test-openai-key",
            openai_model="gpt-4o-mini",
            openai_temperature=0.3,
        )

        config = settings.get_llm_config()

        assert config["api_key"] == "test-openai-key"
        assert config["model"] == "gpt-4o-mini"
        assert config["temperature"] == 0.3

    def test_anthropic_config(self) -> None:
        """Test Anthropic LLM configuration."""
        settings = Settings(
            llm_provider="anthropic",
            anthropic_api_key="test-anthropic-key",
            anthropic_model="claude-3-5-haiku-20241022",
            anthropic_temperature=0.8,
        )

        config = settings.get_llm_config()

        assert config["api_key"] == "test-anthropic-key"
        assert config["model"] == "claude-3-5-haiku-20241022"
        assert config["temperature"] == 0.8

    def test_unsupported_provider(self) -> None:
        """Test error handling for unsupported provider."""
        settings = Settings(llm_provider="unsupported")  # type: ignore[arg-type]

        with pytest.raises(ValueError, match="Unsupported LLM provider"):
            settings.get_llm_config()

    def test_get_settings_cached(self) -> None:
        """Test that get_settings returns cached instance."""
        settings1 = get_settings()
        settings2 = get_settings()

        assert settings1 is settings2
