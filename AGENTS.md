<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# StorePulse — Agent Guide

StorePulse is a small, demo-only operations dashboard for a fictional pet retail chain. It exists to support a workshop on reading, extending, refactoring, and testing an existing codebase. **Nothing here is production software, none of the data is real, and the app is not affiliated with any real retailer.**

If you are an automated agent (Claude Code, Codex, Cursor, etc.) reading this file: this is your primary briefing. Follow it before consulting general training intuition.

## Tech stack

- **Next.js 16** (App Router) on **React 19** — note the warning at the top of this file; treat your prior knowledge as suspect and verify against `node_modules/next/dist/docs/`.
- **TypeScript** in strict mode. `.ts` and `.tsx` only.
- **Prisma 6** against a local **SQLite** database (`prisma/dev.db`). Tests use a separate `prisma/test.db`.
- **Tailwind CSS v4** via `@tailwindcss/postcss`.
- **Vitest** for unit tests, **Playwright** for the single end-to-end test.
- **npm** is the package manager — a `package-lock.json` is checked in. Do _not_ swap it for pnpm, yarn, or bun.

## Setup

First-time setup is automated. `npm install` triggers a `postinstall` hook that runs `npm run setup` when `.env` is missing — copying `.env.example`, generating the Prisma client, applying migrations, and seeding.

```bash
npm install
```

If you need to bootstrap manually (or re-run after wiping state):

```bash
npm run setup
```

The seed populates 8 stores, 20 products, 160 inventory rows, and 20 tasks. A realistic chunk of inventory is intentionally below its reorder threshold so the dashboard has meaningful low-stock alerts.

## Everyday commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Turbopack dev server. |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint via `eslint.config.mjs`. |
| `npm run test` | Vitest unit tests (single run, not watch). |
| `npm run test:e2e` | Playwright end-to-end test against `prisma/test.db`. |
| `npm run db:migrate` | `prisma migrate dev` — author a new migration. |
| `npm run db:seed` | Re-seed the current database. |
| `npm run db:reset` | Drop, re-create, and re-seed. |
| `npm run setup` | First-time bootstrap (env + generate + migrate deploy + seed). |

Playwright needs a one-time browser install: `npx playwright install chromium` (add `--with-deps` on Linux CI).

## Project layout

```
app/             # Next.js App Router — routes, layouts, server components
components/     # Shared React components (kebab-case filenames)
lib/             # Pure helpers and Prisma access — the domain layer
prisma/          # schema.prisma, migrations/, seed.ts, dev.db, test.db
tests/
  unit/          # Vitest specs that import from lib/
  e2e/           # Playwright specs that exercise the running app
```

Routes worth knowing:

- `/` — operations dashboard: headline metrics, urgent low-stock list, recent active tasks, store-health table.
- `/stores`, `/stores/[id]` — store list and detail.
- `/products` — product catalog with category filter.
- `/tasks` — chain-wide tasks; complete from here.

## Conventions

These are house rules. Match them before importing patterns from elsewhere.

- **Filenames are kebab-case** for `.ts` and `.tsx` (`metric-card.tsx`, not `MetricCard.tsx`). Component _exports_ stay PascalCase.
- **Prefer full words over abbreviations** in identifiers and prose: `configuration` over `config`, `repository` over `repo`, `documentation` over `docs`.
- **TypeScript only.** No `.js`, `.mjs`, `.cjs`, or `.jsx` source files. Build config files that must be `.mjs` (PostCSS, ESLint flat config) are the exception.
- **Server components by default.** Add `"use client"` only when you actually need client-side state or effects.
- **Database access lives in `lib/`.** Route files import from `lib/`; they do not call Prisma directly. The Prisma client is a singleton in `lib/db.ts`.
- **Pure helpers stay pure.** `lib/metrics.ts` is the canonical example — accept data, return data, no side effects. This is what makes the unit tests trivial.
- **Tailwind v4**, not v3. Class names work the same in most cases, but configuration lives in CSS (`app/globals.css`) rather than `tailwind.config.js`. Do not add a `tailwind.config.*` file.
- **No backwards-compatibility shims.** If you rename or move something, update the call sites. Do not leave re-export barrels behind.
- **No placeholder content.** No unresolved task markers, no filler copy, no stub functions that pretend to work. Resolve or flag explicitly.

## Domain rules (status semantics)

`lib/metrics.ts` enforces a small set of rules that the dashboard depends on. Preserve them when changing aggregation logic:

- **Inactive products** appear on `/products` and `/stores/[id]` with an "Inactive" badge but are excluded from every low-stock metric.
- **Closed stores** still appear on `/stores` (Closed badge) so managers can find them, but are excluded from the dashboard's headline counts, urgent low-stock list, recent-active-tasks list, and store-health rollup. On the `/stores` table their counts render as `—`.
- **Maintenance stores** are included in every metric — they are still operational, just under maintenance.

These rules are pinned by `tests/unit/metrics.test.ts`. If you change them on purpose, update the tests in the same change.

## Testing

- **Default to TDD.** New behavior gets a Vitest spec; bug fixes get a regression test.
- **Unit tests** target `lib/` and should not need the database — pass data in, assert on the return value.
- **The E2E test** uses `prisma/test.db` so it does not touch your dev database. Do not change it to share `dev.db`.
- **Never use `--no-verify`** and never skip a failing test. Fix pre-existing warnings in files you touch.

## Schema changes

When the schema evolves:

```bash
npx prisma migrate dev --name <migration-name>
```

The committed initial migration is **not** edited in place — new migrations stack on top so anyone can re-create the same database from scratch. After authoring a migration, run `npm run db:seed` (or `npm run db:reset` if the change is destructive) and update affected types and tests.

## Things that will bite you

- **Next.js 16 is not your training data.** Server Actions, caching, params, and `cookies()`/`headers()` semantics have shifted. When in doubt, read `node_modules/next/dist/docs/`.
- **Tailwind v4 config is in CSS.** Do not generate a `tailwind.config.js`.
- **Prisma client must be a singleton.** Importing fresh `PrismaClient` instances inside route handlers leaks connections — always import from `lib/db.ts`.
- **The `postinstall` hook runs `npm run setup` whenever `.env` is missing.** If you delete `.env` and then `npm install`, you will re-bootstrap the database. That is intentional, but worth knowing.
- **`prisma/dev.db` and `prisma/test.db` are local artifacts.** Do not commit them; do not check schema state by reading the file.

## Out of scope

This is a workshop demo. Do _not_ add:

- Authentication, multi-tenant logic, or user accounts.
- A second database, a cache layer, or a queue.
- A component library or design system beyond Tailwind utilities and the small set in `components/`.
- Production deployment infrastructure.

Workshop extension points the codebase _is_ structured for live in the README under "Future feature ideas." Stay inside that envelope unless the user explicitly broadens scope.
