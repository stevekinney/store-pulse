# Prompting Best Practices for Codex

Codex works best when you treat the prompt as a working agreement. You are not
just asking for code. You are defining the job, the boundaries, the evidence
Codex should gather, and the signals that prove the task is done.

The strongest prompts do not try to micromanage every implementation detail.
They describe the outcome, point Codex at the right context, name the
constraints that matter, and require verification. Codex can inspect files,
run commands, edit code, and iterate. Your job is to make sure it is solving
the right problem with the right definition of done.

## The Core Loop

Most effective Codex work follows this loop:

- Inspect the real repository state.
- Make a short plan when the work is non-trivial.
- Implement the smallest coherent change.
- Run the relevant verification gates.
- Fix failures and rerun the gates.
- Report exactly what changed, what passed, and what remains.

Your prompt should support that loop. If you skip inspection, Codex may solve a
generic version of the problem. If you skip verification, Codex may stop when
the code looks plausible rather than when the repository proves it works.

## Prompt Anatomy

A strong prompt usually includes these parts:

- **Goal:** What should be true when the task is complete?
- **Context:** Which files, feature area, bug report, pull request, or user
  flow matters?
- **Constraints:** What must not change? What patterns should Codex preserve?
- **Working mode:** Should Codex plan only, implement, review, debug, or
  explain?
- **Verification:** Which commands or checks must pass?
- **Completion signal:** What should Codex report back when it is done?

You do not need every part for every prompt. A small question can be short. A
feature prompt should usually include all of them.

## Start With The Repository, Not The Model

Codex is strongest when it can inspect actual files. Ask it to read the
codebase before deciding.

Weak:

```text
Add filtering to the dashboard.
```

Better:

```text
Add product category filtering to the dashboard low-stock section.

First inspect the existing dashboard page, low-stock helpers, product category
types, and tests. Match the repository conventions. Prefer URL search
parameters so the filtered view can be linked and reloaded.

Preserve the existing closed-store and inactive-product behavior.

Run:

- npm run test
- npm run lint
- npm run build
```

The better prompt tells Codex where to look, which behavior matters, and how to
prove the change.

## Say What Kind Of Work You Want

Codex can plan, implement, debug, review, explain, or create a reference
document. Those are different jobs.

Use direct framing:

- "Make a plan only. Do not edit files yet."
- "Implement this plan."
- "Review this diff for bugs and missing tests."
- "Debug the failing test. Inspect the failure before editing."
- "Explain this code path without changing files."
- "Write this up as a Markdown reference document."

If you want implementation, say so. If you want Codex to stop after a plan, say
that too.

## Ask For Inspection Before Planning

Planning without inspection usually produces generic plans. For repository
work, ask Codex to inspect the relevant code first.

Good:

```text
Before writing the plan, inspect `app/page.tsx`, `lib/metrics.ts`,
`lib/inventory.ts`, and the unit tests under `tests/unit/`.
```

Better:

```text
Before writing the plan, inspect the existing route, data-access helper, pure
business logic, and tests that own this behavior. If the files I named are not
the right ones, follow the code and use the actual owners.
```

The second version gives Codex a starting point without trapping it in a stale
file list.

## Use Constraints That Matter

Constraints are most useful when they prevent a likely mistake.

Good constraints:

- Use `npm`; this repository has a committed `package-lock.json`.
- Keep database access in `lib/`.
- Keep reusable business logic pure and unit-tested.
- Do not edit the initial Prisma migration.
- Preserve closed-store and inactive-product semantics.
- Do not add authentication, caching, queues, or deployment infrastructure.
- Use server components unless client-side state is required.

Weak constraints:

- Make it clean.
- Use best practices.
- Make it scalable.
- Do it properly.

If a constraint could mean different things to different people, make it more
concrete.

## Make Acceptance Criteria Binary

Good acceptance criteria are independently checkable. They should not require
guessing what you meant.

Weak:

```text
Make the assistant useful.
```

Better:

```text
The assistant panel answers these four predefined questions with deterministic
logic and no external AI API:

- Which stores need attention today?
- What are the most urgent low-stock items?
- Which active tasks are due soon?
- Which stores have the highest combined operational risk?
```

Weak:

```text
Improve the store page.
```

Better:

```text
On each store detail page, show incidents in reverse chronological order with
severity and status badges. Stores without incidents should show the existing
empty-state component.
```

## Name Verification Gates

Codex should know which commands prove success. Put the exact commands in the
prompt.

For Store Pulse feature work:

```bash
npm run test
npm run lint
npm run build
```

For Prisma schema changes:

```bash
npx prisma migrate dev --name <migration-name>
npm run db:seed
npm run test
npm run lint
npm run build
```

For browser-level behavior:

```bash
npm run test:e2e
```

If a command is expected to fail at first because you are asking for TDD, say
that:

```text
Start by adding a failing unit test for the reorder calculation. Then implement
the helper until the test passes. Finish with the full verification gates.
```

## Define The Completion Signal

Tell Codex what "done" means. This matters for long-running tasks and for
workflows that can get stuck.

Good:

```text
Completion signal: the dashboard and store detail page show suggested reorder
quantities for low-stock active products, and `npm run test`, `npm run lint`,
and `npm run build` all pass.
```

Good:

```text
If you cannot make the checks pass after two implementation attempts, stop and
explain the current failure, the likely cause, and the next command or file to
inspect.
```

Completion signals keep Codex from stopping at "I changed the file" when the
real job is "the verified feature works."

## Prefer One Coherent Task

Codex can handle large work, but broad prompts often hide multiple projects.
Split by independently verifiable units.

Too broad:

```text
Add incidents, task assignment, inventory search, and a regional dashboard.
```

Better:

```text
Add an incident timeline to each store detail page. Create the model, seed
data, store-detail rendering, badges, and tests in one coherent change.
```

That second prompt is still meaningful, but it has one center of gravity.

## Give Codex Freedom In The Right Places

Do not over-specify implementation details that the codebase should decide.
Do specify product behavior and invariants.

Over-specified:

```text
Create a `useIncidentTimeline` hook and a client component that fetches
incidents from `/api/incidents`.
```

Better:

```text
Show incidents on the store detail page. Inspect the existing App Router and
data-access conventions before choosing the implementation. Keep the page
server-rendered unless client-side state is actually needed.
```

The better prompt lets Codex follow the repository instead of importing a
pattern from somewhere else.

## Prompt For Evidence

Ask Codex to ground its answer in files, commands, logs, or runtime behavior.

Good:

```text
Before changing code, tell me which files own this behavior and why.
```

Good:

```text
When you report the result, include the verification commands you ran and
whether each one passed.
```

Good:

```text
If a test fails, quote the relevant failing assertion or error line before
proposing a fix.
```

Evidence makes the work auditable. It also helps you catch cases where Codex
is reasoning from assumptions instead of repository state.

## Use AGENTS.md As The Baseline

Put durable project rules in `AGENTS.md`, not in every prompt. Then each prompt
can focus on the specific task.

Prompt:

```text
Follow `AGENTS.md`. Add smart reorder suggestions as described below.
```

`AGENTS.md` should already explain package manager choice, test commands,
project layout, framework warnings, and out-of-scope work. The prompt should
explain the feature.

If you find yourself pasting the same rule into every prompt, it probably
belongs in `AGENTS.md`, a skill, or a reference file.

## Use Skills For Repeated Workflows

Skills are useful when Codex needs the same workflow repeatedly. A prompt can
trigger a skill by naming it, but the skill should not replace task-specific
instructions.

Good:

```text
Use the Store Pulse Prisma change skill. Add the incident timeline feature
from `reference/next-prompts.md`.
```

Good:

```text
Use the Store Pulse domain semantics skill. Add regional reporting without
changing the existing closed-store, inactive-product, or maintenance-store
rules.
```

Use skills for durable process. Use prompts for the task at hand.

## Plan Prompts

Use a plan prompt when the task has meaningful design choices or a larger
blast radius.

Template:

```text
Make a plan for <feature or fix>. Do not edit files yet.

First inspect the existing code that owns this behavior. The likely files are:

- <file or area>
- <file or area>

The plan should include:

- Files likely to change.
- Tests to add or update.
- Verification commands.
- Risks or open questions.
- A clear completion signal.

Keep the plan scoped to one independently shippable unit of work.
```

Store Pulse example:

```text
Make a plan for adding a regional reporting dashboard. Do not edit files yet.

First inspect `lib/metrics.ts`, the dashboard page, the store list page, and
the existing unit tests. Preserve the current closed-store, inactive-product,
and maintenance-store semantics.

The plan should name the pure aggregation helper, the route to add, the tests
to write, and the verification commands.
```

## Implementation Prompts

Use an implementation prompt when you are ready for Codex to edit files.

Template:

```text
Implement <feature or fix>.

First inspect the relevant files and make a short plan. Then make the changes.

Constraints:

- <constraint>
- <constraint>
- <constraint>

Acceptance criteria:

- <binary criterion>
- <binary criterion>

Verification gates:

- <command>
- <command>

If a verification gate fails, inspect the failure, fix the underlying issue,
and rerun the gate.
```

Store Pulse example:

```text
Implement smart reorder suggestions.

First inspect the inventory helpers, dashboard metrics, dashboard page, store
detail page, and unit tests.

Create a pure reorder calculation helper. Show suggestions in the dashboard
urgent low-stock list and the store detail inventory table. Preserve existing
closed-store, inactive-product, and maintenance-store behavior.

Verification gates:

- npm run test
- npm run lint
- npm run build
```

## Debugging Prompts

Debugging prompts should start with the failure, not with a guessed fix.

Weak:

```text
The tests are failing. Try changing the imports.
```

Better:

```text
Debug the failing test run. Start by running `npm run test` and reading the
first failure. Do not edit code until you can explain which behavior is failing
and which file owns it.

After the first fix attempt, rerun the smallest failing test. Finish with
`npm run test`, `npm run lint`, and `npm run build`.
```

When you have logs, paste the relevant lines. Do not paste thousands of lines
unless the detail matters. Give Codex the command that produced the failure.

## Review Prompts

A review prompt should ask Codex to find risks, not summarize the diff.

Weak:

```text
Review this.
```

Better:

```text
Review the current diff for bugs, behavior regressions, missing tests, and
violations of `AGENTS.md`. Lead with findings ordered by severity and include
file and line references. If there are no findings, say that and name any
residual test gaps.
```

For a pull request, be explicit about whether Codex should only review or also
fix issues.

```text
Review pull request #12. Do not make changes. Focus on correctness, missing
tests, and whether the implementation preserves the dashboard status
semantics.
```

```text
Review pull request #12, then fix actionable review feedback. After changes,
run the relevant checks and report what remains unresolved.
```

## Refactoring Prompts

Refactoring prompts need tight boundaries. Otherwise Codex may improve the
codebase in ways that make the diff harder to review.

Good:

```text
Refactor the dashboard aggregation helpers to remove duplication without
changing behavior.

Before editing, run the existing unit tests for metrics. Add regression tests
for any behavior that is not already pinned. Do not change route rendering,
Prisma schema, seed data, or public page copy.

Finish with `npm run test`, `npm run lint`, and `npm run build`.
```

Name the behavior that must stay fixed. Name the files or layers that are out
of scope.

## UI Prompts

UI prompts should describe the user workflow and visual constraints without
forcing a component structure too early.

Good:

```text
Add a compact incident timeline to the store detail page.

Use the existing page style: bordered white sections, small headings, badges
for status-like values, and `EmptyState` when there are no rows. Keep the page
server-rendered unless client-side state is required.
```

Good:

```text
The new table must have an accessible caption or label. Numeric columns should
align right like the existing inventory table.
```

Avoid vague requests like "make it modern" or "make it beautiful." Name the
experience and the constraints.

## Schema Prompts

Schema prompts should be explicit about migrations and seed data.

Good:

```text
Add a `StoreIncident` model related to `Store`.

Use a new migration; do not edit the initial migration. Update the seed script
with deterministic, realistic incidents. Add type parsers for severity and
status values. Update data access through `lib/`; do not query Prisma directly
from the route page.

Verification gates:

- npx prisma migrate dev --name add-store-incidents
- npm run db:seed
- npm run test
- npm run lint
- npm run build
```

Schema changes are easy to half-finish. The prompt should name the whole
chain: schema, migration, generated types, seed data, data access, rendering,
and tests.

## Test Prompts

When asking for tests, say what behavior should be protected.

Weak:

```text
Add tests.
```

Better:

```text
Add unit tests that prove inactive products are excluded from low-stock
metrics, closed stores are excluded from dashboard rollups, and maintenance
stores remain included.
```

Better:

```text
Add regression coverage for the bug where quantity on order was ignored by the
low-stock calculation.
```

If the work is a pure helper, ask for unit tests. If the work is a user flow,
consider an end-to-end test. Do not make every small UI change carry an
expensive browser test unless it protects a meaningful workflow.

## Follow-Up Prompts

After Codex finishes, the next prompt should reference the actual result.

Good:

```text
The build still fails on the Prisma generated type for `StoreIncident`. Inspect
the generated type error and fix the schema or query shape. Do not change the
feature scope.
```

Good:

```text
Now tighten the tests for the reorder helper. Add boundary cases for zero on
hand, existing quantity on order, and stock already above the target.
```

Good:

```text
This works, but the assistant answer copy is too vague. Keep the deterministic
logic unchanged and revise only the dashboard copy.
```

Follow-up prompts are how you steer without restarting the task from scratch.

## Recovery Prompts

When a task goes sideways, stop adding patches and ask for diagnosis.

Good:

```text
Stop implementing. Re-diagnose the current state.

Report:

- What changed so far.
- Which verification command is failing.
- The exact error or assertion.
- The likely wrong assumption.
- The smallest next step to recover.

Do not edit files until the diagnosis is clear.
```

Good:

```text
Back out only your last attempted change in `<file>`, preserving unrelated user
changes. Then rerun the failing test and propose the next fix.
```

Avoid asking Codex to "just try something else" after repeated failures. Two
failed attempts usually means the model of the problem is wrong.

## Prompting For Explanations

Explanation prompts should ask Codex to ground the explanation in the code.

Weak:

```text
Explain Next.js server components.
```

Better:

```text
Explain how this repository uses server components. Ground the explanation in
`app/page.tsx`, `app/stores/[id]/page.tsx`, and the `lib/` data-access files.
Do not change code.
```

Good explanation prompts include:

- The audience.
- The files or flow to explain.
- The level of detail.
- Whether code changes are allowed.

## Prompting For Documentation

Documentation prompts should name the reader and the artifact.

Good:

```text
Write `reference/skills.md` for workshop participants who are learning when to
create Codex skills. Include concrete Store Pulse skill ideas, examples, and
guidance on what not to turn into a skill.
```

Good:

```text
Update the README setup section for a new contributor. Keep it truthful to the
current scripts in `package.json`; do not add commands that do not exist.
```

For documentation work, ask Codex to inspect the files it is documenting.
Otherwise it may write a polished but inaccurate guide.

## Good Store Pulse Prompt

This is a strong feature prompt:

```text
Add smart reorder suggestions to the Pet Store Operations Dashboard.

First inspect the existing inventory, dashboard, store detail, and unit test
structure. Match the repository conventions.

Create a pure `calculateSuggestedReorderQuantity` helper in `lib/inventory.ts`.
For low-stock active products, suggest enough units to bring projected stock
back to twice the reorder threshold:

max(0, reorderThreshold * 2 - quantityOnHand - quantityOnOrder)

Show the suggestion in the dashboard urgent low-stock list and in the store
detail inventory table. Preserve the existing domain rules: inactive products
do not count as low stock, closed stores stay excluded from dashboard low-stock
metrics, and maintenance stores remain included.

Add unit tests for the calculation logic and any dashboard aggregation changes.

Verification gates:

- npm run test
- npm run lint
- npm run build

Completion signal: the dashboard and store detail page display reorder
suggestions for low-stock active products, and all verification gates pass.
```

It works because it gives Codex a clear goal, a formula, the relevant surfaces,
the domain invariants, the expected tests, and the finish line.

## Prompt Smells

Watch for these patterns:

- **Too vague:** "Make this better."
- **Too broad:** "Build the rest of the app."
- **Too prescriptive:** "Use this exact architecture" before Codex inspects
  the repository.
- **No verification:** The prompt never says how success is proven.
- **No boundaries:** The prompt does not say what should stay unchanged.
- **No owner:** The prompt does not point to the feature area, file, route, or
  failing command.
- **Mixed modes:** The prompt asks for a plan, implementation, review, and
  documentation all at once without saying what comes first.
- **Hidden acceptance criteria:** The real requirement is in your head, not in
  the prompt.

When a prompt has one of these smells, tighten it before starting.

## Useful Phrase Bank

Use these phrases when they fit:

- "Inspect the existing code before planning."
- "Match the repository conventions."
- "Keep the scope to one independently verifiable change."
- "Do not edit files yet."
- "Implement the plan now."
- "Preserve existing behavior unless the tests explicitly change."
- "Add a regression test for the bug."
- "Run the smallest relevant test first, then the full gate."
- "If the same fix fails twice, stop and re-diagnose."
- "Report touched files and verification results."
- "If there is no work to do, say so and stop."
- "Do not add compatibility shims or adapter layers unless required."
- "Use URL search parameters so the state can be linked and reloaded."
- "Keep database access in `lib/`."
- "Do not call external services."

## Copyable Templates

### Feature Template

```text
Implement <feature>.

First inspect <files or feature area>. Match the repository conventions.

Goal:

- <what should be true>

Constraints:

- <what must not change>
- <architecture or domain rule>
- <scope boundary>

Acceptance criteria:

- <binary check>
- <binary check>

Tests:

- <test to add or update>

Verification gates:

- <command>
- <command>

Completion signal: <what Codex should report when done>.
```

### Plan-Only Template

```text
Make a plan for <feature or fix>. Do not edit files.

First inspect <files or feature area>. The plan should include:

- Files likely to change.
- Data or schema changes, if any.
- Tests to add or update.
- Verification commands.
- Risks and open questions.

Keep the plan scoped to one independently verifiable unit of work.
```

### Debug Template

```text
Debug <failure>.

Start by running <failing command> and reading the first failure. Do not edit
files until you can explain:

- What failed.
- Which behavior is expected.
- Which file likely owns the behavior.
- What the smallest fix should prove.

After fixing, rerun the smallest relevant test and then the full verification
gate.
```

### Review Template

```text
Review the current diff for bugs, behavior regressions, missing tests, and
violations of `AGENTS.md`.

Lead with findings ordered by severity. Include file and line references. If
there are no findings, say that clearly and name any residual risk or test gap.

Do not edit files.
```

### Documentation Template

```text
Write <file path> for <audience>.

First inspect the current repository files that the document describes. Keep
the document accurate to the current code and commands. Include concrete
examples and verification guidance where useful.

Do not change source code.
```

## Final Checklist

Before sending a serious Codex prompt, ask:

- Did I say whether I want a plan, implementation, review, debugging, or an
  explanation?
- Did I give Codex enough context to find the owning files?
- Did I name the constraints that matter?
- Are the acceptance criteria binary?
- Did I include verification commands?
- Did I define what done means?
- Did I keep the task to one coherent unit of work?
- Did I say what should remain out of scope?

You do not need a perfect prompt. You need a prompt that gives Codex enough
direction to inspect the real code, make a defensible change, and prove it.
