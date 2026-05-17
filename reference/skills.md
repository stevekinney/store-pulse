# Store Pulse Skill Ideas

Skills are most useful when the same context, workflow, or failure mode comes
up repeatedly. For Store Pulse, the best skills are not generic "write React"
guides. They are small operational briefs that help Codex remember this
repository's local rules: Next.js 16 App Router, Prisma 6, strict TypeScript,
Tailwind v4, pure helper tests, seeded demo data, and the dashboard's status
semantics.

A good Store Pulse skill should do three things:

- Tell Codex when the skill applies.
- Point Codex at the files it should inspect first.
- Name the verification gates that prove the work is done.

It should not repeat the whole README or AGENTS.md. Codex can read those files
directly. The skill should be the shorter workflow that keeps Codex from
forgetting the important parts while it is working.

## Skill Authoring Pattern

Use this shape for project-specific skills:

```markdown
---
name: store-pulse-<specific-workflow>
description: Use when <specific trigger>, especially <common examples>.
---

# Store Pulse <Specific Workflow>

## Start here

- Read `AGENTS.md`.
- Inspect the files most likely to own this behavior.
- Make a short plan before editing non-trivial code.

## Local rules

- Use `npm`, not Bun, because this project ships `package-lock.json`.
- Keep database access in `lib/`.
- Keep reusable business logic pure and unit-tested.
- Prefer server components unless client-side state is required.
- Preserve the dashboard status semantics.

## Verification

- Run the smallest relevant test first.
- Finish with `npm run test`, `npm run lint`, and `npm run build`.
- If Prisma schema changed, run the migration and seed gates too.
```

## Suggested First Skills

These are the skills most likely to help workshop participants succeed without
overloading them with unnecessary process.

### Store Pulse Feature Implementation

**Use when:** A participant asks Codex to add one of the feature prompts from
`reference/next-prompts.md`.

**Why this helps:** Most feature work in this repository follows the same path:
inspect the current route, find the `lib/` helper layer, add focused tests,
then update the UI. This skill can keep Codex from jumping straight into a
page component and burying logic where it is hard to test.

**Likely files to mention:**

- `AGENTS.md`
- `reference/next-prompts.md`
- `lib/metrics.ts`
- `lib/inventory.ts`
- `lib/tasks.ts`
- `app/page.tsx`
- `app/stores/[id]/page.tsx`
- `tests/unit/`

**Example instructions:**

```markdown
---
name: store-pulse-feature-implementation
description: Use when implementing a new Store Pulse feature, especially dashboard, inventory, task, store detail, or reporting features.
---

# Store Pulse Feature Implementation

Start by reading `AGENTS.md` and the relevant prompt in
`reference/next-prompts.md`. Inspect the existing route, helper, and test files
before proposing changes.

Prefer this implementation path:

- Put reusable business logic in `lib/`.
- Add or update Vitest coverage before wiring the UI when practical.
- Keep route files focused on data loading and rendering.
- Use server components unless the interaction requires client-side state.
- Preserve the existing low-stock and store-status semantics.

Use `npm`, not Bun. Finish with `npm run test`, `npm run lint`, and
`npm run build`.
```

### Store Pulse Domain Semantics

**Use when:** A task touches low-stock logic, dashboard metrics, store health,
regional reporting, reorder suggestions, or operations-assistant answers.

**Why this helps:** The dashboard rules are easy to break accidentally. Closed
stores, inactive products, and maintenance stores each behave differently.

**Instructional content to include:**

- Inactive products still render on product and store detail pages.
- Inactive products are excluded from every low-stock metric.
- Closed stores still appear on `/stores`.
- Closed stores are excluded from dashboard metrics and store-health rollups.
- Maintenance stores are included in metrics.
- `tests/unit/metrics.test.ts` pins these rules.

**Example instructions:**

```markdown
---
name: store-pulse-domain-semantics
description: Use when changing Store Pulse metrics, low-stock behavior, dashboard aggregation, store health, or reporting logic.
---

# Store Pulse Domain Semantics

Before editing, read the "Domain rules" section in `AGENTS.md`, then inspect
`lib/metrics.ts`, `lib/inventory.ts`, and `tests/unit/metrics.test.ts`.

Preserve these rules unless the user explicitly asks to change them:

- Inactive products are visible but excluded from low-stock metrics.
- Closed stores are visible on `/stores` but excluded from dashboard rollups.
- Maintenance stores are operational and included in metrics.

Business rules belong in pure helpers under `lib/`, with Vitest coverage.
```

### Store Pulse Prisma Change

**Use when:** A feature needs a new model, field, relation, seed data, or
migration. The incident timeline and task assignment prompts are good examples.

**Why this helps:** Prisma changes have a specific safe path in this repository.
The initial migration should not be edited, seed data should remain realistic,
and generated client types need to stay current.

**Likely files to mention:**

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/`
- `lib/types.ts`
- Any `lib/` data-access module touched by the feature

**Example instructions:**

```markdown
---
name: store-pulse-prisma-change
description: Use when Store Pulse work changes Prisma schema, migrations, seed data, model relations, or generated Prisma types.
---

# Store Pulse Prisma Change

Read `AGENTS.md`, `prisma/schema.prisma`, and `prisma/seed.ts` before editing.
Add a new migration with `npx prisma migrate dev --name <migration-name>`.
Do not edit the initial migration in place.

Keep seed data realistic and deterministic. Update `lib/types.ts` when adding
new status-like string values. Keep database access in `lib/` and import the
singleton Prisma client from `lib/db.ts`.

Verification gates:

- `npx prisma migrate dev --name <migration-name>`
- `npm run db:seed`
- `npm run test`
- `npm run lint`
- `npm run build`
```

## More Skill Ideas

### Store Pulse Testing Strategy

**Use when:** A task adds behavior, fixes a bug, or changes helper logic.

**What it should teach:** Unit tests target `lib/` and should pass plain data
into pure functions. The Playwright test uses `prisma/test.db`; it should not
share the development database. The skill can tell Codex to write the failing
unit test first when the behavior is pure enough to test without the database.

**Good examples:**

- Reorder quantity calculation.
- Regional rollup aggregation.
- Operations assistant answer ranking.
- Product category low-stock filters.

### Store Pulse App Router Pages

**Use when:** A task creates or changes a page under `app/`.

**What it should teach:** This app uses Next.js 16 App Router. Codex should
verify framework behavior from local Next.js documentation when uncertain,
keep pages server-rendered by default, and avoid putting Prisma queries
directly in route files. Route files should import data access from `lib/`.

**Good examples:**

- Add `/regions`.
- Add an inventory search page.
- Add URL search parameter filters to dashboard sections.

### Store Pulse Server Actions

**Use when:** A task mutates data from the UI.

**What it should teach:** Inspect the existing task-completion flow before
adding another mutation. Reuse shared mutation logic when it keeps the code
simple, but do not add broad adapter layers. Keep validation close to the
action and refresh the affected route after mutation.

**Good examples:**

- Complete tasks from the store detail page.
- Add a small task status transition.
- Add a store-note creation form if that feature is introduced later.

### Store Pulse UI Composition

**Use when:** A task adds dashboard sections, badges, tables, empty states, or
store detail panels.

**What it should teach:** Reuse the small local component set before inventing
new UI structure. Use Tailwind v4 utilities from the existing app. Keep pages
quiet and operational rather than marketing-like. Tables need captions or
accessible labels, empty states should use `EmptyState`, and status-like values
should use badge components.

**Good examples:**

- Store incident severity badges.
- Reorder suggestion cells.
- Regional rollup tables.
- Operations assistant result panels.

### Store Pulse Seed Data Design

**Use when:** A task changes `prisma/seed.ts` or adds a feature whose value is
only visible with realistic data.

**What it should teach:** Seed data should be deterministic, credible, and
large enough to make the dashboard interesting. It should not include real
company names, real customer data, or throwaway placeholder text. Seed
invariants should fail loudly when impossible combinations are introduced.

**Good examples:**

- Incidents with varied severity and status.
- Task assignees across stores.
- Inventory levels that exercise filters and low-stock states.

### Store Pulse Workshop Prompt Writing

**Use when:** The user asks for new workshop prompts, task prompts, or exercise
ideas.

**What it should teach:** Prompts should be self-contained and mechanically
verifiable. They should name the files or areas to inspect, preserve important
domain rules, include exact verification commands, and define a completion
signal. Avoid time estimates and vague acceptance criteria.

**Good examples:**

- Add another prompt to `reference/next-prompts.md`.
- Split a large exercise into smaller workshop tasks.
- Write a prompt that intentionally requires planning before code changes.

### Store Pulse Codebase Tour

**Use when:** A participant asks Codex to explain how the app works before
changing it.

**What it should teach:** Start from the route map, then show how data flows
from Prisma through `lib/` into server components. Explain the separation
between pure helpers and database-backed wrappers. Keep the tour grounded in
actual files and avoid turning it into a generic Next.js explanation.

**Good examples:**

- "Explain how the dashboard metric count is calculated."
- "Where should I add a regional reporting feature?"
- "What should I test before changing low-stock behavior?"

## Skill Candidates to Avoid

Not every repeated idea should become a skill.

- **Generic React or TypeScript skills:** Codex already knows the basics.
- **A full copy of AGENTS.md:** This duplicates context and makes skills stale.
- **One skill per feature prompt:** Prefer reusable workflows over highly
  specific one-off instructions.
- **Skills that hide verification:** A skill should make gates more explicit,
  not replace them with confidence.

## Recommended Workshop Set

For a workshop, start with three skills:

- `store-pulse-feature-implementation`
- `store-pulse-domain-semantics`
- `store-pulse-prisma-change`

Those three cover the most important failure modes while staying easy to
explain. Add testing, App Router, and prompt-writing skills only if the class
will spend enough time using the repository for those patterns to repeat.
