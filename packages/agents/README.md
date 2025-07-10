# AI Agents Package

LangGraph StateGraph-based conversational agents with multi-provider LLM support.

## Architecture

### Core Components

- **LLMChatAgent** - Main conversational agent using LangGraph StateGraph
- **LLM Factory** - Provider abstraction for multiple LLM services
- **Settings** - Pydantic-based configuration management
- **Memory** - Conversation state management

### Supported LLM Providers

- **Gemini 2.5 Flash** (default) - Google's latest conversational AI
- **OpenAI GPT** - GPT-3.5/4 models via OpenAI API
- **Anthropic Claude** - Claude models via Anthropic API

## Usage

### Basic Agent Usage
```python
from agents.chat.llm_agent import LLMChatAgent

# Initialize agent
agent = LLMChatAgent()

# Simple response
response = await agent.get_response("Hello!", "conversation-123")

# Streaming response
async for chunk in agent.stream_response("Tell me a story", "conversation-123"):
    print(chunk, end="", flush=True)
```

### Configuration
```python
from agents.config.settings import Settings

# Environment-based configuration
settings = Settings()
print(f"Using {settings.llm_provider} with model {settings.gemini_model}")

# Programmatic configuration
settings = Settings(
    llm_provider="openai",
    openai_model="gpt-4",
    openai_api_key="your-key"
)
```

### Custom LLM Provider
```python
from agents.llm.providers.base import BaseLLMProvider
from agents.llm.factory import LLMFactory

@LLMFactory.register("custom")
class CustomProvider(BaseLLMProvider):
    @classmethod
    def create_llm(cls, **config) -> BaseLanguageModel:
        # Implement your custom LLM
        pass
```

## Development

### Setup
```bash
cd packages/agents
uv sync
```

### Environment Variables
Create `.env` file:
```bash
# LLM Provider Configuration
LLM_PROVIDER=gemini  # gemini, openai, anthropic
GEMINI_MODEL=gemini-2.0-flash-exp
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Other providers
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-3-sonnet-20240229

# Agent Configuration
MAX_CONVERSATION_HISTORY=10
TEMPERATURE=0.7
```

### Testing
```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src

# Run specific test file
uv run pytest tests/test_llm_agent.py -v
```

### Code Quality
```bash
# Linting and formatting
uv run ruff check
uv run ruff format

# Type checking
uv run mypy src/
```

## Architecture Details

### LangGraph StateGraph
The agent uses LangGraph's StateGraph for conversation flow:

```python
# Conversation state management
class ConversationState(TypedDict):
    messages: list[BaseMessage]
    conversation_id: str

# StateGraph workflow
workflow = StateGraph(ConversationState)
workflow.add_node("chat", chat_node)
workflow.add_edge(START, "chat")
workflow.add_edge("chat", END)
```

### Memory Management
- **In-memory storage** for conversation history
- **Configurable history length** via `MAX_CONVERSATION_HISTORY`
- **Thread-safe** conversation state management

### Provider Factory Pattern
Extensible architecture for adding new LLM providers:

```python
# Factory registration
@LLMFactory.register("new_provider")
class NewProvider(BaseLLMProvider):
    @classmethod
    def create_llm(cls, **config) -> BaseLanguageModel:
        return SomeLanguageModel(**config)

# Automatic discovery and instantiation
llm = LLMFactory.create_llm(settings)
```

## Integration

### FastAPI Integration
```python
from agents.chat.llm_agent import LLMChatAgent

agent = LLMChatAgent()

async def chat_endpoint(message: str, conversation_id: str):
    async for chunk in agent.stream_response(message, conversation_id):
        yield f"data: {chunk}\n\n"
```

### Direct Usage
```python
import asyncio
from agents.chat.llm_agent import LLMChatAgent

async def main():
    agent = LLMChatAgent()
    response = await agent.get_response("What is AI?", "test-conversation")
    print(response)

asyncio.run(main())
```

## Configuration Reference

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `LLM_PROVIDER` | `gemini` | LLM provider to use |
| `GOOGLE_API_KEY` | - | Google API key for Gemini |
| `GEMINI_MODEL` | `gemini-2.0-flash-exp` | Gemini model name |
| `OPENAI_API_KEY` | - | OpenAI API key |
| `OPENAI_MODEL` | `gpt-3.5-turbo` | OpenAI model name |
| `ANTHROPIC_API_KEY` | - | Anthropic API key |
| `ANTHROPIC_MODEL` | `claude-3-sonnet-20240229` | Anthropic model name |
| `MAX_CONVERSATION_HISTORY` | `10` | Max messages to keep in memory |
| `TEMPERATURE` | `0.7` | LLM temperature for randomness |