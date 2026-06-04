# One-Hour Store Pulse Codex Workshop

This is the primary runbook for the one-hour Store Pulse workshop. The goal is
to take one realistic feature from request to verified diff while showing what
Codex contributes at each step: repository inspection, planning, test-first
implementation, narrow debugging, verification, review, and final handoff.

The feature is **smart reorder suggestions**. Participants will ask Codex to
add a pure reorder calculation, show the result in the dashboard and store
detail inventory table, and verify the change with the project gates. The
feature should not be implemented in the starter repository before the
workshop. The application is the exercise substrate.

## 60-Minute Flow

| Time          | Segment                    | Outcome                                                                               |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------- |
| 0-5 minutes   | Preflight                  | Everyone is in the repository, dependencies are installed, and Codex is open.         |
| 5-12 minutes  | Repository orientation     | Codex explains the relevant routes, helpers, tests, and domain rules without editing. |
| 12-20 minutes | Plan the feature           | Codex produces a concise plan for smart reorder suggestions.                          |
| 20-35 minutes | Test-first implementation  | Codex adds failing unit coverage, implements the helper, and updates call sites.      |
| 35-45 minutes | UI integration             | Codex renders suggested reorder quantities on the dashboard and store detail page.    |
| 45-55 minutes | Verification and debugging | Codex runs the quality gates, diagnoses failures, and patches narrowly.               |
| 55-60 minutes | Review and handoff         | Codex reviews the diff and produces a final summary with touched files and gates.     |

If setup consumes too much time, keep the same order and skip only
`npm run build`. Name that skipped gate explicitly in the final handoff.

## Preflight

Start from the repository root:

```bash
pwd
git status --short
npm install
npm run lint
npm run test
```

If this is a fresh machine and Playwright is part of the local setup, install
Chromium once:

```bash
npx playwright install chromium
```

Start Codex from the repository root:

```bash
codex
```

Inside Codex, confirm the session:

```text
/status
```

The expected workshop posture is:

- The current directory is the Store Pulse repository.
- Codex has loaded `AGENTS.md`.
- The sandbox allows editing files in this workspace.
- The approval mode is appropriate for local, reversible actions.
- The package manager remains `npm` because this project has `package-lock.json`.

## Segment 1: Inspect Before Acting

Codex is useful because it can read the actual codebase before it proposes a
solution. Start by asking it to inspect, not edit.

Copyable prompt:

```text
Inspect this repository for the smart reorder suggestions feature. Do not edit
files yet.

Focus on:
- app/page.tsx
- app/stores/[id]/page.tsx
- lib/inventory.ts
- lib/metrics.ts
- lib/dashboard.ts
- tests/unit/inventory.test.ts
- tests/unit/metrics.test.ts

Explain how low-stock items flow from data helpers into the dashboard and store
detail page. Also call out the domain rules from AGENTS.md that the feature must
preserve.
```

Expected discussion points:

- Low-stock logic starts in `lib/inventory.ts`.
- Dashboard aggregation lives in `lib/metrics.ts`.
- Dashboard data loading is in `lib/dashboard.ts`.
- The dashboard renders urgent low-stock rows in `app/page.tsx`.
- Store detail inventory rendering is in `app/stores/[id]/page.tsx`.
- Unit tests already cover inventory helpers and dashboard metrics.
- Inactive products and closed stores have special low-stock rules.

The file list is a starting hypothesis, not an instruction to trust stale
context. Codex should confirm the paths by reading the repository.

## Segment 2: Plan The Feature

Ask Codex for a compact plan before implementation. The plan should be small
enough to complete during the hour and specific enough to verify.

Copyable prompt:

```text
Make a concise implementation plan for smart reorder suggestions. Do not edit
files yet.

The suggested quantity should be:

max(0, reorderThreshold * 2 - quantityOnHand - quantityOnOrder)

The plan must cover:
- the pure helper to add
- the unit tests to write first
- the dashboard aggregation change, if needed
- the dashboard UI change
- the store detail UI change
- the verification commands

Keep the scope tight and preserve the existing Store Pulse domain rules.
```

Acceptance criteria for the plan:

- It names `calculateSuggestedReorderQuantity`.
- It keeps the calculation in `lib/inventory.ts`.
- It includes unit tests before page edits.
- It does not introduce a Prisma migration, external API, component library, or
  client-side state.
- It uses `npm run test`, `npm run lint`, and `npm run build` as gates.

## Segment 3: Implement With Tests First

Now ask Codex to make the change. The prompt should give the feature boundary,
not a line-by-line recipe.

Copyable prompt:

```text
Implement the smart reorder suggestions feature from the plan.

Use TDD where practical:
- First add failing unit coverage for calculateSuggestedReorderQuantity in
  tests/unit/inventory.test.ts.
- Then implement the pure helper in lib/inventory.ts.
- Then thread the suggested quantity through the dashboard urgent low-stock
  rows if the existing data shape needs it.
- Then render the suggestion in app/page.tsx and app/stores/[id]/page.tsx.

Preserve the existing rules:
- inactive products do not count as low stock
- closed stores stay excluded from dashboard low-stock metrics
- maintenance stores remain included

Do not add a schema migration, external API call, component library, or
client-side state. Run npm run test and npm run lint before finishing.
```

What participants should watch:

- Codex should inspect before patching if it needs more context.
- The first useful test is a pure calculation test.
- The helper should avoid special-casing one product, store, or file.
- The dashboard may need a new field on `UrgentLowStockRow`.
- The store detail page can calculate the suggestion directly from each row.
- UI changes should be small and consistent with the existing tables and lists.

## Segment 4: Verify And Debug

Run the gates from the implementation prompt first:

```bash
npm run test
npm run lint
```

Then run the production build because route files changed:

```bash
npm run build
```

If a gate fails, give Codex the command and the first useful error. Do not ask
for a broad rewrite.

Copyable debugging prompt:

```text
The verification command failed:

<paste command and first useful error here>

Diagnose the failure from the output and the touched files. Explain the root
cause before editing. Then make the narrowest patch that fixes this failure and
rerun the failed command.
```

If the same command fails after two attempted fixes, stop patching and
re-diagnose:

```text
Stop editing for a moment. We have tried two fixes and the same verification
command still fails. Re-read the output, inspect the relevant files, and explain
the actual root cause before proposing another patch.
```

## Segment 5: Review The Diff

After the gates pass, inspect the working tree:

```bash
git status --short
git diff
```

Ask Codex to review the final diff from a code-review stance:

```text
Review the current diff against the original smart reorder suggestions prompt
and AGENTS.md. Focus on bugs, behavioral regressions, missing tests, scope
drift, and any files that should not be included. Do not edit files unless you
find a concrete issue.
```

Good review findings are specific:

- A helper handles the boundary incorrectly.
- A dashboard row forgot to include the suggested quantity.
- A test asserts implementation details instead of behavior.
- A page shows suggestions for inactive products.
- A verification gate was skipped without being named.

## Final Handoff

Ask Codex for a concise final summary:

```text
Summarize the completed smart reorder suggestions change.

Include:
- what changed
- touched files
- verification commands and whether they passed
- any skipped gate or remaining risk

Keep it concise and concrete.
```

The expected final shape is:

```text
Implemented smart reorder suggestions on the dashboard and store detail page.
The calculation lives in lib/inventory.ts with unit coverage in
tests/unit/inventory.test.ts.

Touched files:
- lib/inventory.ts
- lib/metrics.ts
- app/page.tsx
- app/stores/[id]/page.tsx
- tests/unit/inventory.test.ts
- tests/unit/metrics.test.ts

Verification:
- npm run test: passed
- npm run lint: passed
- npm run build: passed
```

The exact touched file list may vary. The important requirement is that Codex
reports the real diff and the real verification results.

## Facilitator Notes

Keep the workshop centered on the loop, not on memorizing commands:

- **Inspect:** Codex reads the repository and explains the current system.
- **Plan:** Codex turns the feature request into a bounded implementation path.
- **Test:** Codex pins the calculation before changing the UI.
- **Implement:** Codex edits the smallest set of files that make the feature
  real.
- **Verify:** Codex runs the gates and fixes failures from evidence.
- **Review:** Codex inspects its own diff before the human accepts it.

This feature is intentionally small. It demonstrates the power of Codex because
participants see the full development loop complete in one sitting.
