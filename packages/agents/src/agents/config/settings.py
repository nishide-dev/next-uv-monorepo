"""Settings configuration using Pydantic Settings."""

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # LLM Provider Settings
    llm_provider: Literal["gemini", "openai", "anthropic"] = Field(
        default="gemini", description="LLM provider to use"
    )

    # Google/Gemini Settings
    google_api_key: str = Field(
        default="", description="Google API key for Gemini models"
    )
    gemini_model: str = Field(
        default="gemini-2.0-flash-exp", description="Gemini model name"
    )
    gemini_temperature: float = Field(
        default=0.7, ge=0.0, le=2.0, description="Temperature for Gemini model"
    )
    gemini_max_tokens: int = Field(
        default=8192, gt=0, description="Max tokens for Gemini model"
    )

    # OpenAI Settings (for future use)
    openai_api_key: str = Field(
        default="", description="OpenAI API key"
    )
    openai_model: str = Field(
        default="gpt-4o-mini", description="OpenAI model name"
    )
    openai_temperature: float = Field(
        default=0.7, ge=0.0, le=2.0, description="Temperature for OpenAI model"
    )
    openai_max_tokens: int = Field(
        default=4096, gt=0, description="Max tokens for OpenAI model"
    )

    # Anthropic Settings (for future use)
    anthropic_api_key: str = Field(
        default="", description="Anthropic API key"
    )
    anthropic_model: str = Field(
        default="claude-3-5-haiku-20241022", description="Anthropic model name"
    )
    anthropic_temperature: float = Field(
        default=0.7, ge=0.0, le=1.0, description="Temperature for Anthropic model"
    )
    anthropic_max_tokens: int = Field(
        default=8192, gt=0, description="Max tokens for Anthropic model"
    )

    # Agent Settings
    agent_system_prompt: str = Field(
        default=(
            "You are a helpful AI assistant. Provide clear, accurate, "
            "and concise responses to user queries."
        ),
        description="System prompt for the agent",
    )

    conversation_memory_limit: int = Field(
        default=20, gt=0, description="Maximum number of messages to keep in memory"
    )

    def get_llm_config(self) -> dict[str, str | float | int]:
        """Get LLM configuration based on the selected provider."""
        if self.llm_provider == "gemini":
            return {
                "api_key": self.google_api_key,
                "model": self.gemini_model,
                "temperature": self.gemini_temperature,
                "max_tokens": self.gemini_max_tokens,
            }
        if self.llm_provider == "openai":
            return {
                "api_key": self.openai_api_key,
                "model": self.openai_model,
                "temperature": self.openai_temperature,
                "max_tokens": self.openai_max_tokens,
            }
        if self.llm_provider == "anthropic":
            return {
                "api_key": self.anthropic_api_key,
                "model": self.anthropic_model,
                "temperature": self.anthropic_temperature,
                "max_tokens": self.anthropic_max_tokens,
            }
        msg = f"Unsupported LLM provider: {self.llm_provider}"
        raise ValueError(msg)


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    # Look for .env file in the package root
    env_file = Path(__file__).parent.parent.parent.parent / ".env"

    if env_file.exists():
        return Settings(_env_file=str(env_file))
    return Settings()
