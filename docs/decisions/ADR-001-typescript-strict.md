# ADR-001: TypeScript with Strict Mode

## Status

Accepted

## Context

The Wger MCP server bridges AI clients to a self-hosted fitness API. Because the server acts as a public-facing integration point, type safety is critical: malformed data, missing fields, or silent `any` types can propagate errors from the HTTP boundary all the way to the MCP response, degrading user trust and making debugging difficult.

We evaluated:

- **Plain JavaScript** — fast to write but offers no compile-time guarantees.
- **TypeScript with default config** — better, but still allows implicit `any` and loose optionality.
- **TypeScript with `strict: true`** — maximum compile-time safety at the cost of slightly more upfront type design.

## Decision

We will use TypeScript with the following compiler flags enabled:

- `strict: true`
- `exactOptionalPropertyTypes: true`
- `noImplicitAny: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

Additionally, the codebase maintains a **zero `any` / zero `unknown` policy** except where absolutely required by external library contracts (and those cases must be explicitly typed at the boundary).

## Consequences

### Positive

- **Safer code**: The compiler catches nil-pointer risks, missing properties, and incorrect assignments before runtime.
- **No runtime surprises**: Because we validate external payloads with Zod and map them to strict domain models, we never assume the shape of Wger API responses.
- **Self-documenting**: Explicit return types and strict interfaces make the codebase easier to navigate for new contributors.

### Negative

- **More upfront type design**: Every function, port, and model requires explicit types. This adds boilerplate during initial development.
- **Stricter refactor discipline**: Changing a domain model can trigger cascades of type errors in application and infrastructure layers, which is intended but requires care.
