# Next.js + UV Monorepo - AI Chat Application

Modern monorepo setup for building AI-powered chat applications using Next.js, shadcn/ui, and LangGraph state machines.

## Architecture Overview

This project follows a modern monorepo architecture with clear separation of concerns:

```
├── apps/
│   ├── web/          # Next.js frontend with shadcn/ui
│   └── api/          # FastAPI backend for streaming chat
├── packages/
│   ├── ui/           # Shared shadcn/ui components
│   ├── agents/       # LangGraph StateGraph agents (Python)
│   ├── typescript-config/
│   └── eslint-config/
```

## Key Technologies

- **Frontend**: Next.js 15 + React 19 + shadcn/ui + Tailwind CSS
- **Backend**: FastAPI (Python) for streaming API endpoints
- **AI Agents**: LangGraph StateGraph for complex conversation flows
- **Monorepo**: Turborepo + pnpm workspaces
- **Language Runtime**: UV for Python dependency management

## Project Components

### 1. Web Application (`apps/web`)
- **Framework**: Next.js 15 with App Router
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Theme**: Dark/light mode support via next-themes
- **Features**:
  - Real-time streaming chat interface
  - Responsive design with modern UI components
  - Theme switching capabilities
  - TypeScript for type safety

### 2. API Layer (`apps/api`)
- **Framework**: FastAPI for high-performance async API
- **Features**:
  - Streaming chat endpoints with Server-Sent Events (SSE)
  - Integration with LangGraph agents
  - CORS configuration for frontend communication
  - Error handling and request validation

### 3. AI Agents (`packages/agents`)
- **Framework**: LangGraph for creating stateful conversation agents
- **Language**: Python 3.12+ with UV for dependency management
- **Features**:
  - StateGraph-based conversation flows
  - Modular agent architecture
  - Integration with various AI services
  - State persistence and management

### 4. Shared UI Components (`packages/ui`)
- **Base**: shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: Button, Input, Dialog, and other reusable UI elements
- **Exports**: Modular exports for individual components

## Development Setup

### Prerequisites
- Node.js 20+
- Python 3.12+
- pnpm 10.4.1+
- UV (Python package manager)

### Installation
```bash
# Install all dependencies
pnpm install

# Install Python dependencies
cd packages/agents && uv sync
```

### Development
```bash
# Start all development servers
pnpm dev

# Start specific applications
pnpm --filter web dev        # Frontend only
pnpm --filter api dev        # Backend only
```

### Building
```bash
# Build all packages
pnpm build

# Build specific packages
pnpm --filter web build
pnpm --filter api build
```

## Chat Application Flow

1. **User Interaction**: User sends message through Next.js frontend
2. **API Processing**: FastAPI receives request and forwards to LangGraph agent
3. **Agent Processing**: StateGraph processes conversation state and generates response
4. **Streaming Response**: Response streams back through FastAPI to frontend
5. **Real-time UI**: Frontend displays streaming response in real-time

## Configuration

### TypeScript
- Shared TypeScript configurations in `packages/typescript-config`
- Strict type checking enabled across all packages
- Path mapping for workspace packages

### ESLint
- Shared ESLint configurations in `packages/eslint-config`
- Separate configs for Next.js, React, and Node.js environments
- Consistent code style across the monorepo

### Turborepo
- Optimized build caching and parallelization
- Task orchestration across packages
- Development server coordination

## Package Scripts

- `pnpm dev` - Start development servers for all applications
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Run linting across all packages
- `pnpm format` - Format code using Prettier

## Directory Structure Details

### Frontend Structure (`apps/web`)
```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Main chat interface
components/
├── providers.tsx       # Theme and other providers
hooks/                  # Custom React hooks
lib/                    # Utility functions
```

### Backend Structure (`apps/api`)
```
src/
├── main.py            # FastAPI application entry
├── routers/           # API route handlers
├── services/          # Business logic layer
└── models/            # Pydantic models
```

### Agents Structure (`packages/agents`)
```
src/agents/
├── __init__.py        # Package initialization
├── chat/              # Chat-specific agents
├── base/              # Base agent classes
└── utils/             # Utility functions
```

## Adding UI Components

To add shadcn/ui components to your app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using Components

Import components from the `ui` package:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Contributing

1. Follow the established code style and conventions
2. Use TypeScript for all frontend code
3. Use Python type hints for backend code
4. Run linting and type checking before committing
5. Write tests for new features

## License

This project is private and proprietary.