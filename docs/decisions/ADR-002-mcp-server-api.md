# ADR-002: High-Level `McpServer` API

## Status

Accepted

## Context

The Wger MCP server needed an MCP SDK abstraction to register tools and resources. The official `@modelcontextprotocol/sdk` provides two APIs:

- **`Server` (low-level)** — Requires manual `setRequestHandler` calls for every protocol method (`tools/list`, `tools/call`, `resources/list`, `resources/read`, etc.). Developers must construct request/response objects directly and manage capability negotiation explicitly.
- **`McpServer` (high-level)** — Wraps `Server` with declarative `registerTool` and `registerResource` methods. It handles schema extraction, request routing, and response shaping automatically.

We evaluated both against our project goals: minimal boilerplate, strict type safety, and fast iteration as we add new domains (exercises, routines, nutrition, etc.).

## Decision

We will use the high-level **`McpServer`** class from `@modelcontextprotocol/sdk/server/mcp.js`.

Tool registration looks like:

```typescript
server.registerTool(
  "list_routines",
  {
    description: "List routines",
    inputSchema: listRoutinesSchema, // Zod schema
  },
  async (args) => {
    // handler
  },
);
```

Resource registration looks like:

```typescript
server.registerResource(
  "routines",
  "wger://routines",
  {
    mimeType: "application/json",
    description: "List of routines",
  },
  async () => {
    // handler
  },
);
```

## Consequences

### Positive

- **Less boilerplate**: No manual `setRequestHandler` or protocol-level response wrapping. Tool and resource registration is declarative and concise.
- **Automatic input validation integration**: `McpServer` extracts JSON Schema from Zod schemas supplied to `inputSchema`, so the MCP client receives accurate parameter metadata without separate schema files.
- **Faster feature additions**: Adding a new domain (e.g., nutrition) only requires calling `registerTool` / `registerResource` in a new module; no changes to protocol plumbing.
- **Type-safe boundaries**: The SDK infers argument types from Zod schemas, giving compile-time safety inside handlers.

### Negative

- **Less control over protocol details**: Edge-case protocol customizations (e.g., non-standard error shapes) require dropping down to the low-level `Server` API.
- **SDK abstraction dependency**: If the high-level API changes in future SDK versions, our registration code may need updates.
- **Opaque request lifecycle**: Debugging protocol-level issues is slightly harder because `McpServer` hides the raw request/response objects.

## Related

- [ADR-001: TypeScript with Strict Mode](./ADR-001-typescript-strict.md)
