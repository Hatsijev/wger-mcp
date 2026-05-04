# Documentation Templates

## API Endpoint Doc Template

````markdown
## POST /exercises

### Description

Brief description of what this endpoint does.

### Request

```typescript
interface CreateExerciseRequest {
  name: string;
  category: number;
}
```
````

### Response

```typescript
type CreateExerciseResponse = Exercise | ValidationError;
```

### Errors

- `400` - Validation error
- `401` - Unauthorized

````

## ADR Template

```markdown
# ADR-NNN: Title

## Status
Proposed / Accepted / Deprecated

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing or have agreed to implement?

## Consequences
What becomes easier or more difficult to do?
````
