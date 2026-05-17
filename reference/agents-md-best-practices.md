# AGENTS.md Best Practices

An `AGENTS.md` file is the project briefing for coding agents. It should tell
an agent how to work safely and effectively in this repository before it starts
guessing from general training data.

Think of it as a maintainer sitting next to the agent at the start of a task:
"Here is what this project is, here is how we work, here are the commands that
prove you did not break it, and here are the mistakes that are expensive."

## What AGENTS.md Is For

**Operational context:** Explain how the repository works at the level needed
to make code changes: runtime, package manager, framework, database, test
tools, and important commands.

**Local conventions:** Name the rules that are specific to this project, even
if they are not universal best practices.

**Safety boundaries:** Tell agents which actions are allowed, which actions
need confirmation, and which areas are out of scope.

**Verification gates:** List the exact commands that prove a change is correct.
Use commands that exist in the repository.

**Known hazards:** Document the things an agent is likely to get wrong without
local context.

## What AGENTS.md Is Not For

`AGENTS.md` should not become a second README, an architecture encyclopedia, or
a long-form tutorial. Keep it short enough that an agent can read and obey it.

Avoid putting these things in `AGENTS.md`:

- Full product documentation.
- Long historical explanations.
- Complete API references.
- Generic programming advice.
- Every possible command in the repository.
- Secrets, tokens, customer data, or private operational details.
- Aspirational rules that no one verifies.

If a detail is important but too long, put it in a reference file and link to
it. If a rule is critical, encode it in tests, linting, or type checks.

## The Good Shape

A strong `AGENTS.md` usually answers these questions in this order:

- What is this repository?
- What stack does it use?
- How do I install, run, test, and build it?
- Where does code live?
- What conventions matter most?
- What domain rules must not be broken?
- How should schema or data changes happen?
- What should agents avoid?
- What traps are specific to this repository?

For Store Pulse, the current structure is a good model:

- Project purpose and scope.
- Tech stack.
- Setup.
- Everyday commands.
- Project layout.
- Conventions.
- Domain rules.
- Testing.
- Schema changes.
- Things that will bite you.
- Out of scope.

## Be Specific

Agents follow concrete instructions better than vibes.

Weak:

```markdown
Write good tests.
```

Better:

```markdown
Unit tests target `lib/` and should not need the database. Pass plain data in
and assert on the return value.
```

Weak:

```markdown
Use the right package manager.
```

Better:

```markdown
Use `npm`. A `package-lock.json` is checked in. Do not switch the repository to
Bun, pnpm, or Yarn.
```

Weak:

```markdown
Be careful with the database.
```

Better:

```markdown
When the Prisma schema changes, add a new migration with
`npx prisma migrate dev --name <migration-name>`. Do not edit the initial
migration in place.
```

## Encode Project Truth, Not Preference Theater

Good instructions describe how the repository actually works. They should be
easy to verify by reading the code or running commands.

For Store Pulse, these are project truths:

- The app uses Next.js 16 App Router and React 19.
- The package manager is npm because `package-lock.json` is committed.
- Prisma uses SQLite locally.
- Unit tests are Vitest tests under `tests/unit/`.
- The Playwright test uses `prisma/test.db`.
- Database access belongs in `lib/`.
- `lib/metrics.ts` owns the dashboard aggregation semantics.

These are less useful unless they are backed by tooling:

- "Keep the code clean."
- "Use best practices."
- "Make it scalable."
- "Write production-quality code."

If you want a behavior, either name the concrete behavior or add a check that
enforces it.

## Name Verification Gates

Agents need to know when they are done. Put exact commands in `AGENTS.md`, and
make sure they work from a clean checkout.

For Store Pulse, the everyday gates are:

```bash
npm run test
npm run lint
npm run build
```

For schema changes, the gates expand:

```bash
npx prisma migrate dev --name <migration-name>
npm run db:seed
npm run test
npm run lint
npm run build
```

For browser-level behavior, name the end-to-end gate:

```bash
npm run test:e2e
```

> [!TIP]
> If a command is optional, say when to run it. A giant list of every command
> makes agents slower without making them safer.

## Explain Domain Rules

The most valuable part of `AGENTS.md` is often the part that has nothing to do
with the framework.

In Store Pulse, the dashboard has status semantics:

- Inactive products appear on product and store detail pages, but are excluded
  from low-stock metrics.
- Closed stores appear on `/stores`, but are excluded from dashboard rollups.
- Maintenance stores are still operational and included in metrics.

These rules belong in `AGENTS.md` because an agent can easily break them while
adding a reorder feature, a regional dashboard, or an assistant panel. They
also belong in tests, because documentation alone is not a guardrail.

## Separate Durable Rules From Task Prompts

Use `AGENTS.md` for rules that apply across many tasks. Use prompt files,
issues, or reference documents for individual exercises.

For Store Pulse:

- `AGENTS.md` should say that reusable business logic belongs in `lib/`.
- `reference/next-prompts.md` should describe the individual feature prompts.
- `reference/skills.md` should describe optional skills that could support the
  workshop.

Do not put every workshop exercise directly in `AGENTS.md`. That makes the
agent briefing noisy and harder to maintain.

## Keep Scope Boundaries Explicit

Agents are good at adding things. That is useful until they add the wrong
things.

For a demo application, out-of-scope guidance is important:

```markdown
Do not add authentication, multi-tenant logic, user accounts, a second
database, a cache layer, a queue, or production deployment infrastructure
unless the user explicitly asks for it.
```

This prevents a small feature prompt from turning into a platform rewrite.

## Prefer "Inspect First" Instructions

An `AGENTS.md` file should bias the agent toward reading the existing code
before implementing.

Good:

```markdown
Do not assume a framework pattern. Inspect the existing codebase and match its
conventions before introducing new structure.
```

Good:

```markdown
When in doubt about Next.js 16 behavior, read the local documentation under
`node_modules/next/dist/docs/` before relying on prior knowledge.
```

This is especially useful for fast-moving frameworks, local architecture
patterns, and demo repositories where the teaching goals matter as much as the
implementation.

## Put Data Ownership In Writing

Agents need to know where code belongs.

For Store Pulse:

- Route files live in `app/`.
- Shared React components live in `components/`.
- Pure helpers and data access live in `lib/`.
- Prisma schema, migrations, and seed data live in `prisma/`.
- Unit tests live in `tests/unit/`.
- End-to-end tests live in `tests/e2e/`.

This reduces the chance that a route handler creates its own Prisma client, a
page component grows untested business logic, or a one-off helper lands in the
wrong directory.

## Include Naming And File Rules

Naming rules are cheap to document and expensive to clean up later.

Good examples:

```markdown
Filenames are kebab-case for `.ts` and `.tsx`.
```

```markdown
Prefer full words over abbreviations in identifiers and prose.
```

```markdown
Use `.ts` and `.tsx` files. Do not introduce `.js`, `.mjs`, `.cjs`, or `.jsx`
source files unless the project already requires them.
```

If a naming rule is easy to lint, consider adding an automated check. If it is
more subjective, a short `AGENTS.md` rule is still useful.

## Document Dangerous Actions

`AGENTS.md` should make it clear which actions are safe to take directly and
which actions require confirmation.

Safe and local:

- Editing source files.
- Running tests.
- Running a development server.
- Creating a migration for a requested schema change.

Needs confirmation:

- Deleting branches or files.
- Force pushing.
- Dropping databases.
- Sending Slack or email messages.
- Posting to external services.
- Merging pull requests.
- Changing deployment infrastructure.

This is less about permission theater and more about blast radius. If the
action is hard to reverse or affects other people, require confirmation.

## Avoid Contradictions

Contradictory instructions create unreliable agents. Before adding a rule,
check the current repository state.

Bad:

```markdown
Use Bun for all commands.
```

In Store Pulse, that conflicts with the committed `package-lock.json` and the
existing npm scripts.

Better:

```markdown
Use `npm`. This project ships a `package-lock.json`.
```

If the repository changes package managers later, update `AGENTS.md` in the
same change.

## Keep It Maintained

An outdated `AGENTS.md` is worse than no `AGENTS.md` because it gives the
agent false confidence.

Update it when:

- The package manager changes.
- Setup commands change.
- Test or build commands change.
- A new domain invariant becomes important.
- A repeated agent mistake needs a durable guardrail.
- A workflow moves from "tribal knowledge" to "everyone should do this."

Do not update it for:

- One-off implementation details.
- Temporary debugging notes.
- Feature ideas that belong in an issue or prompt file.
- Long explanations better suited for project documentation.

## Recommended Template

Use this as a starting point for a new project:

````markdown
# <Project Name>

Briefly explain what this repository is and what it is not.

## Tech stack

- Runtime, framework, language, database, package manager, and test tools.
- Call out unusual versions or fast-moving APIs.

## Setup

```bash
<install command>
<bootstrap command>
```

## Everyday commands

| Command | What it does |
| --- | --- |
| `<command>` | <purpose> |

## Project layout

```text
app/        # routes or application entry points
components/ # shared UI
lib/        # domain logic and data access
tests/      # test suites
```

## Conventions

- Naming rules.
- File type rules.
- Data access rules.
- Framework-specific defaults.

## Domain rules

- Business invariant that must be preserved.
- Business invariant that must be preserved.
- Mention the tests that pin these rules.

## Testing

- Where unit tests belong.
- When to add end-to-end tests.
- Exact verification commands.

## Schema or data changes

- Migration command.
- Seed command.
- Rules for editing existing migrations or fixtures.

## Safety boundaries

- Actions agents may take directly.
- Actions that require confirmation.
- Things that are out of scope.

## Known hazards

- Framework gotchas.
- Local setup traps.
- Files or generated artifacts not to commit.
````

## Store Pulse Example

For this repository, the most important lines are the ones that prevent common
agent mistakes:

```markdown
- npm is the package manager. Do not switch to Bun, pnpm, or Yarn.
- Database access lives in `lib/`. Route files import from `lib/`; they do not
  call Prisma directly.
- Pure helpers stay pure. Accept data, return data, and avoid side effects.
- Tailwind v4 configuration lives in CSS. Do not add `tailwind.config.*`.
- Closed stores and inactive products have special dashboard semantics. Read
  `lib/metrics.ts` and `tests/unit/metrics.test.ts` before changing metrics.
- This is a workshop demo. Do not add authentication, multi-tenancy, a cache,
  a queue, or deployment infrastructure unless explicitly requested.
```

Those instructions are valuable because they are local, actionable, and easy to
verify.

## Final Checklist

Before calling an `AGENTS.md` file done, ask:

- Does it tell the agent what this repository is?
- Does it name the exact install, test, lint, and build commands?
- Does it identify where important code belongs?
- Does it preserve the project-specific business rules?
- Does it warn about the mistakes agents are likely to make?
- Does it avoid duplicating long documentation?
- Does every rule still match the current repository?
