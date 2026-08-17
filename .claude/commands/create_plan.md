---
description: Create detailed implementation plans through interactive research and iteration
---


# Implementation Plan

You are tasked with creating detailed implementation plans through an interactive, iterative process. You should be skeptical, thorough, and work collaboratively with the user to produce high-quality technical specifications.

## Initial Response

When this command is invoked:

1. **Check if parameters were provided**:

   - If a file path or issue reference was provided as a parameter, skip the default message
   - Immediately read any provided files FULLY
   - Begin the research process

2. **If no parameters provided**, respond with:

```
I'll help you create a detailed implementation plan. Let me start by understanding what we're building.

Please provide:
1. The task/issue description (or reference to a GitHub issue)
2. Any relevant context, constraints, or specific requirements
3. Links to related research or previous implementations

I'll analyze this information and work with you to create a comprehensive plan.

Tip: You can also invoke this command with an issue reference directly: `/create_plan GitHub issue #1234`
For deeper analysis, try: `/create_plan think deeply about GitHub issue #1234`
```

Then wait for the user's input.

## Research Path Decision

After reading any provided files, determine which path to follow:

**PATH A: Comprehensive Research Available**

- User explicitly provides a research document path, OR
- GitHub issue number mentioned AND matching research found in `.claude/thoughts/shared/research/*GH-XXXX*.md`
- **Flow**: Read research → Present summary → Get confirmation → Write plan (Step 4)

**PATH B: Lightweight Research Required**

- No comprehensive research document available
- **Flow**: Initial research → Deeper discovery → Structure development → Write plan (Step 4)

---

## PATH A: Using Comprehensive Research

### Step A1: Read Research Document

1. **Read the research document FULLY** into main context
2. **DO NOT read any other files directly** - trust the research document contains all necessary information

### Step A2: Present Summary and Get Confirmation

Present to user:

```
Based on the research at [path], I understand we need to [accurate summary].

Key findings from the research:
- [Key finding 1 with file:line reference from research]
- [Key finding 2 with pattern/constraint]
- [Important architectural decision]

The research was comprehensive and includes all implementation details.
I'm ready to create the implementation plan based on these findings.

Any clarifications or changes before I proceed?
```

### Step A3: Skip to Plan Writing

After user confirms, proceed directly to **Step 4: Write Plan**

---

## PATH B: Lightweight Research

**IMPORTANT**: Use extended thinking throughout this path to deeply reason about the problem space, architecture, and implementation approach.

As you think, consider:

- What assumptions am I making that need verification?
- What could break if related code changes?
- Are there edge cases not explicitly covered?
- How does this fit with existing architectural patterns?
- What dependencies or side effects exist?
- Could this change affect generated output (breaking change)?
- Does this need to be applied across multiple language generators?

### Step B1: Initial Context Gathering

1. **Read all mentioned files FULLY**:

   - Issue files or GitHub issues
   - If GitHub issue URL provided: use `gh issue view <number> --json title,body,labels,comments --repo asyncapi/modelina`
   - Any JSON/data files mentioned
   - **IMPORTANT**: Read entire files (no limit/offset parameters)

2. **Spawn initial research agents in parallel** with pattern-focused prompts:

   - **codebase-locator** - "Find all files related to [task]. Also identify utility functions for [common operations like naming, type mapping, etc.]"
   - **codegen-analyzer** - "Analyze the current implementation of [generator/renderer/preset/constrainer] and identify its interface contracts and dependencies" (use for `src/generators/` questions)
   - **input-analyzer** - "Analyze how [input format] is processed and transformed into MetaModel" (use for `src/processors/` and `src/interpreter/` questions)
   - **codebase-pattern-finder** - "Find reference implementations for similar [generators/presets/constrainers/processors] to identify structural patterns"

   **Pattern Research is Contextual** - Look for patterns that match what you're building:

   - Working on a **Generator**? → Find other language generators in `src/generators/`
   - Working on a **Renderer**? → Find renderers in the same or similar language generator
   - Working on a **Preset**? → Find preset examples in `src/generators/*/presets/`
   - Working on a **Constrainer**? → Find constrainers in `src/generators/*/constrainer/`
   - Working on a **Processor**? → Find other input processors in `src/processors/`
   - Working on an **Interpreter module**? → Find similar interpreter functions in `src/interpreter/`
   - Working on a **DependencyManager**? → Find other dependency managers in `src/generators/*/`

   For each component type, focus on:

   - **Generators:** Abstract method implementations, options handling, preset wiring, output model construction
   - **Renderers:** Rendering hooks, block formatting, indent handling, dependency injection
   - **Presets:** Hook structure (self, property, ctor, getter, setter, additionalContent), content chaining
   - **Constrainers:** Naming rules (model names, property keys, enum keys/values), type mapping, reserved keywords
   - **Processors:** Input parsing, schema normalization, CommonModel construction
   - **Interpreters:** Schema interpretation rules, MetaModel construction, allOf/oneOf/anyOf handling

3. **Read all files identified by research agents FULLY**

4. **Think deeply and analyze**:

   - Cross-reference issue requirements with actual code
   - Identify discrepancies or misunderstandings
   - Note assumptions that need verification
   - Consider edge cases and architectural implications
   - **Assess breaking change risk** - will this change generated output?
   - **Assess cross-language impact** - does this need changes in multiple generators?

5. **Present informed understanding**:

   ```
   Based on the issue and my research of the codebase, I understand we need to [accurate summary].

   I've found that:
   - [Current implementation detail with file:line reference]
   - [Relevant pattern or constraint discovered]
   - [Potential complexity or edge case identified]

   Questions that my research couldn't answer:
   - [Specific technical question that requires human judgment]
   - [Design preference that affects implementation]
   ```

   Only ask questions you genuinely cannot answer through code investigation.

### Step B2: Deeper Discovery

After getting initial clarifications:

1. **If user corrects any misunderstanding**:

   - DO NOT just accept the correction
   - Spawn new research agents to verify
   - Read the specific files/directories they mention
   - Only proceed once verified

2. **Create research todo list** using TodoWrite

3. **Spawn parallel research agents for deeper investigation**:

   - **codebase-locator** - Find more specific files
   - **codegen-analyzer** - Understand generator implementation details
   - **input-analyzer** - Understand input processing details
   - **codebase-pattern-finder** - Find similar features to model after

   **Pattern Research Focus:**
   When using codebase-pattern-finder, look for:

   - Reference implementations in the SAME language generator (local conventions matter)
   - Specific structural patterns: constructor parameters, method signatures, return types
   - How similar generators handle edge cases (empty models, nested types, circular references)
   - Common utilities being used instead of manual implementations (from `src/helpers/`)

4. **Wait for ALL agents to complete**

5. **Think deeply about design options**:

   - Reason through multiple implementation approaches
   - Consider trade-offs, performance implications, maintainability
   - Evaluate alignment with existing patterns
   - Identify potential risks and mitigation strategies
   - **Consider snapshot test impact** - what will change in generated output?
   - **Consider runtime test impact** - will generated code still compile/run?

6. **Present findings and design options**:

   ```
   Based on my research, here's what I found:

   **Current State:**
   - [Key discovery about existing code]
   - [Pattern or convention to follow]

   **Design Options:**
   1. [Option A] - [pros/cons]
   2. [Option B] - [pros/cons]

   **Breaking Change Assessment:**
   - [Will this change generated output? How?]
   - [Which languages are affected?]

   **Open Questions:**
   - [Technical uncertainty]
   - [Design decision needed]

   Which approach aligns best with your vision?
   ```

### Step B3: Plan Structure Development

Once aligned on approach:

1. **Create initial plan outline following TDD structure**:

   ```
   Here's my proposed plan structure (following TDD red-green-refactor):

   ## Overview
   [1-2 sentence summary]

   ## Implementation Phases:
   [Dynamic number of phases based on what needs to change]
   - Model/Type Updates (if needed)
   - For each component: Write Tests (TDD - RED) → Implement (TDD - GREEN)
   - Examples & Documentation (REQUIRED for any feature)
   - Runtime Tests (REQUIRED - verify generated code is semantically correct)
   - Update Snapshot Tests
   - Verify All Tests Pass (TDD - GREEN verification)
   - Refactor (TDD - REFACTOR)

   Does this phasing make sense? Should I adjust the order or granularity?
   ```

   **Key principles for phase ordering**:
   - The number of phases is DYNAMIC - adapt to the scope of the change (a small bug fix may need 4 phases, a new generator may need 15+)
   - Start with model/type changes in `src/models/` (no tests needed for type additions)
   - For each component, pair RED (write tests) with GREEN (implement)
   - Examples and documentation are MANDATORY for any feature (a feature without docs and examples doesn't exist)
   - Runtime tests are MANDATORY (unit/snapshot tests verify correct code generation, runtime tests verify the generated code is semantically correct)
   - Snapshot test review near the end (after implementation stabilizes)
   - Always end with verification and refactor phases

2. **Get feedback on structure** before writing details

---

## Step 4: Write Plan (Both Paths Converge Here)

After structure approval:

**TDD Phase Structure (MANDATORY):**

All implementation plans MUST follow Test-Driven Development (TDD). Structure phases using the red-green-refactor cycle:

1. **Model/Type changes first** (if needed - no tests required for type additions)
2. **For each component to implement**:
   - **Phase N: Write Tests (RED)**: Write failing tests for the component
   - **Phase N+1: Implement (GREEN)**: Implement just enough to make tests pass
3. **Examples & Documentation** (REQUIRED for any feature):
   - **Phase: Add Example**: Create working example in `examples/` with test
   - **Phase: Update Documentation**: Update relevant docs in `docs/`
4. **Runtime Tests** (REQUIRED):
   - **Phase: Runtime Verification**: Add/update runtime tests to verify generated code is semantically correct (compiles, runs, behaves correctly)
5. **Final phases**:
   - **Phase: Update Snapshots**: Review and update snapshot tests (`npm run test:library:update`)
   - **Phase: Verify All Tests Pass**: Run full test suite
   - **Phase: Refactor (REFACTOR)**: Clean up code while keeping tests green

**The number of phases is dynamic** - scale to what the change requires. A small constrainer fix may need 5 phases. A new language generator may need 20+. Don't force a fixed count.

**Example phase naming (small change - constrainer fix)**:
- Phase 1: Write Tests for Enum Key Constrainer (TDD - RED)
- Phase 2: Fix Enum Key Constrainer (TDD - GREEN)
- Phase 3: Update Example & Documentation
- Phase 4: Runtime Test Verification
- Phase 5: Verify All Tests Pass

**Example phase naming (large change - new feature across generators)**:
- Phase 1: MetaModel Type Updates
- Phase 2: Write Tests for TypeScript Constrainer (TDD - RED)
- Phase 3: TypeScript Constrainer Implementation (TDD - GREEN)
- Phase 4: Write Tests for TypeScript Renderer Hooks (TDD - RED)
- Phase 5: TypeScript Renderer Implementation (TDD - GREEN)
- Phase 6: Apply to Other Language Generators
- Phase 7: Add Examples in `examples/`
- Phase 8: Update Documentation in `docs/`
- Phase 9: Add/Update Runtime Tests
- Phase 10: Update Snapshot Tests
- Phase 11: Verify All Tests Pass (TDD - GREEN verification)
- Phase 12: Refactor (TDD - REFACTOR)

**Test-First Guidelines**:
- Tests MUST be written BEFORE implementation for each component
- Each RED phase should specify:
  - Test file location (mirroring `src/` structure under `test/`)
  - Specific test cases to write
  - Expected outcome: "All tests FAIL (function doesn't exist yet)"
- Each GREEN phase should reference the tests from previous RED phase
- Include refactor phase at end for cleanup while tests stay green

**Pre-Write Validation:**

Before writing the plan file, verify:

- [ ] All referenced files and patterns actually exist in the codebase
- [ ] Breaking change impact is clearly documented
- [ ] Cross-language impact is assessed (which generators need changes)
- [ ] Snapshot test changes are anticipated and described
- [ ] Plan includes example and documentation phases (features without docs/examples don't exist)
- [ ] Plan includes runtime test phases (generated code must be semantically verified)

**Document Pattern Decisions:**
At the top of the plan (before Overview), include a "Pattern Decisions" section that documents:

```markdown
**Pattern Decisions**:

- [Component] pattern: [chosen approach] (based on: [reference file])
- [Another component]: [pattern] (based on: [reference])
- Utilities identified: [list with file paths]
- Affected generators: [list of languages]
```

Example:

```markdown
**Pattern Decisions**:

- Constrainer pattern: Partial override with custom NAMING_FORMATTER (based on: src/generators/typescript/constrainer/TypeScriptConstrainer.ts)
- Preset hook: additionalContent for new methods (based on: src/generators/java/presets/JacksonPreset.ts)
- Utilities identified: NO_SPECIAL_CHAR, NO_RESERVED_KEYWORDS (src/helpers/Constraints.ts)
- Affected generators: TypeScript, JavaScript (other languages unaffected)
```

1. **Write the plan** to `.claude/thoughts/shared/plans/YYYY-MM-DD-GH-XXXX-description.md`

   - **Use the template at `.claude/templates/implementation_plan.md`** as the structure for the plan
   - Format: `YYYY-MM-DD-GH-XXXX-description.md` where:
     - YYYY-MM-DD is today's date
     - GH-XXXX is the GitHub issue number (omit if no issue)
     - description is a brief kebab-case description
   - Examples:
     - With issue: `.claude/thoughts/shared/plans/2026-02-08-GH-1478-add-kotlin-sealed-classes.md`
     - Without issue: `.claude/thoughts/shared/plans/2026-02-08-improve-constraint-pipeline.md`

2. **Generate progress JSON** at `.claude/thoughts/shared/progress/{plan-name}-status.json`

   Extract phase information from the plan and create a status file:
   ```json
   {
     "plan": "{plan-name}.md",
     "current_phase": 1,
     "total_phases": 8,
     "phases": [
       {"id": 1, "name": "[Phase 1 name from plan]", "status": "pending"},
       {"id": 2, "name": "[Phase 2 name from plan]", "status": "pending"}
     ]
   }
   ```

### Step 5: Sync and Review

1. **Present the draft plan location**:

   ```
   I've created the initial implementation plan at:
   `.claude/thoughts/shared/plans/YYYY-MM-DD-GH-XXXX-description.md`

   Progress tracker created at:
   `.claude/thoughts/shared/progress/YYYY-MM-DD-GH-XXXX-description-status.json`

   Please review the plan and let me know:
   - Are the phases properly scoped?
   - Are the success criteria specific enough?
   - Any technical details that need adjustment?
   - Missing edge cases or considerations?
   - Is the breaking change assessment accurate?
   ```

2. **Iterate based on feedback** - be ready to:

   - Add missing phases
   - Adjust technical approach
   - Clarify success criteria
   - Add/remove scope items
   - Reassess cross-language impact

3. **Continue refining** until the user is satisfied

## Important Guidelines

1. **Be Skeptical**:

   - Question vague requirements
   - Identify potential issues early
   - Ask "why" and "what about"
   - Don't assume - verify with code

1. **Do NOT Include**:

   - Time estimates or effort calculations (wasted tokens, no value)
   - Timeline projections or duration guesses
   - Any section not explicitly in the plan template

1. **Be Interactive**:

   - Don't write full plan in one shot (except when comprehensive research available)
   - Get buy-in at each step during lightweight research
   - Allow course corrections at any stage
   - Work collaboratively throughout the process

1. **Be Thorough**:

   - Read all context files COMPLETELY before planning
   - Research actual code patterns using parallel sub-tasks
   - Include specific file paths and line numbers
   - Write measurable success criteria
   - Automated checks should reference CI/CD quality gates: `npm run test:library`, `npm run lint`, `npm run build`

1. **Be Practical**:

   - Focus on incremental, testable changes
   - Consider backward compatibility and breaking changes
   - Think about edge cases
   - Include "what we're NOT doing"
   - Consider which language generators are affected and which are not

1. **Follow TDD Structure**:

   - ALWAYS structure phases around red-green-refactor cycle
   - Model/type changes first (no tests needed for type additions)
   - For each component: Write Tests (RED) → Implement (GREEN)
   - ALWAYS include examples and documentation phases (a feature without docs/examples doesn't exist)
   - ALWAYS include runtime test phases (unit tests verify correct code generation, runtime tests verify the generated code is semantically correct)
   - End with: Update Snapshots → Verify Tests Pass → Refactor
   - Label each phase clearly: "(TDD - RED)", "(TDD - GREEN)", "(TDD - REFACTOR)"
   - Specify expected test outcomes in each phase
   - Number of phases is DYNAMIC - adapt to the scope of the change

1. **Write Intent-Focused Code Guidance**:

   The implementation agent will read actual files and use specialized agents to analyze patterns. Don't write complete implementations - focus on INTENT and CONSTRAINTS.

   **For each change, provide**:

   - **Location**: File path + line numbers or method name
   - **What to change**: Brief description (e.g., "Add new preset hook `additionalContent`")
   - **Key implementation notes**: Critical decisions as bullet points:
     - Design constraints (e.g., "Must preserve content from previous preset in the chain")
     - Required behavior (e.g., "Must handle both ConstrainedObjectModel and ConstrainedEnumModel")
     - Edge cases to handle (e.g., "Handle circular references gracefully")
   - **Optional code sketch**: Only when the approach is non-obvious (complex conditionals, subtle logic)
     - Show the STRUCTURE, not complete implementation
     - Include inline comments explaining WHY, not WHAT

   **Example of minimal guidance**:

   ```
   **File**: src/generators/typescript/constrainer/TypeScriptConstrainer.ts
   **Change**: Add handling for new type in typeMapping
   **Key notes**:
   - Must map to native TypeScript type (e.g., `bigint` for integer types > 32-bit)
   - Follow existing typeMapping pattern for other types
   - Update ConstrainedMetaModel types if new mapping target needed
   - Update snapshot tests in test/generators/typescript/constrainer/
   ```

   **When to include code sketch**:

   ```typescript
   // Only show structure for complex/subtle logic:
   if (model instanceof ConstrainedUnionModel) {
     // Render each union member type
     // WHY: Union types need special handling per language
   } else if (model instanceof ConstrainedObjectModel) {
     // Use standard class/interface rendering
     // WHY: Most languages map objects to classes
   }
   ```

1. **Track Progress**:

   - Use TodoWrite to track planning tasks
   - Update todos as you complete research
   - Mark planning tasks complete when done

1. **When to Stop and Ask**:

   You should work autonomously as much as possible, but stop and ask when:

   - Files or components referenced in the issue/requirements don't exist
   - Requirements directly contradict each other or existing code patterns
   - You need design decisions that only the user can make
   - Multiple valid implementation approaches exist with significantly different trade-offs
   - Your proposed implementation would break established codebase patterns
   - After thorough research, you still can't resolve a critical technical uncertainty
   - A change would affect generated output in ways that constitute a breaking change

   When blocked, present the issue clearly with your research findings and specific options. Don't proceed with unresolved blockers, but also don't stop for things you can research or infer from the codebase.

1. **No Open Questions in Final Plan**:
   - If you encounter open questions during planning, STOP
   - Research or ask for clarification immediately
   - Do NOT write the plan with unresolved questions
   - The implementation plan must be complete and actionable
   - Every decision must be made before finalizing the plan

## Common Patterns

### For New Language Generators:

- Start from the template generator at `src/generators/template/` (minimal scaffolding for new languages)
- Implement AbstractGenerator methods
- Create Renderer with all required hooks
- Add Constrainer with language-specific rules
- Add DependencyManager
- Write comprehensive unit tests with snapshot verification
- Add runtime tests to verify generated code compiles and runs correctly
- Add examples in `examples/` (REQUIRED - a feature without examples doesn't exist)
- Add documentation in `docs/languages/` and `docs/constraints/` (REQUIRED)

### For New Presets:

- Research existing presets in same language generator
- Define hook structure (which hooks to implement)
- Ensure content chaining (preserve content from previous preset)
- Write unit tests with snapshot verification
- Add runtime tests to verify generated code with preset is semantically correct
- Add example in `examples/` (REQUIRED)
- Update preset documentation in `docs/presets.md` (REQUIRED)

### For Constrainer Changes:

- Prefer partial override (just NAMING_FORMATTER) over complete override
- Verify no name collisions after transformation
- Test edge cases: special chars, numbers, reserved words, empty strings
- Consider impact on all model types (objects, enums, unions)
- Add/update runtime tests to verify constrained names produce valid code
- Update constraint documentation in `docs/constraints/` (REQUIRED)
- Add/update examples demonstrating the constraint behavior (REQUIRED)

### For New Input Processors:

- Research existing processors for patterns
- Implement InputProcessor interface
- Add schema parsing and validation
- Transform to CommonModel/MetaModel
- Add comprehensive unit test cases with sample schemas
- Update InputProcessor routing in `src/processors/InputProcessor.ts`
- Add runtime tests to verify generated output from the new input format is semantically correct
- Add documentation in `docs/inputs/` (REQUIRED)
- Add examples demonstrating the new input format (REQUIRED)

### For Interpreter Changes:

- Understand the full interpretation chain
- Consider allOf/oneOf/anyOf implications
- Test with various schema combinations
- Verify MetaModel output is correct for all generators
- Add runtime tests across affected languages to verify semantic correctness
- Update documentation if interpretation behavior changes (REQUIRED)
- Add/update examples if user-facing behavior changes (REQUIRED)

### For Refactoring:

- Document current behavior with existing tests
- Plan incremental changes
- Maintain backward compatibility in public API
- Review snapshot changes carefully
- Run runtime tests to verify generated code still works (semantically correct)
- Update documentation if user-facing behavior changes (REQUIRED)
- Update examples if API surface changes (REQUIRED)

## Sub-task Spawning Best Practices

When spawning research sub-tasks:

1. **Spawn multiple tasks in parallel** for efficiency
2. **Each task should be focused** on a specific area
3. **Provide detailed instructions** including:
   - Exactly what to search for
   - Which directories to focus on
   - What information to extract
   - Expected output format
4. **Be specific about directories**:
   - Generator code: `src/generators/{language}/`
   - Input processing: `src/processors/`
   - Interpretation: `src/interpreter/`
   - Models/types: `src/models/`
   - Helpers/utilities: `src/helpers/`
   - Tests: `test/generators/{language}/`, `test/processors/`, etc.
   - Always use the exact directory path
5. **Specify read-only tools** to use
6. **Request specific file:line references** in responses
7. **Wait for all tasks to complete** before synthesizing
8. **Verify sub-task results**:
   - If a sub-task returns unexpected results, spawn follow-up tasks
   - Cross-check findings against the actual codebase
   - Don't accept results that seem incorrect

Example of spawning multiple tasks:

```
# Use the Task tool to spawn specialized agents concurrently:
- codegen-analyzer: "Analyze how the TypeScript generator handles union types in src/generators/typescript/"
- input-analyzer: "Find how the OpenAPI processor transforms discriminator schemas in src/processors/"
- codebase-pattern-finder: "Find examples of preset implementations that add import dependencies"
- codebase-locator: "Find all files related to enum constraint handling across all generators"
```

## Pattern Research for Planning

When researching during planning:

- Use codebase-pattern-finder to identify which patterns exist
- Document the reference files in the "Pattern Decisions" section
- Focus on IDENTIFYING patterns, not learning every detail
- The implementation agent will do deeper pattern research when actually writing code

**Example research for planning**:

```
Agent: codebase-pattern-finder
Prompt: "Find a constrainer in the Java generator that handles reserved keyword collisions. I need to document which pattern to follow."
```

Result: Document in plan as "Constrainer pattern: Standard pipeline with NO_RESERVED_KEYWORDS (based on: src/generators/java/constrainer/JavaConstrainer.ts)"
