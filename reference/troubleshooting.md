# Troubleshooting Codex Sessions

Things will go wrong. That is normal. The goal is to recover deliberately
instead of adding another speculative patch on top of the problem.

This guide covers the common failure modes in a Store Pulse workshop session and
the fastest way to get back to a known state.

## First Move: Reorient

When something feels off, stop and gather state.

Run:

```bash
git status --short
```

Inside Codex:

```text
/status
/diff
```

Then ask:

```text
Pause and reorient. Summarize the current goal, changed files, verification
commands run, failures still present, and the smallest safe next action. Do not
edit files yet.
```

Most workshop problems become easier once the current state is visible.

## Codex Edited the Wrong File

Symptoms:

- The diff includes unrelated files.
- Codex changed a page when the logic belonged in `lib/`.
- Codex modified generated files or local artifacts.
- The patch is larger than the prompt justified.

Recovery:

```text
Review the current diff and identify changes outside the requested scope. Do
not revert anything yet. List which hunks should stay and which should be
removed.
```

Then remove only the unwanted changes. Do not use broad destructive commands
unless you are certain the changes are disposable.

Useful command:

```bash
git diff -- <path>
```

Better follow-up prompt:

```text
Keep only the changes needed for the reorder calculation and its tests. Remove
the unrelated page copy changes. Do not touch files outside lib/ and tests/unit/.
```

## Codex Is Guessing

Symptoms:

- It references files that do not exist.
- It says "probably" about something easy to inspect.
- It proposes a framework the repository does not use.
- It ignores `AGENTS.md`.

Recovery:

```text
Stop and inspect the repository. Read AGENTS.md, package.json, and the relevant
files before planning again. Summarize what you found with file paths.
```

If the task is still too vague, narrow it:

```text
Focus only on lib/inventory.ts and tests/unit/inventory.test.ts. Do not edit page
components until the helper and tests are correct.
```

## The Prompt Was Too Broad

Symptoms:

- Codex proposes a multi-phase rewrite.
- The plan touches many unrelated areas.
- Acceptance criteria are subjective.
- Verification is unclear.

Recovery:

```text
Split this into smaller mechanically verifiable tasks. Each task should name the
files likely to change, the acceptance criteria, and the verification command.
Do not implement yet.
```

Then choose one task:

```text
Implement only the pure reorder quantity helper and its unit tests. Do not edit
the dashboard or store detail page yet.
```

## Tests Fail

Start with the first useful failure, not the whole wall of output.

Prompt:

```text
npm run test failed. Use the first failing test as the starting point. Inspect
the test and implementation, explain the mismatch, then make the smallest fix.
Do not skip or weaken the test.
```

Useful commands:

```bash
npm run test
npm run test -- tests/unit/inventory.test.ts
```

If the same test fails after two fixes:

```text
Stop patching. Re-read the failing test, the implementation, and the relevant
domain rules. Explain the root cause before editing again.
```

## Lint Fails

Lint failures are usually mechanical, but do not ignore them.

Prompt:

```text
npm run lint failed. Fix only the reported lint issues. Do not refactor
unrelated code.
```

Common causes:

- Unused imports.
- React or Next.js rule violations.
- TypeScript syntax issues.
- Files that grew too complex after a broad patch.

After fixing lint, rerun:

```bash
npm run lint
```

## Build Fails

Build failures often catch issues that unit tests miss.

Prompt:

```text
npm run build failed. Diagnose whether this is a TypeScript, Next.js, Prisma, or
environment issue. Explain the first actionable error before editing.
```

Common causes:

- Server component and client component boundaries.
- Missing Prisma generated types.
- Bad imports.
- Route parameters or async rendering assumptions.
- Environment setup problems.

Useful commands:

```bash
npm run build
npm run setup
```

## Prisma Is Confused

Symptoms:

- Prisma client type errors.
- Missing tables.
- Seed data does not match the schema.
- The application runs but data looks stale.

Start with:

```bash
npm run setup
```

Regenerate and reseed:

```bash
npm run db:seed
```

Reset local database state only when that is intended:

```bash
npm run db:reset
```

For schema changes, use a new migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Do not edit the committed initial migration in place. Store Pulse uses stacked
migrations so the database can be recreated from scratch.

## Playwright Fails

Symptoms:

- Browser executable missing.
- The server did not start.
- The page changed and the test selector no longer matches.
- The test database is not seeded.

Install Chromium:

```bash
npx playwright install chromium
```

Run:

```bash
npm run test:e2e
```

If the test failure is real, ask Codex to inspect the test and the page together:

```text
npm run test:e2e failed. Inspect tests/e2e/dashboard.spec.ts and the affected
page. Determine whether the app behavior regressed or the test needs to be
updated for intentional behavior.
```

Do not rewrite the end-to-end test just to make it pass. First decide whether
the user-facing behavior is still correct.

## Network Access Is Blocked

Symptoms:

- `npm install` cannot reach the registry.
- `npx playwright install chromium` cannot download Chromium.
- `curl` or a package command fails with DNS or network errors.

First decide whether network access is actually needed. Most Store Pulse feature
work should not need it after setup.

If setup needs network access, use a one-off override:

```bash
codex --profile setup -c 'sandbox_workspace_write.network_access=true'
```

Or ask Codex to request approval for the specific command. Do not permanently
enable network access just because one setup command needed it.

See `reference/safety.md` for the distinction between shell network access and
web search.

## Sandbox Blocks a Command

Symptoms:

- Codex cannot write outside the workspace.
- A command needs to open a browser or graphical application.
- A tool wants to write to a temporary or external directory.

First ask whether the command should be allowed. If the answer is yes, approve
the narrow action. If the answer is no, change the approach.

Prompt:

```text
The command was blocked by the sandbox. Explain why it needs access, whether
there is a local workspace-only alternative, and the narrowest approval that
would unblock it.
```

Do not use `danger-full-access` to avoid thinking about scope.

## The Branch Is Dirty

Symptoms:

- `git status --short` shows files you did not expect.
- Codex wants to change files already modified by someone else.
- You are not sure which changes belong to this task.

Recovery:

```bash
git status --short
git diff
```

Ask:

```text
Inspect the current working tree. Separate changes that appear related to this
task from unrelated pre-existing changes. Do not revert anything.
```

If unrelated changes exist, work around them. Do not erase user work to make the
diff cleaner.

## The Database Changed Unexpectedly

Local SQLite files may change when the app runs, tests run, or seed commands
execute. They are local artifacts and should not be committed.

Check:

```bash
git status --short prisma
```

If database files appear, make sure they are ignored or left unstaged. The
schema, migrations, and seed file are the durable database artifacts.

## Codex Keeps Repeating a Bad Fix

This is usually a context problem, not an effort problem.

Use:

```text
Stop. The last two fixes did not resolve the failure. Reconstruct the expected
behavior from AGENTS.md, the failing test, and the implementation. Then propose
one minimal fix with evidence.
```

If needed, start a clean session:

```text
/new
```

Then provide a concise state summary:

```text
We are fixing <specific failure>. The failing command is <command>. The relevant
files are <files>. The last attempted fix did not work because <reason>. Inspect
before editing.
```

## Codex Lost the Thread

Symptoms:

- It forgets the original task.
- It starts solving an old problem.
- It reopens a completed decision.
- The session has a long trail of failed attempts.

Recovery options:

- Ask for a reorientation summary.
- Use `/compact` after writing down the current state.
- Use `/new` for a clean session.
- Write the current plan to a file.

Prompt:

```text
Summarize the current task, current diff, passing checks, failing checks, and
next action. Keep it concise enough to paste into a fresh session.
```

## You Need to Undo Codex Work

First inspect what changed:

```bash
git status --short
git diff
```

Prefer targeted edits over broad resets. Ask Codex:

```text
Remove the changes related to the abandoned assistant panel experiment. Preserve
the reorder suggestion tests and helper changes. Do not revert unrelated user
work.
```

Avoid destructive commands such as `git reset --hard` unless you explicitly
intend to discard all local changes.

## Recovery Prompt Library

Reorient:

```text
Pause and reorient. Use git status and the current diff to summarize the task,
changed files, verification status, and smallest next action. Do not edit files.
```

Diagnose a failed command:

```text
The command `<command>` failed. Read the output, identify the first actionable
error, inspect the relevant files, and explain the root cause before editing.
```

Narrow scope:

```text
The patch is too broad. Keep only the changes needed for `<specific behavior>`.
List unrelated changes before removing them.
```

Recover from repeated failure:

```text
We have tried two fixes and the same failure remains. Stop patching. Rebuild the
mental model from the test, implementation, and project rules, then propose the
smallest evidence-backed fix.
```

Prepare a handoff:

```text
Write a concise handoff summary with the goal, changed files, commands run,
current failures, and next step.
```

## Rule of Thumb

When Codex fails, do not ask for "one more try" immediately.

Ask for state. Ask for evidence. Ask for the smallest safe next action.
