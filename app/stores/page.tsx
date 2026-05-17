import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StoreStatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/db";
import {
  buildStoreHealthRollup,
  type StoreHealthRow,
} from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const [stores, inventory, products, tasks] = await Promise.all([
    prisma.store.findMany({ orderBy: { name: "asc" } }),
    prisma.inventoryItem.findMany(),
    prisma.product.findMany(),
    prisma.storeTask.findMany(),
  ]);

  const rollup = buildStoreHealthRollup(stores, inventory, products, tasks);
  const rollupById = new Map<string, StoreHealthRow>(
    rollup.map((row) => [row.storeId, row]),
  );

  return (
    <div>
      <PageHeader
        title="Stores"
        description="All locations across the chain. Closed stores are listed but excluded from operational metrics."
      />

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-100 text-sm">
          <caption className="sr-only">All stores with operational counts</caption>
          <thead className="bg-zinc-50">
            <tr>
              <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                Store
              </th>
              <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                Location
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
            {stores.map((store) => {
              const row = rollupById.get(store.id);
              const isClosed = store.status === "CLOSED";
              return (
                <tr key={store.id} className="hover:bg-zinc-50">
                  <th
                    scope="row"
                    className="px-5 py-2 text-left font-normal text-zinc-900"
                  >
                    <Link
                      href={`/stores/${store.id}`}
                      className="hover:underline"
                    >
                      {store.name}{" "}
                      <span className="text-xs text-zinc-500">
                        #{store.storeNumber}
                      </span>
                    </Link>
                  </th>
                  <td className="px-5 py-2 text-zinc-600">
                    {store.city}, {store.state}
                  </td>
                  <td className="px-5 py-2 text-zinc-600">{store.region}</td>
                  <td className="px-5 py-2">
                    <StoreStatusBadge status={store.status} />
                  </td>
                  <td
                    className="px-5 py-2 text-right"
                    aria-label={
                      isClosed
                        ? "Closed stores are excluded from operational metrics"
                        : undefined
                    }
                  >
                    {isClosed ? "—" : (row?.activeTaskCount ?? 0)}
                  </td>
                  <td
                    className="px-5 py-2 text-right"
                    aria-label={
                      isClosed
                        ? "Closed stores are excluded from operational metrics"
                        : undefined
                    }
                  >
                    {isClosed ? "—" : (row?.lowStockCount ?? 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
