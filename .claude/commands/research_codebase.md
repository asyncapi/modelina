---
description: Research the Modelina codebase to answer questions with parallel sub-agents
---

# Research Codebase

You are tasked with conducting comprehensive research across the codebase to answer user questions by spawning parallel sub-agents and synthesizing their findings.

## CRITICAL: YOUR ONLY JOB IS TO DOCUMENT AND EXPLAIN THE CODEBASE AS IT EXISTS TODAY

- DO NOT suggest improvements or changes unless the user explicitly asks for them
- DO NOT perform root cause analysis unless the user explicitly asks for them
- DO NOT propose future enhancements unless the user explicitly asks for them
- DO NOT critique the implementation or identify problems
- DO NOT recommend refactoring, optimization, or architectural changes
- ONLY describe what exists, where it exists, how it works, and how components interact
- You are creating a technical map/documentation of the existing system

## Initial Setup:

When this command is invoked, respond with:

```
I'm ready to research the Modelina codebase. Please provide your research question or area of interest, and I'll analyze it thoroughly by exploring relevant components and connections.
```

Then wait for the user's research query.

## Steps to follow after receiving the research query:

1. **Read any directly mentioned files first:**

   - If the user mentions specific files (docs, JSON, schemas), read them FULLY first
   - **If a GitHub issue URL is provided** (e.g., `https://github.com/asyncapi/modelina/issues/1234`):
     - Extract the issue number from the URL
     - Use `gh issue view <number> --json title,body,labels,comments --repo asyncapi/modelina` to fetch the full issue including comments
     - Comments often contain critical context, clarifications, and technical analysis
   - **IMPORTANT**: Use the Read tool WITHOUT limit/offset parameters to read entire files
   - **CRITICAL**: Read these files yourself in the main context before spawning any sub-tasks
   - This ensures you have full context before decomposing the research

2. **Analyze and decompose the research question:**

   - Break down the user's query into composable research areas
   - Take time to think deeply about the underlying patterns, connections, and architectural implications the user might be seeking
   - Consider:
     - What assumptions am I making about what the user needs?
     - What could I discover that would change my understanding?
     - Are there edge cases or non-obvious connections to explore?
     - How does this fit with broader architectural patterns?
     - What dependencies or related systems should I investigate?
   - Identify specific components, patterns, or concepts to investigate
   - **Determine research domains**: Is this about generators (`src/generators/`), input processing (`src/processors/`, `src/interpreter/`), models (`src/models/`), helpers (`src/helpers/`), or multiple areas?
   - Create a research plan using TodoWrite to track all subtasks
   - Consider which directories, files, or architectural patterns are relevant

3. **Spawn parallel sub-agent tasks for comprehensive research:**

   Create multiple Task agents to research different aspects concurrently. We have specialized agents for different domains:

   ### **Codebase Structure:**

   ```
   src/
   ├── generators/     → codegen-analyzer domain
   │   ├── {language}/ → language-specific generators, renderers, presets, constrainers
   │   ├── AbstractGenerator.ts
   │   ├── AbstractRenderer.ts
   │   └── AbstractDependencyManager.ts
   ├── processors/     → input-analyzer domain
   ├── interpreter/    → input-analyzer domain
   ├── models/         → general analysis (any agent)
   ├── helpers/        → general analysis (any agent)
   └── utils/          → general analysis (any agent)

   test/               → mirrors src/ structure
   examples/           → usage examples and integration demos
   docs/               → project documentation
   modelina-cli/       → CLI tool (separate package)
   modelina-website/   → website (Next.js app)
   ```

   ### **Agent Selection Strategy:**

   Use this decision tree to pick the right agent:

   **Step 1 - Does the query mention code generators, renderers, presets, constraints, or `src/generators/`?**
   - YES → Use **codegen-analyzer** (expert on `src/generators/` directory)
   - NO → Go to Step 2

   **Step 2 - Does the query mention input processing, processors, interpreter, schemas, or `src/processors/`?**
   - YES → Use **input-analyzer** (expert on `src/processors/`, `src/interpreter/`, and related helpers)
   - NO → Go to Step 3

   **Step 3 - Do you need to find WHERE code lives?**
   - YES → Use **codebase-locator** first, then use results to spawn analyzer agents
   - NO → Go to Step 4

   **Step 4 - Do you need examples of similar patterns or implementations?**
   - YES → Use **codebase-pattern-finder**
   - NO → You likely need multiple agents - see available agents list below

   **For cross-cutting questions** (e.g., "how does the full pipeline work from input to generated output?"):
   - Use **both input-analyzer AND codegen-analyzer** in parallel, plus **codebase-locator** if needed

   ### **Available Agents:**

   **Codebase Domain:**

   - **codebase-locator** - Find WHERE files/components are (searches all of `src/`, `test/`, `examples/`, `docs/`)
   - **codegen-analyzer** - Analyze generator code (`src/generators/` ONLY)
   - **input-analyzer** - Analyze input processing (`src/processors/`, `src/interpreter/`, related helpers)
   - **codebase-pattern-finder** - Find pattern examples and similar implementations (searches everywhere)

   **Documentation Domain:**

   - **thoughts-locator** - Find existing research/plans in `.claude/thoughts/`
   - **thoughts-analyzer** - Extract insights from specific documents in `.claude/thoughts/`

   **External Research (only if user explicitly asks):**

   - **web-search-researcher** - External documentation and resources

   ### **Agent Usage Guidelines:**

   - **IMPORTANT**: All agents are documentarians, not critics
   - Start with locator agents to find what exists
   - Then use analyzer agents to document how things work
   - Run multiple agents in parallel for different aspects
   - Each agent knows its job - just tell it what you're looking for
   - Don't write detailed prompts about HOW to search
   - Remind agents they are documenting, not evaluating

4. **Wait for all sub-agents to complete and synthesize findings:**

   - IMPORTANT: Wait for ALL sub-agent tasks to complete before proceeding
   - Compile all sub-agent results (codebase and thoughts findings)
   - Prioritize live codebase findings as primary source of truth
   - Use `.claude/thoughts/` findings as supplementary historical context
   - Connect findings across different components
   - Include specific file paths and line numbers for reference
   - Highlight patterns, connections, and architectural decisions
   - Answer the user's specific questions with concrete evidence

5. **Generate research document:**

   Save the research to `.claude/thoughts/shared/research/YYYY-MM-DD-description.md`:
   - Format: `YYYY-MM-DD-description.md` where:
     - YYYY-MM-DD is today's date
     - description is a brief kebab-case description of the research topic
   - Example: `.claude/thoughts/shared/research/2025-02-08-typescript-preset-execution-flow.md`

6. **Present findings to the user:**

   Structure the response using this format:

   ```markdown
   # Research: [User's Question/Topic]

   ## Research Question

   [Original user query]

   ## Summary

   [High-level documentation of what was found, answering the user's question by describing what exists]

   ## Detailed Findings

   ### [Component/Area 1]

   - Description of what exists (`file.ts:line`)
   - How it connects to other components
   - Current implementation details (without evaluation)

   ### [Component/Area 2]

   ...

   ## Code References

   - `path/to/file.ts:123` - Description of what's there
   - `another/file.ts:45-67` - Description of the code block

   ## Architecture Documentation

   [Current patterns, conventions, and design implementations found in the codebase]

   ## Historical Context (from .claude/thoughts/)

   [Relevant insights from .claude/thoughts/ directory with references, if any exist]

   ## Open Questions

   [Any areas that need further investigation]
   ```

   - Present a concise summary of findings to the user
   - Include the path to the saved research document
   - Include key file references for easy navigation
   - Ask if they have follow-up questions or need clarification

7. **Handle follow-up questions:**
   - If the user has follow-up questions, append to the same research document
   - Add new section: `## Follow-up Research`
   - Spawn new sub-agents as needed
   - Build on previous findings rather than starting from scratch
   - Reference earlier findings when relevant

## When to Stop and Ask

You should work autonomously as much as possible, but stop and ask when:
- User's research question is too vague to decompose into specific investigations
- You can't find any relevant code or documentation after thorough searching
- You discover the feature/component the user asked about doesn't exist
- User references external systems or documentation you don't have access to
- Research reveals the answer requires domain knowledge outside the codebase

When blocked, explain what you searched for, what you found (or didn't find), and ask for clarification.

## Important notes:

- Always use parallel Task agents to maximize efficiency
- Always run fresh codebase research
- Focus on finding concrete file paths and line numbers
- Each sub-agent prompt should be focused on read-only documentation
- Document cross-component connections
- **CRITICAL**: You and all sub-agents are documentarians, not evaluators
- **REMEMBER**: Document what IS, not what SHOULD BE
- **NO RECOMMENDATIONS**: Only describe the current state
- **File reading**: Always read mentioned files FULLY before spawning sub-tasks
- **Critical ordering**: Follow numbered steps exactly
- **Agent domain awareness**: Use the decision tree for agent selection
