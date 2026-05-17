import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import {
  PriorityBadge,
  StoreStatusBadge,
} from "@/components/status-badge";
import { getDashboardMetrics } from "@/lib/dashboard";
import { formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div>
      <PageHeader
        title="Operations dashboard"
        description="A snapshot of inventory, tasks, and store health across the chain."
      />

      <section
        aria-label="Headline metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <MetricCard label="Stores" value={metrics.storeCount} hint="All locations" />
        <MetricCard
          label="Active products"
          value={metrics.productCount}
          hint="In active catalog"
        />
        <MetricCard
          label="Low stock"
          value={metrics.lowStockCount}
          hint="Active products, non-closed stores"
        />
        <MetricCard
          label="Active tasks"
          value={metrics.activeTaskCount}
          hint="Open or in progress"
        />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white">
          <header className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-900">
              Most urgent low stock
            </h2>
            <p className="text-xs text-zinc-500">
              Top items by remaining stock relative to reorder threshold.
            </p>
          </header>
          {metrics.urgentLowStock.length === 0 ? (
            <div className="p-5">
              <EmptyState message="No low-stock items right now." />
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {metrics.urgentLowStock.map((row) => (
                <li key={row.inventoryId} className="px-5 py-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-900">{row.productName}</p>
                      <p className="text-xs text-zinc-500">
                        SKU {row.productSku} • {row.storeName} (#{row.storeNumber})
                      </p>
                    </div>
                    <p className="whitespace-nowrap text-right text-xs text-zinc-600">
                      <span className="font-semibold text-rose-700">
                        {row.quantityOnHand}
                      </span>
                      {" on hand · "}
                      {row.quantityOnOrder} on order · threshold {row.reorderThreshold}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white">
          <header className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-900">
              Recent active tasks
            </h2>
            <p className="text-xs text-zinc-500">
              Open or in-progress tasks, soonest due first.
            </p>
          </header>
          {metrics.recentActiveTasks.length === 0 ? (
            <div className="p-5">
              <EmptyState message="No active tasks." />
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {metrics.recentActiveTasks.map((task) => (
                <li key={task.taskId} className="px-5 py-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-900">{task.title}</p>
                      <p className="text-xs text-zinc-500">
                        {task.storeName} · {formatRelative(task.dueDate)}
                      </p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Store health</h2>
          <p className="text-xs text-zinc-500">
            One row per operational store. Closed stores are excluded.
          </p>
        </header>
        {metrics.storeHealth.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No stores to report on." />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-zinc-100 text-sm">
            <caption className="sr-only">
              Active task count and low-stock count for each non-closed store
            </caption>
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Store
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Region
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Status
                </th>
                <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                  Active tasks
                </th>
                <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                  Low stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {metrics.storeHealth.map((row) => (
                <tr key={row.storeId} className="hover:bg-zinc-50">
                  <th
                    scope="row"
                    className="px-5 py-2 text-left font-normal text-zinc-900"
                  >
                    <Link href={`/stores/${row.storeId}`} className="hover:underline">
                      {row.storeName}{" "}
                      <span className="text-xs text-zinc-500">#{row.storeNumber}</span>
                    </Link>
                  </th>
                  <td className="px-5 py-2 text-zinc-600">{row.region}</td>
                  <td className="px-5 py-2">
                    <StoreStatusBadge status={row.status} />
                  </td>
                  <td className="px-5 py-2 text-right">{row.activeTaskCount}</td>
                  <td className="px-5 py-2 text-right">{row.lowStockCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
