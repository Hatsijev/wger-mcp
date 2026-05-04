# Architecture Patterns

## Directory Structure

```
src/
├── domain/          # Entities, value objects, domain errors
│   ├── models/
│   └── errors/
├── application/     # Use cases, ports (interfaces)
│   ├── ports/
│   └── services/
├── infrastructure/  # MCP server, HTTP client, config
│   ├── mcp/
│   ├── http/
│   └── config/
└── index.ts
```

## Dependency Rule

- `domain` knows nothing outside itself
- `application` knows `domain` only
- `infrastructure` knows `application` and `domain`

## Wger MCP Layering

- `domain/models`: stable data contracts and domain-oriented types.
- `domain/errors`: project error hierarchy and error codes.
- `application/ports`: interfaces for Wger access, logging, configuration-sensitive capabilities, and clocks/timeouts when needed.
- `application/services`: use cases such as exercise search, routine mutation, nutrition plan access, and status checks.
- `infrastructure/wger`: HTTP adapter that implements Wger access ports.
- `infrastructure/mcp`: MCP transport registration only. It should adapt MCP inputs/outputs, not own business rules.

Transport code may call `WgerClient` directly only for small bootstrap milestones. As coverage grows, prefer application services or endpoint descriptors to keep repeated MCP handlers from becoming the architecture.

## Error Handling

Define domain errors in `domain/errors/`. Map infrastructure errors to domain errors at the boundary.

MCP errors should be converted in one shared place so every tool returns the same envelope and `isError` behavior.

Do not expose full upstream error bodies by default. Preserve status code and concise error classification, and redact sensitive payload details.

## Testing

- Unit test domain logic (no mocks needed)
- Integration test infrastructure adapters
- Mock ports when testing application layer

## Capability Gates

Capability flags are architectural boundaries, not documentation labels.

- Read-only tools: enabled by default.
- Safe write tools: require a clearly named write capability decision.
- Destructive tools: require `ENABLE_DESTRUCTIVE_TOOLS=true` and explicit confirmation design.
- Admin tools: require `ENABLE_ADMIN_TOOLS=true`.
- Raw proxy tools: require `ENABLE_RAW_WGER_PROXY=true`, allowlisted methods/paths, and redaction.

Disabled capabilities should not register tools unless there is a deliberate discoverability reason and the handler hard-fails before touching Wger.
