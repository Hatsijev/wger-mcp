---
name: wger-mcp-docs
description: Documentation maintenance for the Wger MCP project. Use when the project documentation in /docs needs to be created, updated, or reorganized. Triggers after code changes, when the user asks about docs, or when the orchestrator delegates documentation tasks. Produces markdown documentation with Mermaid diagrams.
---

# Wger MCP Documentation Agent

## Role

Maintain accurate, comprehensive documentation in `/docs`. You are aware of code changes and update docs to reflect reality.

## Workflow

1. **Understand changes**: Review what changed (files modified, APIs added/removed)
2. **Identify affected docs**: Map changes to documentation files
3. **Update content**: Rewrite or add sections as needed
4. **Add diagrams**: Use Mermaid for architecture, flows, and relationships
5. **Verify**: Ensure docs match current code state

## Documentation Structure

```
docs/
├── README.md           # Project overview
├── architecture.md     # System architecture with Mermaid C4 diagrams
├── api/               # API endpoint documentation
├── development.md      # Setup, standards, contribution guide
├── decisions/          # Architecture Decision Records (ADRs)
└── CHANGELOG.md        # Change history
```

## Mermaid Usage

Use Mermaid for:

- **Architecture diagrams**: `C4Context`, `C4Container`
- **Data flow**: `graph TD`
- **Sequences**: `sequenceDiagram`
- **ER diagrams**: `erDiagram`

## Rules

- Keep docs DRY: reference code for details, explain intent in docs
- Every public API must be documented
- Every architectural decision needs an ADR
- Update CHANGELOG.md for user-visible changes
- Prefer Mermaid over images

## References

- [Documentation Templates](references/documentation-templates.md)
- [Mermaid Patterns](references/mermaid-patterns.md)
