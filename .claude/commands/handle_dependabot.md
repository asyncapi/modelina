---
description: Consolidate open Dependabot PRs and security alerts into a single npm upgrade branch, validate against the full test suite, and open one PR
argument-hint: "[--skip-tests]"
---

# Handle Dependabot PRs

Consolidate open Dependabot PRs and security alerts into one upgrade branch.

**Workflow:** Research (subagent) → Plan & confirm → Execute → Validate → PR

**Scope:** `.github/dependabot.yml` configures **npm at the repo root only** (monthly, excluding `examples/**` and `test/**`). There is one manifest (`package.json`) and one lockfile (`package-lock.json`). The nested `mcp-server/` and `website/` packages and the runtime fixture in `test/runtime/typescript/` are **not** covered by Dependabot — leave them alone unless the user asks. No Python, no GitHub Actions ecosystem.

**Artifacts:**
- Research: `.claude/thoughts/shared/research/{date}-dependabot-upgrade.json`
- Plan: `.claude/thoughts/shared/plans/{date}-dependabot-upgrade.md`

## Phase 1: Research (subagent)

Spawn a `general-purpose` subagent with these instructions:

> **Research Dependabot upgrades for this repo. Write findings to `.claude/thoughts/shared/research/{date}-dependabot-upgrade.json`.**
>
> 1. **Open Dependabot PRs:**
>    ```bash
>    gh pr list --author "app/dependabot" --json number,title,headRefName,url --state open --limit 100
>    ```
>    If none and no open alerts, write `{ "empty": true }` and stop.
>
> 2. **Open security alerts**, cross-referenced with those PRs:
>    ```bash
>    gh api repos/{owner}/{repo}/dependabot/alerts --paginate --jq '[.[] | select(.state == "open")]'
>    ```
>    An alert is *uncovered* if no PR bumps that package to at least the fix version.
>
> 3. **For each PR:**
>    - Parse package + target version from the title.
>    - Read the **actual** current version from `package.json` — PR titles go stale.
>    - Resolve the newest release: `npm view {package} version`. Dependabot often proposes only the minimum fix version.
>    - Record dep type (`dependencies` / `devDependencies` / `peerDependencies`).
>    - Compute bump type from **latest** vs current.
>    - Check the package's `engines.node` against this repo's `>=22.0.0`.
>
> 4. **Stale PRs:** package no longer in `package.json`, or the bump is already satisfied → mark stale with a reason.
>
> 5. **Uncovered alerts on transitive deps:** find the parent chain with `npm ls {package}`. Record the parent to upgrade; never install a transitive dep directly.
>
> 6. **Major bumps — deep research.** WebSearch for "{package} v{major} migration guide" and its changelog. Classify each breaking change:
>    - **User-visible** — changes the *generated output* of the CLI or the config surface. `@asyncapi/modelina`, `@asyncapi/parser`, the OpenAPI/JSON-Schema parsers, and `oclif` all fall here: their output ends up in users' generated code or in the CLI's command interface.
>    - **Internal-only** — build, lint, or test tooling with no effect on emitted artifacts (typescript, jest, eslint, prettier, rimraf, ts-node).
>
>    Decision rule: internal-only → `upgrade: true` with migration steps. Any user-visible break → `upgrade: true` **only if** the output delta is intended and reviewable; otherwise `upgrade: false` with a reason. Note effort: trivial / moderate / significant.
>
> 7. **Record any `overrides` entries** in `package.json` (npm's equivalent of yarn `resolutions`) for later reconciliation. There are none today — flag it if that changed.
>
> **Output JSON:**
> ```json
> {
>   "production": [{ "pr": 123, "package": "...", "current": "...", "target": "...", "latest": "...", "bump": "patch" }],
>   "development": [...],
>   "stale": [{ "pr": 123, "package": "...", "reason": "..." }],
>   "uncovered_alerts": [{ "alert": 1, "package": "...", "fix": "...", "severity": "...", "cve": "...", "direct": true, "parent": null }],
>   "major_bumps": [{ "package": "...", "from": "...", "to": "...", "upgrade": true, "breaking_changes": [{ "description": "...", "impact": "internal|user-visible" }], "migration_steps": "...", "effort": "trivial", "skip_reason": null }],
>   "overrides": {}
> }
> ```

## Phase 2: Plan & confirm

Read the research file. If `empty: true`, report "No open Dependabot PRs or alerts" and stop.

Write the plan to `.claude/thoughts/shared/plans/{date}-dependabot-upgrade.md`:
- Tables for production deps, dev deps, uncovered alerts, stale PRs
- Major-bump decisions with reasoning, split by user-visible vs internal
- Upgrade order: TypeScript and build tooling → `@types/*` → jest/eslint/prettier → `@asyncapi/*` and parsers → everything else
- Expected snapshot/generated-output churn, and which upgrades cause it
- Risks and likely manual-review items

Present it and ask: **Upgrade all / Select specific / Cancel.**

## Phase 3: Execute

### 3a. Branch

```bash
git status --porcelain            # must be clean
git fetch origin main && git checkout main && git pull origin main
git checkout -b "chore/upgrade-dependencies-$(date +%Y-%m-%d)"
```

### 3b. Upgrade

Skip anything with `upgrade: false` and close its Dependabot PR with a comment explaining why.

Always install the **`latest`** version from the research file, not Dependabot's `target`. If `latest` crosses a major boundary the research didn't analyse, stop and analyse it before installing.

```bash
npm install {package}@{latest}                # dependencies
npm install --save-dev {package}@{latest}     # devDependencies
```

Batch by group where versions are independent; install one at a time for anything with peer-dependency pressure, and upgrade the peer alongside it. Watch `npm install` output for `ERESOLVE` and peer warnings — do not paper over them with `--force` or `--legacy-peer-deps`.

For transitive-only alerts, upgrade the recorded parent, then confirm with `npm ls {package}` that the vulnerable version is gone. If no parent release satisfies the fix, note it for manual review — reach for an `overrides` entry only as a last resort, and say so in the PR.

### 3c. Reconcile overrides

If `package.json` has `overrides`, check each against the upgraded versions: bump when every consumer accepts the newer version, scope it (`"parent>package": "version"`) when consumers disagree, remove it only when the pin is fully obsolete. Removing a security override can silently re-expose the vulnerability through another consumer. Re-run `npm install` and verify with `npm ls {package}`.

## Phase 4: Validate (unless `--skip-tests`)

Run in order, fixing before moving on. Do **not** run `npm run prepare:pr` as one shot here — its `runtime:typescript:generate` step runs `npm ci` in `test/runtime/typescript` and fails on pre-existing lockfile drift unrelated to the upgrade. Run the steps directly:

1. `npm run build` — tsc + oclif manifest.
2. `npm run typecheck` and `npm run typecheck:test`.
3. `npm run lint:fix` — must end clean at `--max-warnings 0`.
4. `npm run generate:assets` — regenerates `schemas/`, `docs/`, README TOC, `examples/`. Any diff here is real drift and belongs in the commit.
5. `npm test` — if a parser or Modelina bump changed emitted code, review the snapshot diff **before** accepting it, then `npm run test:update`. A snapshot diff is the user-visible output delta; never blind-update it.
6. `npm run test:blackbox` — required for any `@asyncapi/*`, parser, or Modelina bump; it type-checks generated output.
7. Runtime tier — only when a broker client (`nats`, `kafkajs`, `mqtt`, `amqplib`) or Modelina was bumped:
   ```bash
   npm run runtime:services:start && npm run runtime:typescript
   npm run runtime:services:stop
   ```
   Regenerating runtime code overwrites hand-written expected-output surfaces in `test/runtime/typescript/src` — inspect that diff, don't just commit it.

Delegate independent fixes across different files to parallel `general-purpose` subagents. Anything that needs a design decision goes on the manual-review list instead.

## Phase 5: Commit & PR

Two commits:

1. `chore(deps): upgrade dependencies` — `package.json`, `package-lock.json`. Reference each PR as `Ref #{pr_number}` in the body.
2. Follow-up fixes, if any — code changes and regenerated assets/snapshots, with a body explaining *what output changed and why*.

Open the PR with `gh pr create`. The title must satisfy `lint-pr-title.yml` (conventional commits) — use `chore(deps): ...`. Body: upgrade summary, validation results per tier, skipped majors with reasons, manual-review items, and `Closes #{pr_number}` for each Dependabot PR consolidated. **Never auto-merge.**

Report a final summary with counts, per-tier validation status, skips, and open questions.

## Gotchas

- **Modelina bumps change generated output.** `@asyncapi/modelina` next-releases have changed serialization behaviour (`toJson`/`fromJson`, `JSON.stringify` spacing, `additionalProperties` as `Record` vs `Map`). A bump cascades into unit snapshots, blackbox output, runtime expected-output surfaces, and `examples/`. Budget for it; review each diff.
- **`prepare:pr` is not a safe validation shortcut here** — see Phase 4.
- **Regenerating runtime code clobbers hand-edited surfaces.** `test/runtime/typescript/src` is written by the generator; expected-output files there are the design surface, not build waste.
- **PR title versions are unreliable.** Always read the real version from `package.json`.
- **`npm view {package} version` returns the `latest` dist-tag**, which for some `@asyncapi` packages lags behind a `next` tag. Do not pull a `next` build unless the repo already depends on one.
- **Yanked versions or alerts with no fix available:** skip, and note them for manual tracking rather than forcing an upgrade.
