# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Next.js)
```bash
# Start web development server
pnpm --filter web dev

# Build web application
pnpm --filter web build

# Type checking
pnpm --filter web typecheck

# Linting
pnpm --filter web lint
pnpm --filter web lint:fix
```

### Python (API & Agents)
```bash
# Install Python dependencies for entire workspace
uv sync

# Install dependencies for specific package
cd apps/api && uv sync
cd packages/agents && uv sync

# Run Python tests
uv run pytest

# Python linting and formatting
uv run ruff check
uv run ruff format

# Run tests for specific package
cd apps/api && uv run pytest
cd packages/agents && uv run pytest
```

### Monorepo Operations
```bash
# Install all dependencies (Node.js and Python)
pnpm install

# Start all development servers
pnpm dev

# Build all packages and applications
pnpm build

# Lint all packages
pnpm lint

# Format code across all packages
pnpm format
```

### Adding shadcn/ui Components
```bash
# Add components to the web app (places them in packages/ui)
pnpm dlx shadcn@latest add <component-name> -c apps/web
```

## Architecture Overview

This is a hybrid monorepo with both Node.js (frontend) and Python (backend/AI) applications:

### Package Structure
- **apps/web**: Next.js 15 frontend with shadcn/ui components
- **apps/api**: FastAPI backend (planned) for streaming chat endpoints
- **packages/ui**: Shared shadcn/ui component library
- **packages/agents**: LangGraph StateGraph agents for AI conversations
- **packages/typescript-config**: Shared TypeScript configurations
- **packages/eslint-config**: Shared ESLint configurations

### Key Architectural Patterns

#### Frontend Architecture
- **App Router**: Next.js 15 with App Router pattern in `apps/web/app/`
- **Component Sharing**: UI components are shared via `@workspace/ui` package
- **Theme System**: Dark/light mode via `next-themes` in `components/providers.tsx`
- **Type Safety**: Strict TypeScript configuration across all packages

#### Python Architecture  
- **UV Workspace**: Python packages managed via UV with workspace configuration
- **Agent System**: LangGraph StateGraphs in `packages/agents` for conversation flows
- **API Integration**: FastAPI backend planned to import agents from packages

#### Workspace Integration
- **Turborepo**: Orchestrates builds and development across all packages
- **pnpm Workspaces**: Manages Node.js package dependencies
- **UV Workspace**: Manages Python package dependencies and virtual environments

### Component Import Pattern
UI components are imported from the shared package:
```tsx
import { Button } from "@workspace/ui/components/button"
```

### Python Package Structure
Python packages follow the `src/` layout:
- `src/agents/` for agent implementations
- `src/api/` for API server code
- `tests/` for test files

### Configuration Files
- **Turborepo**: `turbo.json` defines task dependencies and caching
- **Python Tools**: `ruff.toml` for shared Python linting/formatting rules
- **UV Workspace**: Root `pyproject.toml` defines workspace members and shared dev dependencies

## Chat Application Flow (Planned)

1. User interacts with Next.js frontend
2. Frontend sends requests to FastAPI backend (`apps/api`)
3. API imports and uses LangGraph agents from `packages/agents`
4. Agents process conversation state and generate responses
5. Responses stream back to frontend via Server-Sent Events

## Development Workflow

When adding new features:
1. Add UI components via shadcn CLI (automatically shared across workspace)
2. Implement agents in `packages/agents` using LangGraph StateGraphs
3. Create API endpoints in `apps/api` that import agent functionality
4. Connect frontend to API endpoints for real-time chat

## Important Notes

- Run `pnpm install` after adding new Node.js dependencies
- Run `uv sync` after modifying Python dependencies in pyproject.toml files
- Type checking is strict across all TypeScript packages
- Python packages use strict typing with mypy configuration
- Both Ruff and Prettier are used for consistent code formatting