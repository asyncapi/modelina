---
github_issue_url: [Full GitHub issue URL if applicable, otherwise omit this field]
status: draft
related_research: [Path to research document if applicable, otherwise omit this field]
---

# [Feature/Task Name] Implementation Plan

**Related Issue**: [GitHub issue URL as markdown link if applicable, e.g., [GH-1234](https://github.com/asyncapi/modelina/issues/1234)]

---

## Pattern Decisions

Document the architectural patterns chosen for this implementation:

- **[Component type]:** [Pattern choice] (based on: [Reference file with line numbers if helpful])
- **[Another component]:** [Pattern] (based on: [Reference])
- **Utilities identified:** [List utilities to use with file paths]
- **Affected generators:** [List which language generators are impacted]

**Example:**

```markdown
- **Constrainer pattern:** Partial override with custom NAMING_FORMATTER (based on: src/generators/typescript/constrainer/TypeScriptConstrainer.ts)
- **Preset hook:** additionalContent for serialization methods (based on: src/generators/java/presets/JacksonPreset.ts)
- **Renderer pattern:** New hook in ClassRenderer (based on: src/generators/typescript/renderers/ClassRenderer.ts)
- **Utilities identified:** NO_SPECIAL_CHAR, NO_RESERVED_KEYWORDS (src/helpers/Constraints.ts), FormatHelpers (src/helpers/FormatHelpers.ts)
- **Affected generators:** TypeScript, JavaScript (other languages unaffected)
```

---

## Overview

[Brief description of what we're implementing and why]

## Current State Analysis

[What exists now, what's missing, key constraints discovered]

## Desired End State

[A specification of the desired end state after this plan is complete, and how to verify it]

### Key Discoveries:

- [Important finding with file:line reference]
- [Pattern to follow]
- [Constraint to work within]

## Breaking Change Assessment

- **Does this change generated output?** [Yes/No - if yes, explain what changes]
- **Which languages are affected?** [List affected generators]
- **Is this a major version bump?** [Yes/No - any change to generated output is a breaking change]

## What We're NOT Doing

[Explicitly list out-of-scope items to prevent scope creep]

## Implementation Approach

[High-level strategy and reasoning]

## Phase 1: [Descriptive Name]

### Overview

[What this phase accomplishes]

### Session Startup Protocol
1. Verify working directory: `pwd`
2. Check previous phase committed (if not Phase 1): `git log -1 --oneline`
3. Read progress JSON: `.claude/thoughts/shared/progress/{plan-name}-status.json`
4. Confirm current phase matches JSON `current_phase`

### Changes Required:

#### 1. [Component/File Group]

**File**: `path/to/file.ext` (lines X-Y or after method name)
**Change**: [Brief description - e.g., "Add new preset hook for serialization"]

**Key Implementation Notes**:

- Design constraints: [e.g., "Must preserve content from previous preset in the chain"]
- Required behavior: [e.g., "Must handle both ConstrainedObjectModel and ConstrainedEnumModel"]
- Edge cases: [e.g., "Handle circular references gracefully"]
- Return type: [if critical to get right]

**Code Sketch** (only if logic is complex/non-obvious):

```[language]
// Show STRUCTURE, not complete implementation
// Focus on WHY, not WHAT
if (model instanceof ConstrainedUnionModel) {
  // Render each union member as separate type
  // WHY: Union types need language-specific handling
} else if (model instanceof ConstrainedObjectModel) {
  // Use standard class rendering with all hooks
  // WHY: Most languages map objects to classes
}
```

### Success Criteria:

#### Automated Verification:
- Tests pass: `npm run test:library`
- Type checking passes: `npm run build`
- Linting passes: `npm run lint`
- Snapshot tests reviewed: `npm run test:library:update` (if output changed intentionally)

### Session Completion
1. All changes staged: `git add -A`
2. Update progress JSON: set phase 1 to "complete", increment current_phase
3. Verify clean state: `git status` shows clean working tree

---

## Phase 2: [Descriptive Name]

### Overview

[What this phase accomplishes]

### Session Startup Protocol
1. Verify working directory: `pwd`
2. Check previous phase staged: `git diff --cached`
3. Read progress JSON: `.claude/thoughts/shared/progress/{plan-name}-status.json`
4. Confirm current phase matches JSON `current_phase`

### Changes Required:

[Similar structure to Phase 1...]

### Success Criteria:

#### Automated Verification:
- Tests pass: `npm run test:library`
- Type checking passes: `npm run build`
- Linting passes: `npm run lint`

### Session Completion
1. All changes committed: `git add -A && git commit -m "Phase 2: [description]"`
2. Update progress JSON: set phase 2 to "complete", increment current_phase
3. Verify clean state: `git status` shows clean working tree

---

[Continue with as many phases as needed - the number of phases is DYNAMIC based on scope]

---

## Testing Strategy

**IMPORTANT: Follow Test-Driven Development (TDD) for all code**

### TDD Approach:

1. **For new files**: Create minimal structure first (empty functions with correct signatures) to prevent import errors
2. **For each feature**: Write failing test → Run test → Implement → Run test (pass) → Refactor
3. **Verify**: Run `npm run test:library` after each cycle

### Unit Tests:

Unit tests verify that the **correct code is generated** (output correctness).

- [What to test - written BEFORE implementation]
- [Key edge cases]
- Test file locations mirror `src/` structure under `test/`
- Use snapshot testing: `expect(result).toMatchSnapshot()`

### Runtime Tests:

Runtime tests verify that the **generated code is semantically correct** (compiles, runs, behaves correctly).

- [Which language runtime tests need updating: `test/runtime/runtime-{language}/`]
- [What generated code behavior to verify]
- Run with: `npm run test:runtime:{language}` (e.g., `npm run test:runtime:typescript`)

### Examples (REQUIRED):

A feature without examples doesn't exist. Examples serve as both documentation and integration tests.

- [Example to create/update in `examples/`]
- Each example must include: `index.ts`, `index.spec.ts`, `package.json`, `README.md`
- Use `examples/TEMPLATE/` as starting point for new examples

### Documentation (REQUIRED):

A feature without documentation doesn't exist.

- [Docs to create/update in `docs/`]
- [Language-specific docs: `docs/languages/{Language}.md`]
- [Constraint docs: `docs/constraints/{Language}.md`]
- [Other docs: `docs/presets.md`, `docs/usage.md`, etc.]

## Breaking Change Notes

[If this changes generated output, document exactly what changes and why. Any change to generated output is a breaking change requiring a major version bump.]

## References

- Similar implementation: `[file:line]`
- Related documentation: `[docs path]`
