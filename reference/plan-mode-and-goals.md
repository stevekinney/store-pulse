# Plan Mode and Goals in Codex

Plan Mode and Goal mode solve different problems:

- **Plan Mode:** Use it before implementation when the task needs discovery,
  decisions, or a clear execution plan.
- **Goal mode:** Use it when Codex needs a persistent objective for longer work.

In current Codex documentation, the slash command is `/goal` and the feature
flag is plural: `features.goals`. People may refer to this as the "goals
feature," but the command examples use singular `/goal`.

## Why Use Plan Mode

Use Plan Mode when the cost of a wrong first edit is high. It gives Codex room
to inspect the repository, ask clarifying questions, compare implementation
paths, and produce a plan before it mutates files.

Plan Mode is especially useful when:

- The task has multiple plausible implementations.
- The task touches schema, data flow, tests, and UI.
- You need Codex to discover the current architecture before changing it.
- You want to review scope before the diff exists.
- You are turning a fuzzy idea into mechanically verifiable work.

Do not use Plan Mode for trivial edits where the correct change is obvious. A
one-line copy fix does not need a planning ceremony.

## How To Enter Plan Mode

Use `/plan`:

```text
/plan
```

You can also include the planning request inline:

```text
/plan Add smart reorder suggestions to Store Pulse. Inspect the relevant files,
then propose a concise implementation plan. Do not edit files yet.
```

Some Codex surfaces also let you toggle Plan Mode with a keyboard shortcut such
as Shift+Tab. The slash command is the most portable workshop instruction.

While a task is already running, `/plan` may be temporarily unavailable. Wait
for the current turn to finish, then enter Plan Mode.

## What A Good Plan Includes

A good Codex plan should be decision-complete enough that implementation can
start without another round of guessing.

For Store Pulse, ask the plan to include:

- The files or areas Codex inspected.
- The implementation approach.
- The public interfaces, helpers, or data shapes that will change.
- Tests to add or update.
- Verification commands.
- Known risks or open questions.
- A clear completion signal.

Copyable Store Pulse prompt:

```text
/plan Add smart reorder suggestions to Store Pulse.

First inspect the dashboard, store detail page, inventory helpers, metrics
helpers, and unit tests. Do not edit files.

The plan should include:
- where the reorder calculation should live
- which tests should be written first
- whether dashboard aggregation needs a new field
- how the dashboard and store detail page should render the suggestion
- verification commands
- any risks or open questions
```

## Plan Mode Use Cases

| Use case                      | Why Plan Mode helps                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| Smart reorder suggestions     | Codex can inspect low-stock data flow before deciding where to add the helper and UI fields. |
| Store incident timeline       | Schema, seed data, migration, types, and UI need one coherent path before edits start.       |
| Regional reporting dashboard  | Metrics semantics must be preserved while adding a new aggregation surface.                  |
| Refactoring dashboard metrics | The plan can separate behavior-preserving refactors from feature changes.                    |
| Debugging a confusing failure | Codex can diagnose and explain the likely root cause before stacking another patch.          |

Plan Mode is also useful for plan review. Ask Codex to critique its own plan
before implementation:

```text
Review this plan before implementation. Look for missing tests, unclear file
ownership, scope drift, and anything that conflicts with AGENTS.md. Do not edit
files.
```

## Why Use Goal Mode

Use Goal mode when Codex needs a persistent objective across a longer task. A
goal gives Codex something durable to keep checking as it works: what outcome
should be true, what constraints matter, and how to know it is done.

Goal mode is useful when:

- The work may take many turns.
- You may need to pause and resume.
- The task has several verification checkpoints.
- Codex should keep working until a defined completion signal is reached.
- You want progress to stay visible above the composer in the Codex app.

Do not use Goal mode for vague aspirations such as "make the app better." A
goal should be specific enough for Codex to know whether it has succeeded.

## Enable The Goals Feature

If `/goal` does not appear in the slash command list, enable the goals feature.

In `config.toml`:

```toml
[features]
goals = true
```

From the CLI:

```bash
codex features enable goals
```

Restart or refresh Codex if the command does not appear immediately.

## How To Use `/goal`

Set a goal:

```text
/goal Finish the smart reorder suggestions feature and leave npm run test,
npm run lint, and npm run build passing.
```

View the active goal:

```text
/goal
```

Pause, resume, or clear it:

```text
/goal pause
/goal resume
/goal clear
```

In the Codex app, an active goal appears above the composer with controls to
pause, resume, edit, or clear it.

Goal text must be non-empty. Current Codex documentation describes a 4,000
character limit for goal objectives. If the instructions are longer than that,
put the details in a file and point the goal at the file.

## Writing Good Goals

A good goal includes:

- The concrete outcome.
- The scope boundaries.
- Required verification commands.
- Completion criteria.
- What to avoid.

Weak goal:

```text
/goal Improve Store Pulse.
```

Better goal:

```text
/goal Add smart reorder suggestions to Store Pulse. Keep the calculation in a
pure helper, show suggestions on the dashboard and store detail page, preserve
inactive-product and closed-store semantics, and finish only after npm run test,
npm run lint, and npm run build pass.
```

For larger goals, point at a file:

```text
/goal Complete the implementation plan in reference/current-goal.md. Stop only
when every acceptance criterion in that file is satisfied or a blocker is
documented.
```

## Plan First, Then Set A Goal

Plan Mode and Goal mode work well together.

Use this sequence for larger work:

1. Start with `/plan`.
2. Let Codex inspect the repository and produce a decision-complete plan.
3. Review and adjust the plan.
4. Set `/goal` using the refined plan and verification gates.
5. Let Codex work toward the goal.
6. Pause, resume, edit, or clear the goal as the task changes.

Store Pulse example:

```text
/plan Add a regional reporting dashboard. Inspect existing metric helpers,
domain rules, routes, and tests. Do not edit files yet.
```

After the plan is clear:

```text
/goal Implement the approved regional reporting plan. Preserve closed-store,
inactive-product, and maintenance-store semantics. Finish only when the new
tests pass and npm run test, npm run lint, and npm run build pass.
```

## Plan Mode, Goals, And Automations

These features have different jobs:

| Feature     | Use it for                                                    | Do not use it for                                |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------ |
| Plan Mode   | Shaping a task before edits begin.                            | Persistent tracking after implementation starts. |
| Goal mode   | Keeping a long-running task aligned with a completion target. | Scheduling future work by itself.                |
| Automations | Running recurring or scheduled background checks.             | Replacing goal clarity or human review.          |

If the task is ambiguous, start with Plan Mode. If the task is long-running, set
a goal after the plan is clear. If the task needs to recur later, use an
automation with a durable prompt.

## Checklist

Use Plan Mode when:

- The task is ambiguous.
- Several implementation paths are possible.
- The blast radius is larger than one obvious file.
- You want to review the plan before the diff exists.

Use Goal mode when:

- The task will span multiple turns.
- You need a durable definition of done.
- Codex should keep checking progress against explicit criteria.
- You may need to pause and resume the work.

Avoid both when the task is small, local, and obvious.
