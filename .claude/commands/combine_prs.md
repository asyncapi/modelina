---
description: Combine multiple open PRs (targeting master or next) into one branch based on latest next, squash-merging each PR as its own commit with full author/co-author credit, then open the combined PR, credit and close the source PRs, and request all-contributors entries
---

# Combine PRs

You are tasked with pulling a set of open PRs together onto a single new branch, based on the latest `next`, so the user can finish/fix what's needed and open one combined PR. Every PR becomes exactly **one squashed commit**, authored/co-authored so original contributors keep their git credit.

Once the combined branch is verified working, the flow continues all the way through: pushing, opening the combined PR, thanking and closing each source PR, and filing all-contributors requests. This is a **two-phase** process — Phase 1 (local, safe, repeatable) builds and verifies the branch; Phase 2 (public, one-way) publishes it and touches other people's PRs. Never start Phase 2 without an explicit go-ahead from the user (see "Phase 2 gate" below).

## Initial Setup

If invoked without any PR URLs, respond with:

```
I'm ready to combine PRs onto a new branch. Give me the full GitHub PR URLs to combine, e.g.:

/combine_prs https://github.com/asyncapi/modelina/pull/2650 https://github.com/asyncapi/modelina/pull/2651
```

Then wait for the user's list of PR URLs. If invoked with URLs, proceed directly.

## Steps to follow

### 1. Preflight checks

- Confirm we're inside a git repo and `gh auth status` succeeds. If not authenticated, stop and tell the user to run `gh auth login`.
- Run `git status --porcelain`. If there are uncommitted changes, **stop** and ask the user whether to stash them or abort — never silently discard or carry them onto the new branch.
- Parse each provided URL into `owner/repo#number`. If anything isn't a full `https://github.com/<owner>/<repo>/pull/<number>` URL, ask the user for the correct URL rather than guessing.

### 2. Find the canonical `next` branch

- Check `git remote -v` for a remote whose URL points at `asyncapi/modelina` (commonly `origin` or `upstream`).
- If exactly one match, use it. If zero or more than one match, ask the user which remote (and ref, if not `next`) to base the new branch on.
- `git fetch <remote> next`

### 3. Create the new branch

- Auto-generate a name: `combine/next-<PR numbers joined by ->`, e.g. `combine/next-2650-2651-2653`.
- If a local branch with that name already exists, ask the user whether to reuse, delete, or pick a different name — don't delete existing branches without confirmation.
- `git checkout -b <branch-name> <remote>/next`

### 4. For each PR, in the order given by the user

For PR `owner/repo#number`:

1. Fetch metadata, **including the PR author's GitHub login** (needed later for @mentions and all-contributors — a git commit's name/email is not the same as the GitHub username):
   `gh api repos/<owner>/<repo>/pulls/<number> --jq '{title, body, base: .base.ref, headRepo: .head.repo.full_name, headRef: .head.ref, login: .user.login}'`. Note the PR's original base (`master` or `next`) — this is informational only (for the commit message / summary), since squash-merging the diff against the current branch already accounts for anything that's changed in `next`.
2. Fetch the PR's commits directly by number (works for forks too, no remote setup needed):
   `git fetch https://github.com/<owner>/<repo>.git refs/pull/<number>/head:combine-tmp-pr-<number>`
3. Determine authorship from the actual commits (not GitHub profile emails, which may be private):
   `git log --format='%an <%ae>' $(git merge-base HEAD combine-tmp-pr-<number>)..combine-tmp-pr-<number>`
   - If one unique author, that's the commit author.
   - If multiple, use the most prolific (or the PR opener if they're among them) as the commit `--author`, and add every other unique author as a `Co-authored-by: Name <email>` trailer.
   - Also fetch the GitHub logins behind every commit (best-effort, some may be null for private/unlinked emails): `gh api repos/<owner>/<repo>/pulls/<number>/commits --jq '.[].author.login'`. Union these with the PR opener's login from step 1 — this is the full credit list for this PR (git credit *and* @mentions/all-contributors later).
4. Attempt the squash merge: `git merge --squash combine-tmp-pr-<number>`
   - **On conflicts**: stop, list the conflicting files, and ask the user to resolve them (edit + `git add`). Do not guess at conflict resolutions yourself unless the user asks you to. Wait for their confirmation before continuing.
   - **On success**: files are staged automatically.
5. Build the commit message:
   ```
   <PR title> (#<number>)

   <PR body, if present>

   Co-authored-by: <name> <<email>>   (one line per extra author, if any)
   ```
6. Commit: `git commit --author="<primary author> <<email>>" -F <message-file>`
7. Delete the temp ref: `git branch -D combine-tmp-pr-<number>`
8. Classify the contribution type for all-contributors later, from the changed files (`git show --stat`): if everything touched is under `docs/` use `doc`; if everything touched is under `test/` (or `*.test.ts`) use `test`; otherwise use `code`. This is a best-effort default — if the user corrects it, use their classification instead.
9. Extract linked issues from the PR body/title so the combined PR can close them too: scan for GitHub's closing keywords (`close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves`, `resolved`) followed by `#<number>` or `<owner>/<repo>#<number>`, case-insensitive. Record every match (default to `owner/repo` from this PR if the reference is bare `#N`).
10. Record for this PR: number, title, base repo/URL, GitHub logins credited, contribution type, and linked issues. This record is what steps 7-10 (Phase 2) run off of.

### 5. Completeness check — docs, tests, migration entries

For each squashed commit, inspect its diff (`git show --stat <sha>`) against its Conventional Commit type and content:

- **Docs**: if the PR is a user-facing feature (`feat:` title, or the diff adds/changes public API surface), it must also touch relevant files under `docs/`. Flag it if not.
- **Tests**: `feat:` and `fix:` PRs must touch a test file (`test/` or `*.test.ts`) covering the change. Flag it if not.
- **Migration entries**: if the change is breaking (title uses `!` after the type, e.g. `feat!:`, or the body has a `BREAKING CHANGE:` footer), it must add an entry to the current `docs/migrations/version-<N>-to-<N+1>.md` (find the highest-numbered file in `docs/migrations/`). Flag it if not.

Report every gap found, grouped by PR. These are **not** auto-fixed — ask the user whether to add the missing docs/tests/migration entry themselves, have you add it (as an amendment to that PR's squashed commit, so credit and message stay intact), or explicitly accept the gap and proceed anyway. Do not silently proceed past a flagged gap.

### 6. Phase 1 verification — must pass before Phase 2 starts

After all PRs are squashed in, verify the branch the same way CI would (see `.github/workflows/if-nodejs-pr-testing.yml`), locally:

1. `npm install`
2. `npm test`
3. `npm run lint`
4. `npm run generate:assets --if-present`
5. `npm run build`

If shared code under `src/` changed, also flag to the user which `npm run test:runtime:{language}` suites are relevant (per `.github/workflows/runtime-*-testing.yml`, these matter but are heavy — don't run them all preemptively unless asked).

- **Any failure**: stop, show the failing output, and fix it or hand it to the user — do not proceed to Phase 2 with a red branch. Never merge, invent, or override a check to force it green.
- **All green**: print a short summary table — branch name, each PR combined with its squashed commit SHA, every author/co-author credited, and the contribution type recorded per PR — and move to the Phase 2 gate.

## Phase 2 gate

Phase 2 pushes the branch, opens a public PR, and posts comments that close other people's PRs. Before doing **any** of it, show the user exactly what's about to happen (target remote/branch to push to, the source PRs that will be commented on and closed, the draft combined-PR title, and the all-contributors requests to be filed) and get an explicit go-ahead. Do not infer consent from having been given the PR list — that authorized Phase 1 only.

### 7. Push the branch

- Confirm the destination remote (the user's fork, unless they say otherwise) and push: `git push -u <remote> <branch-name>`.
- Never force-push.

### 8. Open the combined PR (describe + create, inline)

- Write the PR title following this repo's Conventional Commits convention (lowercase subject after the type, per `.github/workflows/lint-pr-title.yml`), e.g. `feat: combine #2650, #2651, #2653 into next`.
- Write the body:
  - A `## Summary` bullet per source PR (title + link + one-line description of what it does).
  - A `## Test plan` checklist reflecting the Phase 1 verification just run.
  - A closing-issues line/block listing every issue collected in step 4.10 across all source PRs, in GitHub's auto-close format, e.g. `Fixes #123` / `Fixes owner/repo#456` (one per line) — this is what makes merging the combined PR close those issues automatically. Omit this block if no PR linked any issues.
  - A note that this bundles multiple contributors' work with full commit credit preserved.
- Create it: `gh pr create --title "..." --body "$(cat <<'EOF' ... EOF)" --base next` (adjust `--base` if the user wants a different target). Report the resulting PR URL.

### 9. Credit and close each source PR

For every PR combined in, once the combined PR above exists:

1. Comment on the source PR crediting its author(s) by GitHub login:
   `gh pr comment <owner>/<repo>#<number> --body "..."`. Default message (substitute the actual login, and the new PR's URL):
   ```
   @<author_login> Thanks for taking the time to contribute it, for simplicity and time saving I bundled all of it together in the next branch tagging you for the credit of course ✌️

   <combined PR URL>
   ```
   If the user gave extra instructions or a custom message for this step when invoking the command, append that as an additional sentence rather than replacing the default.
2. Close it: `gh pr close <owner>/<repo>#<number>`.
3. Never do this for a PR that failed to merge cleanly or wasn't actually included in the final commit set.

### 10. Request all-contributors credit

On the newly created combined PR, post one comment per unique GitHub login collected in step 4.10, using that PR's recorded contribution type(s) (join multiple with a comma, e.g. `code, test`):
```
@all-contributors please add @<login> for <contributions>
```
If a login is credited on more than one source PR with different contribution types, combine them into a single request rather than posting duplicates.

## Guardrails

- Never force-push.
- Never start Phase 2 (push / comment / close / create PR / all-contributors requests) without an explicit go-ahead at the Phase 2 gate, even if the PR list was provided up front.
- Never delete a pre-existing local branch without confirmation.
- Never resolve merge conflicts unilaterally — surface them and wait.
- Never invent PR numbers/URLs or assume a repo — only act on what the user provided.
- Never close or comment on a source PR that isn't actually part of the final combined commit set.
- Never proceed to Phase 2 with a failing Phase 1 verification (build/lint/test/assets).
- Never silently skip a flagged docs/test/migration-entry gap — resolve it, or get an explicit accept from the user, before moving on.
- Never fabricate a closing issue reference — only include ones actually found in a source PR's title/body.
