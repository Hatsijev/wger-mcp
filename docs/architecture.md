# Architecture

This document describes the high-level architecture of the Wger MCP server.

## C4 Container Diagram

```mermaid
C4Container
    title Container Diagram — Wger MCP Server

    Person(user, "User", "AI client user")
    System_Boundary(mcpClient, "MCP Client") {
        Container(aiClient, "AI Client", "Claude, Cursor, etc.", "Sends natural-language requests via MCP")
    }
    System_Boundary(wgerMcp, "Wger MCP Server") {
        Container(mcpServer, "Wger MCP Server", "TypeScript / Node.js", "Exposes fitness data as MCP tools and resources")
    }
    System_Boundary(wgerInstance, "Wger Instance") {
        Container(wgerApi, "Wger API", "Python / Django", "Self-hosted workout and nutrition tracker")
    }

    Rel(user, aiClient, "asks fitness questions", "natural language")
    Rel(aiClient, mcpServer, "calls tools / reads resources", "MCP over stdio")
    Rel(mcpServer, wgerApi, "reads / writes data", "HTTPS + Bearer token")
```

## Clean Architecture Layers

Dependencies point inward. Domain knows nothing about application or infrastructure. Application knows nothing about infrastructure.

```mermaid
flowchart TB
    subgraph Infrastructure["Infrastructure Layer (outer)"]
        infra1["MCP Server (stdio transport)"]
        infra2["WgerClient (typed HTTP)"]
        infra3["ConsoleLogger"]
        infra4["Config loader (Zod)"]
    end

    subgraph Application["Application Layer (middle)"]
        app1["Tool handlers"]
        app2["Resource handlers"]
        app3["Ports (Logger, etc.)"]
    end

    subgraph Domain["Domain Layer (inner)"]
        dom1["Models (Exercise, Muscle, etc.)"]
        dom2["Errors (WgerError hierarchy)"]
    end

    Infrastructure --> Application
    Application --> Domain
```

## Tool Call Flow

```mermaid
sequenceDiagram
    actor User
    participant AI as AI Client
    participant MCP as MCP Server
    participant TH as Tool Handler
    participant App as Application Service
    participant Client as WgerClient
    participant API as Wger API

    User->>AI: "List chest exercises"
    AI->>MCP: tools/list_exercises
    MCP->>TH: dispatch tool call
    TH->>App: execute use case
    App->>Client: fetch exercises
    Client->>API: GET /api/v2/exercise/
    API-->>Client: JSON response
    Client-->>App: typed Exercise[]
    App-->>TH: result
    TH-->>MCP: tool result
    MCP-->>AI: exercises list
    AI-->>User: formatted answer
```
