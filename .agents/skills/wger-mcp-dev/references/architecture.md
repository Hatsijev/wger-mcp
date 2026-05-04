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

## Error Handling

Define domain errors in `domain/errors/`. Map infrastructure errors to domain errors at the boundary.

## Testing

- Unit test domain logic (no mocks needed)
- Integration test infrastructure adapters
- Mock ports when testing application layer
