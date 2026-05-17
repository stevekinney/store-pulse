import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import {
  ActiveProductBadge,
  LowStockBadge,
  PriorityBadge,
  StoreStatusBadge,
  TaskStatusBadge,
} from "@/components/status-badge";
import { getStoreById } from "@/lib/stores";
import { isLowStock } from "@/lib/inventory";
import { sortTasksForDisplay } from "@/lib/tasks";
import { formatDate, formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

type StoreDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { id } = await params;
  const store = await getStoreById(id);
  if (!store) notFound();

  const sortedTasks = sortTasksForDisplay(store.tasks);

  return (
    <div>
      <PageHeader title={store.name} description={`Store #${store.storeNumber}`} />

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Location
            </dt>
            <dd className="mt-1 text-zinc-900">
              {store.city}, {store.state}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Region
            </dt>
            <dd className="mt-1 text-zinc-900">{store.region}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Status
            </dt>
            <dd className="mt-1">
              <StoreStatusBadge status={store.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Inventory rows
            </dt>
            <dd className="mt-1 text-zinc-900">{store.inventory.length}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Inventory</h2>
          <p className="text-xs text-zinc-500">
            All products carried by this store, with low-stock items flagged.
          </p>
        </header>
        {store.inventory.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No inventory rows for this store." />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-zinc-100 text-sm">
            <caption className="sr-only">Inventory rows for {store.name}</caption>
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Product
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  SKU
                </th>
                <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                  On hand
                </th>
                <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                  On order
                </th>
                <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                  Threshold
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {store.inventory.map((item) => {
                const low =
                  item.product.isActive &&
                  isLowStock(
                    {
                      quantityOnHand: item.quantityOnHand,
                      quantityOnOrder: item.quantityOnOrder,
                    },
                    item.product.reorderThreshold,
                  );
                return (
                  <tr key={item.id} className="hover:bg-zinc-50">
                    <th
                      scope="row"
                      className="px-5 py-2 text-left font-normal text-zinc-900"
                    >
                      {item.product.name}
                    </th>
                    <td className="px-5 py-2 text-zinc-500">{item.product.sku}</td>
                    <td className="px-5 py-2 text-right">{item.quantityOnHand}</td>
                    <td className="px-5 py-2 text-right">{item.quantityOnOrder}</td>
                    <td className="px-5 py-2 text-right">
                      {item.product.reorderThreshold}
                    </td>
                    <td className="px-5 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <ActiveProductBadge isActive={item.product.isActive} />
                        {low ? <LowStockBadge /> : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="mt-10 rounded-lg border border-zinc-200 bg-white">
        <header className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Tasks</h2>
          <p className="text-xs text-zinc-500">
            Tasks for this store. Manage open tasks from the Tasks page.
          </p>
        </header>
        {sortedTasks.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No tasks for this store." />
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {sortedTasks.map((task) => (
              <li key={task.id} className="px-5 py-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-zinc-900">{task.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{task.description}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Due {formatDate(task.dueDate)} ·{" "}
                      {formatRelative(task.dueDate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <TaskStatusBadge status={task.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
