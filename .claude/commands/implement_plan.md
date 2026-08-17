---
description: Implement technical plans from .claude/thoughts/shared/plans with verification
---


# Implement Plan

You are tasked with implementing an approved technical plan from `.claude/thoughts/shared/plans/`. These plans contain phases with specific changes and success criteria.

## Getting Started

When given a plan path:

- Read the progress JSON at `.claude/thoughts/shared/progress/{plan-name}-status.json` for current phase
- Read the plan completely to understand what needs to be done
- Read the original ticket if referenced
- **Use specialized agents to analyze the codebase** (see Context Management below)
- Think deeply about how the pieces fit together based on agent findings
- Create a todo list to track your progress
- Start implementing if you understand what needs to be done

If no plan path provided, ask for one.

## Context Management

To keep the main conversation context lean and focused on implementation decisions:

- **Use codegen-analyzer agent** to understand how generators, renderers, presets, and constrainers work within `src/generators/`

  - Request focused analysis of specific components, not full directory dumps
  - Example: "Analyze `TypeScriptGenerator` and trace how `ConstrainedObjectModel` is dispatched to `ClassRenderer`"

- **Use input-analyzer agent** to understand input processing within `src/processors/` and `src/interpreter/`

  - Example: "Analyze how `AsyncAPIInputProcessor` converts AsyncAPI schemas to CommonModel"

- **Use codebase-pattern-finder agent** to search for similar patterns in the codebase

  - Even if you don't expect to find patterns, verify assumptions
  - Example: "Find generators that implement custom type mappings for union types"
  - **CRITICAL**: Use this to find reference implementations for the SAME component type you're building
    - Building a preset? Find similar presets in the same or another language generator
    - Adding a constrainer? Look at constrainers in other language generators
    - Creating a renderer? Find renderers for the same model type across languages

- **Use codebase-locator agent** to find where specific files, components, or utilities live

  - Example: "Find all constraint helper functions in src/helpers/"

- **Use thoughts-locator agent** if you need related research/decisions not already referenced in the plan

- **Only read files directly** in the main context when you're about to edit them

  - This keeps full file contents out of context until needed
  - Agent summaries are sufficient for understanding current state

- **Launch agents in parallel** when possible to speed up analysis
  - Example: Run codegen-analyzer and codebase-pattern-finder simultaneously

## Implementation Philosophy

Plans are carefully designed, but reality can be messy. Your job is to:

- Follow the plan's intent while adapting to what you find
- Implement each phase fully before moving to the next
- **Match existing code patterns** - use codebase-pattern-finder agent to find reference implementations
- Verify your work makes sense in the broader codebase context
- Update the progress JSON as you complete phases
- **Be aware of breaking changes** - any change to generated output is a breaking change

**Plans provide WHAT and WHY, you provide HOW**:

- The plan tells you WHAT to build and WHY decisions matter (constraints, edge cases)
- You determine HOW by finding and following existing patterns in the codebase
- Use utilities that already exist (don't reinvent constraint helpers, formatting, type mapping, etc.)
- Match the style of similar components in the same generator or across generators

When things don't match the plan exactly, think about why and communicate clearly. The plan is your guide, but your judgment matters too.

If you encounter a mismatch:

- STOP and think deeply about why the plan can't be followed
- Present the issue clearly:

  ```
  Issue in Phase [N]:
  Expected: [what the plan says]
  Found: [actual situation]
  Why this matters: [explanation]

  How should I proceed?
  ```

## Test-Driven Development (TDD) Approach

**You MUST follow TDD for all code changes:**

1. **For new files**: Create minimal structure first (empty functions/classes with correct signatures) to prevent import errors in tests
2. **For each feature/change**:
   - Write a failing test that validates the desired behavior
   - Run `npm run test:library -- -t "test name"` to confirm it fails for the right reason
   - Write ONLY enough code to make the test pass
   - Run `npm run test:library -- -t "test name"` to confirm it passes
   - Refactor if needed while keeping tests green
3. **Snapshot tests**: Use `expect(result).toMatchSnapshot()` for generated output. Review snapshot changes carefully - any change to generated output is a breaking change.

## Verification Approach

After implementing a phase:

- Run the success criteria checks:
  - Tests: `npm run test:library` (or `npm run test:library -- -t "test name"` for specific tests)
  - Type checking / Build: `npm run build`
  - Linting: `npm run lint`
  - Snapshot review: If snapshots changed, run `npm run test:library:update` only after confirming the changes are intentional
- Fix any issues before proceeding
- Update your progress in both the plan and your todos
- Check off completed items in the plan file itself using Edit

Don't let verification interrupt your flow - batch it at natural stopping points.

## If You Get Stuck

When something isn't working as expected:

- First, make sure you've read and understood all the relevant code
- Consider if the codebase has evolved since the plan was written
- Present the mismatch clearly and ask for guidance

Use sub-tasks sparingly - mainly for targeted debugging or exploring unfamiliar territory.

## When to Stop and Ask

You should work autonomously as much as possible, but stop and ask when:

- Plan references files/APIs that don't exist and you can't find suitable alternatives
- Plan approach directly conflicts with existing code patterns you discovered
- Tests fail in unexpected ways unrelated to your changes
- You need design decisions (e.g., should this be a preset hook or a constrainer change?)
- Implementation requires breaking changes not mentioned in the plan
- You've debugged thoroughly but can't identify root cause of a failure

When blocked, present: what you tried, what happened, what you've learned, and what options you see. Don't stop for things you can research, debug, or reasonably infer from the codebase.

## Session Startup Protocol

Before starting any phase (including first phase), execute this protocol:

1. **Verify working directory**: Run `pwd` to confirm location
2. **Read progress JSON**: Check `.claude/thoughts/shared/progress/{plan-name}-status.json`
   - Identify `current_phase` value
   - Confirm phases array matches plan structure
   - If no JSON exists (legacy plan), determine status from git history
3. **Verify previous work** (if not Phase 1):
   - Run `git log -1 --oneline` to see last commit
   - Confirm previous phase was committed (commit message should reference phase)
4. **Read plan phase**: Go to the phase matching `current_phase` in JSON
5. **Create todos from plan**: Use TodoWrite to track:
   - Session Startup Protocol steps
   - Implementation tasks from "Changes Required"
   - Session Completion steps
6. **Baseline check**: Run `npm run test:library` on affected test files (if any exist) to verify known-good state

## Resuming Work

When continuing an in-progress plan:

1. **Read progress JSON first**: `.claude/thoughts/shared/progress/{plan-name}-status.json`
   - `current_phase` tells you exactly where to resume
   - Status values: "complete", "in_progress", "pending"

2. **Execute Session Startup Protocol** for current phase

3. **Continue implementation** from current phase

**Fallback for legacy plans**: If no progress JSON exists, determine status by reading the plan and checking git history for phase commits.

Remember: You're implementing a solution, not just checking boxes. Keep the end goal in mind and maintain forward momentum.

## Phase Completion Protocol

After completing each phase:

1. **Commit phase work**:
   ```bash
   git add -A
   git commit -m "Phase N: [brief description]

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

2. **Update progress JSON**:
   - Set current phase status to "complete"
   - Increment `current_phase` value
   - Set next phase status to "in_progress" (if continuing)

3. **Verify clean state**:
   - `git status` should show clean working tree
   - Run relevant tests to confirm nothing broken

4. **Update todos**: Mark phase todos as completed, create new todos for next phase

## Pattern Research Guidelines

When implementing, use codebase-pattern-finder agent extensively to match existing code style:

**Pattern Research is Contextual** - Match your research to what you're building:

- **Working on a Generator?** → Find other language generators, examine how they extend `AbstractGenerator` and override methods
- **Working on a Renderer?** → Find renderers for the same model type (e.g., `ClassRenderer`) across other languages
- **Working on a Preset?** → Find similar presets (e.g., serialization presets like `JacksonPreset`, `MarshalPreset`) and see how they use hooks
- **Working on a Constrainer?** → Look at constrainers in other languages, see how they compose constraint helpers
- **Working on a Processor?** → Find how other input processors handle similar schema features
- **Adding to existing class/interface?** → Examine that class's existing methods and patterns

**Pattern Categories by Component:**

- **Generators:** How `generate()` dispatches to renderers, generator options, model type handling
- **Renderers:** Hook orchestration (self, property, ctor, getter, setter, additionalContent), `renderBlock()` usage
- **Presets:** Content layering (prepend/append/overwrite), dependency manager interaction, option patterns for reusable presets
- **Constrainers:** Constraint pipeline composition (NO_SPECIAL_CHAR → NO_NUMBER_START → NO_EMPTY → NO_RESERVED → NO_DUPLICATE → NAMING_FORMATTER)
- **Processors:** Input parsing, schema traversal, CommonModel construction
- **All Implementations:** Existing helpers in `src/helpers/`, type guards in `src/utils/guards.ts`, formatting utilities

**Key Principles:**

1. Search for patterns in the SAME LANGUAGE GENERATOR first - local conventions trump general patterns
2. Look for the SAME TYPE of component - Renderers reference Renderers, Presets reference Presets, etc.
3. When in doubt, find 2-3 examples across different language generators and follow the most common pattern

**Agent Usage Examples:**

```
# Finding preset patterns for serialization
Agent: codebase-pattern-finder
Prompt: "Find presets that add serialization/deserialization methods. Show me 2-3 examples of how they use additionalContent hooks."
```

```
# Finding constraint helper usage
Agent: codebase-locator
Prompt: "Find where NO_SPECIAL_CHAR and NO_RESERVED_KEYWORDS constraint helpers are used across language constrainers."
```

```
# Understanding a specific generator
Agent: codegen-analyzer
Prompt: "Analyze TypeScriptGenerator class. Show how it dispatches ConstrainedObjectModel to renderers and what options affect rendering."
```
