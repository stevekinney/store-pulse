# StorePulse — Operations Dashboard (Demo)

A small, demo-only operations dashboard for a fictional retail chain. It is
intended for a workshop on using Codex to read, extend, refactor, and test an
existing codebase. **Nothing here is production software, none of the data is
real, and the app is not affiliated with any real retailer.**

The application lets a regional operations manager see, at a glance, which stores
have low inventory, which products need attention, which tasks are open, and how
each store is doing overall.

## Prerequisites

- **Node.js 20.9+** (Next.js 16 minimum).
- **npm** — the project ships a `package-lock.json`.

## Install

```bash
npm install
```

## Database setup

The app uses Prisma with a local SQLite database. The initial migration is
checked in to `prisma/migrations/` so a fresh clone is reproducible.

```bash
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

The seed populates 8 stores, 20 products, 160 inventory rows, and 20 tasks. A
realistic chunk of inventory is intentionally below its reorder threshold so
the dashboard has meaningful low-stock alerts.

## Run the app

```bash
npm run dev
```

Then open the routes in your browser:

- `/` — operations dashboard with headline metrics, urgent low-stock list,
  recent active tasks, and a store-health table.
- `/stores` — table of all stores with operational counts.
- `/stores/[id]` — store detail with inventory and tasks.
- `/products` — product catalog with a category filter.
- `/tasks` — all tasks across the chain; mark active tasks complete from
  here.

## Tests

Unit tests with Vitest, plus one end-to-end test with Playwright. The E2E test
uses a separate `prisma/test.db` so it does not touch your dev database.

```bash
npm run test               # vitest
npx playwright install chromium    # one-time; add --with-deps on Linux CI
npm run test:e2e           # playwright
```

## Useful scripts

| Script             | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `npm run dev`      | Start the dev server (Turbopack).              |
| `npm run build`    | Production build.                              |
| `npm run start`    | Start a production build.                      |
| `npm run lint`     | ESLint.                                        |
| `npm run test`     | Vitest unit tests.                             |
| `npm run test:e2e` | Playwright end-to-end tests.                   |
| `npm run db:seed`  | Seed the database.                             |
| `npm run db:reset` | Drop and re-create the database, then re-seed. |

## How the metrics work

To prevent the dashboard from flagging work on retired stores or
discontinued products, the pure aggregation helpers in `lib/metrics.ts`
apply a few rules:

- **Inactive products** are still listed on `/products` and `/stores/[id]`
  with an "Inactive" badge, but they are excluded from every low-stock
  metric.
- **Closed stores** still appear on `/stores` (with the Closed badge) so
  managers can find them, but they are excluded from the dashboard's
  headline counts, urgent low-stock list, recent-active-tasks list, and
  the store-health rollup. On the `/stores` table, their counts render as
  `—`.
- **Maintenance stores** are included in every metric — they are still
  operational, just under maintenance.

The same rules are unit-tested in `tests/unit/metrics.test.ts`.

## Future feature ideas

Workshop extension points the codebase is structured for:

- Smart reorder suggestions based on inventory severity + supplier history.
- A per-store incident timeline alongside tasks.
- An AI-style store operations assistant that answers questions across
  inventory, products, and tasks.
- Task assignment to named team members.
- Inventory search and filtering across stores.
- A regional reporting dashboard that rolls up the same metrics by region
  rather than by store.

## Schema changes

When the schema evolves, author a new migration with:

```bash
npx prisma migrate dev --name <migration-name>
```

The committed initial migration is **not** edited in place — new migrations
are stacked on top so anyone can re-create the same database from scratch.
