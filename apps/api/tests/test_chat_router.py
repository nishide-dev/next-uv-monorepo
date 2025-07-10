"""Tests for chat router endpoints."""

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Add packages to path for testing
sys.path.insert(0, str(Path(__file__).parent / "../../../packages"))

from api.main import app


class TestChatRouter:
    """Test cases for chat router."""

    @pytest.fixture
    def client(self) -> TestClient:
        """Create a test client."""
        return TestClient(app)

    def test_root_endpoint(self, client: TestClient) -> None:
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Chat API is running"

    def test_health_endpoint(self, client: TestClient) -> None:
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"

    def test_chat_endpoint(self, client: TestClient) -> None:
        """Test non-streaming chat endpoint."""
        payload = {
            "message": "Hello, how are you?",
            "conversation_id": "test-conversation",
        }

        response = client.post("/api/chat/", json=payload)
        assert response.status_code == 200

        data = response.json()
        assert "content" in data
        assert "conversation_id" in data
        assert "role" in data
        assert data["role"] == "assistant"
        assert data["conversation_id"] == "test-conversation"
        assert len(data["content"]) > 0

    def test_chat_endpoint_without_conversation_id(self, client: TestClient) -> None:
        """Test chat endpoint without conversation ID."""
        payload = {"message": "Hello, how are you?"}

        response = client.post("/api/chat/", json=payload)
        assert response.status_code == 200

        data = response.json()
        assert "content" in data
        assert "conversation_id" in data
        assert "role" in data
        assert data["role"] == "assistant"
        assert len(data["conversation_id"]) > 0  # Should generate UUID
        assert len(data["content"]) > 0

    def test_stream_chat_endpoint(self, client: TestClient) -> None:
        """Test streaming chat endpoint."""
        payload = {
            "message": "Tell me a story",
            "conversation_id": "test-stream-conversation",
        }

        response = client.post("/api/chat/stream", json=payload)
        assert response.status_code == 200
        assert "text/event-stream" in response.headers["content-type"]

        # Verify we get streaming data
        content = response.text
        assert "data:" in content
        assert len(content) > 0
