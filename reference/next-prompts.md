# Next Feature Prompts

These prompts are designed for workshop participants to hand to Codex as
self-contained feature requests. Each one should start with repository
inspection, produce a small plan, and end with verification.

## Smart Reorder Suggestions

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

- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: the dashboard and store detail page display reorder
suggestions for low-stock active products, and all verification gates pass.
```

## Store Incident Timeline

```text
Add an incident timeline to each store detail page.

First inspect the existing Prisma schema, seed script, store data access,
status badge components, type parsers, and store detail page. Match the
repository conventions.

Create a `StoreIncident` Prisma model related to `Store` with `severity`,
`title`, `description`, `reportedAt`, and `status`. Use string values for
severity and status, matching the existing project convention.

Add a new migration; do not edit the initial migration. Seed realistic
incidents for several stores. Show incidents on the store detail page in
reverse chronological order with severity and status badges.

Add type parsers and unit tests for the new incident severity and status
values.

Verification gates:

- `npx prisma migrate dev --name add-store-incidents`
- `npm run db:seed`
- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: each seeded store with incidents shows a reverse
chronological incident timeline on its detail page, and all verification gates
pass.
```

## Operations Assistant Panel

```text
Add a simple operations assistant panel to the dashboard.

The assistant must not call an external AI API. First inspect the existing
dashboard metrics, inventory helpers, task helpers, store data access, and
dashboard page. Match the repository conventions.

Create a deterministic helper in `lib/operations-assistant.ts` that answers
these predefined operational questions using existing dashboard, inventory,
task, product, and store data:

- Which stores need attention today?
- What are the most urgent low-stock items?
- Which active tasks are due soon?
- Which stores have the highest combined operational risk?

Render the panel on the dashboard with predefined question buttons or links and
deterministic answers. Keep the implementation server-rendered unless
client-side state is genuinely needed.

Add unit tests for the helper logic.

Verification gates:

- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: the dashboard includes an operations assistant panel with
deterministic answers for the predefined questions, and all verification gates
pass.
```

## Inventory Search and Filtering

```text
Add inventory search and filtering across stores.

First inspect the existing product, store, inventory, and routing structure.
Match the repository conventions.

Add an inventory view that lets a user search by product name or SKU and filter
by store status, product category, and low-stock state. Keep database access in
`lib/` and keep any reusable filtering or matching logic pure enough to unit
test.

Do not add a component library or client-side state unless the interaction
requires it. Prefer URL search parameters so filtered views can be linked and
reloaded.

Add unit tests for the pure filtering logic.

Verification gates:

- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: users can navigate to an inventory page, combine search and
filters, reload the URL, and see the same filtered results.
```

## Regional Reporting Dashboard

```text
Add a regional reporting dashboard.

First inspect the existing dashboard metrics, store health rollup, store
statuses, and route conventions. Match the repository conventions.

Create pure aggregation logic that rolls up operational metrics by region:
store count, active task count, low-stock count, and the number of maintenance
stores. Preserve the existing domain rules for closed stores, inactive
products, and maintenance stores.

Add a `/regions` page that displays the regional rollup in a table and links
back to the relevant stores when possible.

Add unit tests for the regional aggregation logic.

Verification gates:

- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: `/regions` renders one row per region with correct rollup
metrics, and all verification gates pass.
```

## Task Assignment

```text
Add task assignment to named team members.

First inspect the Prisma schema, seed script, task helpers, task action, task
page, and store detail page. Match the repository conventions.

Add a simple assignment model for store tasks. Keep the scope small: tasks can
be assigned to a named team member, and seeded tasks should include realistic
assignees. Show the assignee on the task list and store detail page.

If a schema change is needed, add a new migration; do not edit the initial
migration. Avoid authentication, user accounts, or permissions.

Add tests for any pure task formatting or sorting changes.

Verification gates:

- `npx prisma migrate dev --name add-task-assignees`
- `npm run db:seed`
- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: seeded tasks show realistic assignees wherever tasks are
listed, and all verification gates pass.
```

## Product Category Low-Stock Filters

```text
Add product category filters to low-stock reporting.

First inspect the existing product categories, low-stock helpers, dashboard
metrics, product page filters, and dashboard page. Match the repository
conventions.

Allow the dashboard low-stock section to be filtered by product category.
Prefer URL search parameters so the filtered view can be linked and reloaded.
Keep filtering rules in pure helpers where practical and preserve existing
closed-store and inactive-product behavior.

Add unit tests for the category filtering logic.

Verification gates:

- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: selecting a category filters the low-stock reporting without
changing the underlying headline metric semantics, and all verification gates
pass.
```

## Complete Tasks From Store Detail

```text
Add a complete-task action to the store detail page.

First inspect the existing task completion action, tasks page, task helpers,
store detail page, and tests. Match the repository conventions.

Reuse the existing server action pattern so open or in-progress tasks can be
completed directly from a store detail page. Do not duplicate task mutation
logic if it can be shared cleanly.

After a task is completed, the store detail page should refresh with the task
shown as completed using the existing task display conventions.

Add or update tests for any pure helper changes. If an end-to-end test is
appropriate, keep it focused on the completed task workflow.

Verification gates:

- `npm run test`
- `npm run lint`
- `npm run build`

Completion signal: a user can complete a task from a store detail page and see
the updated status after the action completes.
```
