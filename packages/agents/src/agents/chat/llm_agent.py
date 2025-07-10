"""LLM-powered chat agent using LangChain and LangGraph."""

from collections.abc import AsyncGenerator
from typing import Any, ClassVar

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import END, START, StateGraph

from agents.base import BaseAgent, ConversationState
from agents.config import get_settings
from agents.llm import LLMFactory


class LLMChatAgent(BaseAgent):
    """LangGraph-based chat agent powered by configurable LLM providers."""

    model_config: ClassVar[dict[str, Any]] = {"extra": "allow"}

    def __init__(self, **data: Any) -> None:  # noqa: ANN401
        """Initialize the LLM chat agent."""
        super().__init__(**data)
        self.settings = get_settings()
        self.llm = LLMFactory.create_llm(self.settings)
        self.graph = self._build_graph()
        self.conversations: dict[str, list[dict[str, str]]] = {}

    def _build_graph(self) -> StateGraph:
        """Build the LangGraph StateGraph for conversation flow."""
        graph = StateGraph(ConversationState)

        graph.add_node("process_message", self._process_message)
        graph.add_node("generate_response", self._generate_response)

        graph.add_edge(START, "process_message")
        graph.add_edge("process_message", "generate_response")
        graph.add_edge("generate_response", END)

        return graph.compile()

    def _process_message(self, state: ConversationState) -> ConversationState:
        """Process incoming message and update conversation state."""
        # Limit conversation memory
        messages = state["messages"]
        if len(messages) > self.settings.conversation_memory_limit:
            # Keep system message (if exists) and recent messages
            system_messages = [msg for msg in messages if msg["role"] == "system"]
            limit = self.settings.conversation_memory_limit - len(system_messages)
            recent_messages = messages[-limit:]
            state["messages"] = system_messages + recent_messages

        return state

    async def _generate_response(self, state: ConversationState) -> ConversationState:
        """Generate response using the configured LLM."""
        messages = state["messages"]

        # Convert to LangChain messages
        langchain_messages = []

        # Add system message if not present
        has_system = any(msg["role"] == "system" for msg in messages)
        if not has_system:
            langchain_messages.append(SystemMessage(content=self.settings.agent_system_prompt))

        # Convert conversation messages
        for msg in messages:
            if msg["role"] == "system":
                langchain_messages.append(SystemMessage(content=msg["content"]))
            elif msg["role"] == "user":
                langchain_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                langchain_messages.append(AIMessage(content=msg["content"]))

        # Generate response
        try:
            response = await self.llm.ainvoke(langchain_messages)
            content = (
                response.content if hasattr(response, "content") else str(response)
            )
        except Exception as e:  # noqa: BLE001
            content = f"I apologize, but I encountered an error: {e!s}"

        state["current_response"] = content
        return state

    async def get_response(self, message: str, conversation_id: str) -> str:
        """Get a complete response for the given message."""
        # Initialize conversation history if not exists
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []

        # Add user message to history
        self.conversations[conversation_id].append({"role": "user", "content": message})

        # Create state for the graph
        state: ConversationState = {
            "messages": self.conversations[conversation_id],
            "conversation_id": conversation_id,
            "current_response": "",
        }

        # Run the graph
        result = await self.graph.ainvoke(state)
        response = result["current_response"]

        # Add assistant response to history
        self.conversations[conversation_id].append(
            {"role": "assistant", "content": response}
        )

        return response

    async def stream_response(
        self, message: str, conversation_id: str
    ) -> AsyncGenerator[str, None]:
        """Stream response chunks for the given message."""
        # Initialize conversation history if not exists
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []

        # Add user message to history
        self.conversations[conversation_id].append({"role": "user", "content": message})

        # Create state for the graph
        state: ConversationState = {
            "messages": self.conversations[conversation_id],
            "conversation_id": conversation_id,
            "current_response": "",
        }

        # Process message
        state = self._process_message(state)

        # Convert to LangChain messages for streaming
        messages = state["messages"]
        langchain_messages = []

        # Add system message if not present
        has_system = any(msg["role"] == "system" for msg in messages)
        if not has_system:
            langchain_messages.append(SystemMessage(content=self.settings.agent_system_prompt))

        # Convert conversation messages
        for msg in messages:
            if msg["role"] == "system":
                langchain_messages.append(SystemMessage(content=msg["content"]))
            elif msg["role"] == "user":
                langchain_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                langchain_messages.append(AIMessage(content=msg["content"]))

        # Stream response
        full_response = ""
        try:
            async for chunk in self.llm.astream(langchain_messages):
                content = chunk.content if hasattr(chunk, 'content') else str(chunk)
                if content:
                    full_response += content
                    yield content
        except Exception as e:  # noqa: BLE001
            error_msg = f"I apologize, but I encountered an error: {e!s}"
            full_response = error_msg
            yield error_msg

        # Add assistant response to history
        self.conversations[conversation_id].append(
            {"role": "assistant", "content": full_response}
        )
