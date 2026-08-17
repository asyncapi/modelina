# Modelina

Code generation library for generating data models from standards such as AsyncAPI, OpenAPI, JSON Schema, Avro, XSD, and more. Generates to TypeScript, Java, Python, Go, Rust, C#, PHP, Dart, Kotlin, C++, Scala, and JavaScript.

## Code Patterns

See `.cursorrules` for comprehensive coding standards covering:
- Strict TypeScript mode, explicit return types, no `any` types
- `async/await` over Promise chains
- PascalCase for classes/interfaces, camelCase for functions, UPPER_SNAKE_CASE for constants
- Semicolons required, no unused imports
- No `console.log` in production code — use the logging interface

## Architecture Overview

```
Input (AsyncAPI/OpenAPI/Swagger/JSON Schema/Avro/XSD/TypeScript)
  → InputProcessor routes to format-specific processor (src/processors/)
  → Interpreter converts schema → CommonModel (src/interpreter/)
  → CommonModelToMetaModel converts → MetaModel (src/helpers/)
  → Constraints transform → ConstrainedMetaModel (src/generators/{lang}/constrainer/)
  → Generator renders → Output code (src/generators/{lang}/)
```

## Agents

Use specialized agents instead of exploring manually:

| Need | Agent |
|------|-------|
| Find files/components | `codebase-locator` |
| Understand generators (`src/generators/`) | `codegen-analyzer` |
| Understand input processing (`src/processors/`, `src/interpreter/`) | `input-analyzer` |
| Find similar implementations | `codebase-pattern-finder` |
| Find existing research/plans | `thoughts-locator` |
| Extract insights from documents | `thoughts-analyzer` |
| External web research | `web-search-researcher` |

## Test Commands

- **All tests**: `npm test`
- **Library tests**: `npm run test:library`
- **Update snapshots**: `npm run test:library:update`
- **Example tests**: `npm run test:examples`
- **Runtime tests**: `npm run test:runtime:{language}` (e.g., `test:runtime:typescript`)
- **Specific test**: `npm run test:library -- -t "test name"`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Lint fix**: `npm run lint:fix`
- **Format**: `npm run format`
- **Type check**: `npx tsc --noEmit`

## Commits

- Include `Co-Authored-By: Claude <noreply@anthropic.com>`
- Never commit directly to `main`

## Documents

- **Plans**: `.claude/thoughts/shared/plans/YYYY-MM-DD-description.md`
- **Research**: `.claude/thoughts/shared/research/YYYY-MM-DD-description.md`
- **Progress**: `.claude/thoughts/shared/progress/{plan-name}-status.json`

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/generators/` | Language-specific code generators |
| `src/processors/` | Input format processors (AsyncAPI, OpenAPI, JSON Schema, etc.) |
| `src/interpreter/` | Schema interpretation logic (schema → CommonModel) |
| `src/models/` | Type definitions, MetaModel, ConstrainedMetaModel, schema models |
| `src/helpers/` | Shared utilities (constraints, formatting, conversions) |
| `src/utils/` | General utilities (guards, logging) |
| `test/` | Tests mirroring `src/` structure |
| `examples/` | Usage examples and integration demos |
| `docs/` | Project documentation |
| `modelina-cli/` | CLI tool (separate package) |
| `modelina-website/` | Website (Next.js app) |
