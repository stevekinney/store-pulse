# Getting Started with Store Pulse and Codex

This guide is the participant preflight for the Store Pulse workshop. Its job is
to get everyone into the same working state before the interesting work starts.

The goal is simple: Codex can see the repository, the application dependencies
are installed, the local database exists, and the verification commands run.

## What You Need

You need:

- A local checkout of the Store Pulse repository.
- Node.js available on your machine.
- `npm`, because this repository has a checked-in `package-lock.json`.
- Codex installed and authenticated.
- A terminal session opened at the repository root.

Store Pulse uses Next.js, React, Prisma, SQLite, Tailwind CSS, Vitest, and
Playwright. You do not need to understand all of those before using Codex, but
you do need the project to install and test successfully.

## Open the Repository

You should see files and directories such as:

```text
AGENTS.md
README.md
app/
components/
lib/
package.json
prisma/
tests/
```

If those files are not present, stop and find the correct checkout before
starting Codex.

## Install Dependencies

Install with `npm`:

```bash
npm install
```

This repository has a `postinstall` hook. When `.env` is missing, `npm install`
runs:

```bash
npm run setup
```

That setup command copies `.env.example` to `.env`, generates the Prisma client,
applies migrations, and seeds the local SQLite database.

> [!NOTE]
> Use `npm` for Store Pulse. The repository intentionally includes
> `package-lock.json`, so do not switch the workshop to pnpm, yarn, or Bun.

## Bootstrap Manually

If the install did not run setup, or if you need to reset the local state, run:

```bash
npm run setup
```

If the database is stale and you intentionally want to rebuild it:

```bash
npm run db:reset
```

`db:reset` is destructive for the local SQLite database. That is fine for this
demo application, but it is still worth naming the action before running it.

## Install Playwright Browser

The end-to-end test uses Chromium. Install the browser once:

```bash
npx playwright install chromium
```

On Linux, CI-like machines may need:

```bash
npx playwright install chromium --with-deps
```

This command needs network access. If Codex is running with shell network access
disabled, it may ask for approval or fail until network access is allowed for
setup.

## Run the Verification Commands

Start with the fast checks:

```bash
npm run lint
npm run test
```

Run the build:

```bash
npm run build
```

Run the end-to-end test when Chromium is installed:

```bash
npm run test:e2e
```

The everyday quality gate for most workshop feature work is:

```bash
npm run lint
npm run test
```

Use `npm run build` when a change touches routing, rendering, configuration, or
anything that might compile differently in production. Use `npm run test:e2e`
when a change affects the dashboard flow that Playwright covers.

## Start the Application

Run the development server:

```bash
npm run dev
```

Then open the local application in a browser. The default Next.js development
URL is:

```text
http://localhost:3000
```

If the port is already in use, Next.js may choose another port. Use the URL
printed by the command.

## Start Codex

From the repository root:

```bash
codex
```

You can also start Codex with an initial prompt:

```bash
codex "Inspect this repository and summarize the application structure."
```

When Codex starts in this repository, it should read `AGENTS.md`. That file is
the primary project briefing. It explains the stack, project layout, domain
rules, testing expectations, and out-of-scope work.

## Confirm the Session State

Inside Codex, run:

```text
/status
```

Check:

- The current directory is the Store Pulse repository.
- The sandbox mode is appropriate for the task.
- The approval mode is appropriate for the task.
- Codex has loaded project instructions.

For normal workshop implementation, the recommended posture is:

```text
sandbox: workspace-write
approval: on-request
network: disabled unless setup requires it
```

For review-only work, use a stricter posture:

```text
sandbox: read-only
approval: untrusted
```

## First Prompt

A good first prompt asks Codex to inspect before acting:

```text
Inspect this repository and explain the main application structure. Focus on
the routes, lib helpers, Prisma schema, seed data, and tests. Do not edit files.
```

Then ask for a feature plan:

```text
Read reference/next-prompts.md and choose the smart reorder suggestions task.
Inspect the relevant files, then make a concise implementation plan. Do not edit
files until the plan is clear.
```

Then implement:

```text
Implement the smart reorder suggestions plan. Follow AGENTS.md, keep the scope
tight, add unit tests for the calculation logic, and run npm run lint and
npm run test before finishing.
```

## Files Worth Knowing

Core application routes:

- `app/page.tsx`: operations dashboard.
- `app/stores/page.tsx`: store list.
- `app/stores/[id]/page.tsx`: store detail page.
- `app/products/page.tsx`: product catalog.
- `app/tasks/page.tsx`: task list.
- `app/tasks/actions.ts`: task completion action.

Domain and data helpers:

- `lib/dashboard.ts`: dashboard data access.
- `lib/inventory.ts`: inventory helpers.
- `lib/metrics.ts`: pure metric calculations.
- `lib/stores.ts`: store data access.
- `lib/tasks.ts`: task data access.
- `lib/db.ts`: Prisma singleton.

Data and tests:

- `prisma/schema.prisma`: database schema.
- `prisma/seed.ts`: seed data.
- `tests/unit/`: Vitest unit tests.
- `tests/e2e/`: Playwright tests.

Reference material:

- `reference/prompting-best-practices.md`
- `reference/safety.md`
- `reference/review-and-verification.md`
- `reference/context-management.md`
- `reference/troubleshooting.md`

## Common Setup Problems

If `npm install` fails, read the first real error rather than the final npm
summary. Dependency, network, and Prisma failures look different.

If Prisma client types are missing, run:

```bash
npm run setup
```

If the local database looks wrong, reseed:

```bash
npm run db:seed
```

If the schema changed and the database needs a full local reset:

```bash
npm run db:reset
```

If Playwright fails because Chromium is missing, run:

```bash
npx playwright install chromium
```

If Codex cannot edit files, check the sandbox mode with:

```text
/status
```

If Codex cannot use the network, see `reference/safety.md` before changing the
network setting.

## Ready Checklist

You are ready for the workshop when:

- `npm install` has completed.
- `.env` exists.
- Prisma setup has completed.
- `npm run lint` passes.
- `npm run test` passes.
- `npm run build` passes, or the facilitator has explicitly skipped build for
  time.
- Codex opens from the repository root.
- `/status` shows the expected sandbox and approval posture.
- You understand that `AGENTS.md` is the repository briefing.

The workshop can tolerate an occasional local machine issue. It cannot tolerate
starting from the wrong directory or skipping the project briefing.
