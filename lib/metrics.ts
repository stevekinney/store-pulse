/**
 * Pure aggregation helpers for the operations dashboard.
 *
 * Status semantics (see also: README, plan):
 *   - Inactive products (isActive=false) are excluded from every low-stock
 *     metric, but still listed on product and store-detail pages with an
 *     "Inactive" label.
 *   - Closed stores (status="CLOSED") are excluded from low-stock metrics,
 *     active-task counts, urgent low-stock selections, recent-active-tasks,
 *     and the store-health rollup output. They still appear in /stores
 *     with the Closed badge.
 *   - Maintenance stores are included in every metric.
 *
 * These helpers take plain arrays and return plain shapes so they can be
 * unit-tested without a database.
 */

import { isLowStock, lowStockSeverity } from "./inventory";

export type StoreRecord = {
  id: string;
  storeNumber: string;
  name: string;
  city: string;
  state: string;
  region: string;
  status: string;
};

export type ProductRecord = {
  id: string;
  sku: string;
  name: string;
  category: string;
  reorderThreshold: number;
  isActive: boolean;
};

export type InventoryRecord = {
  id: string;
  storeId: string;
  productId: string;
  quantityOnHand: number;
  quantityOnOrder: number;
};

export type TaskRecord = {
  id: string;
  storeId: string;
  title: string;
  priority: string;
  status: string;
  dueDate: Date | null;
  createdAt: Date;
};

export type UrgentLowStockRow = {
  inventoryId: string;
  storeId: string;
  storeName: string;
  storeNumber: string;
  productId: string;
  productName: string;
  productSku: string;
  quantityOnHand: number;
  quantityOnOrder: number;
  reorderThreshold: number;
  severity: number;
};

export type RecentTaskRow = {
  taskId: string;
  storeId: string;
  storeName: string;
  title: string;
  priority: string;
  status: string;
  dueDate: Date | null;
};

export type StoreHealthRow = {
  storeId: string;
  storeName: string;
  storeNumber: string;
  region: string;
  status: string;
  activeTaskCount: number;
  lowStockCount: number;
};

export type DashboardMetrics = {
  storeCount: number;
  productCount: number;
  lowStockCount: number;
  activeTaskCount: number;
  urgentLowStock: UrgentLowStockRow[];
  recentActiveTasks: RecentTaskRow[];
  storeHealth: StoreHealthRow[];
};

const ACTIVE_TASK_STATUSES = new Set(["OPEN", "IN_PROGRESS"]);

function buildStoreLookup(stores: StoreRecord[]) {
  return new Map(stores.map((s) => [s.id, s]));
}

function buildProductLookup(products: ProductRecord[]) {
  return new Map(products.map((p) => [p.id, p]));
}

function isClosedStoreId(storeLookup: Map<string, StoreRecord>, storeId: string) {
  const store = storeLookup.get(storeId);
  return !store || store.status === "CLOSED";
}

export function countLowStock(
  inventory: InventoryRecord[],
  products: ProductRecord[],
  stores: StoreRecord[],
): number {
  const productLookup = buildProductLookup(products);
  const storeLookup = buildStoreLookup(stores);
  let count = 0;
  for (const item of inventory) {
    if (isClosedStoreId(storeLookup, item.storeId)) continue;
    const product = productLookup.get(item.productId);
    if (!product || !product.isActive) continue;
    if (isLowStock(item, product.reorderThreshold)) count += 1;
  }
  return count;
}

export function countActiveTasks(
  tasks: TaskRecord[],
  stores: StoreRecord[],
  opts: { storeId?: string } = {},
): number {
  const storeLookup = buildStoreLookup(stores);
  let count = 0;
  for (const task of tasks) {
    if (!ACTIVE_TASK_STATUSES.has(task.status)) continue;
    if (isClosedStoreId(storeLookup, task.storeId)) continue;
    if (opts.storeId && task.storeId !== opts.storeId) continue;
    count += 1;
  }
  return count;
}

export function selectUrgentLowStock(
  inventory: InventoryRecord[],
  products: ProductRecord[],
  stores: StoreRecord[],
  limit: number,
): UrgentLowStockRow[] {
  const productLookup = buildProductLookup(products);
  const storeLookup = buildStoreLookup(stores);
  const rows: UrgentLowStockRow[] = [];

  for (const item of inventory) {
    if (isClosedStoreId(storeLookup, item.storeId)) continue;
    const product = productLookup.get(item.productId);
    if (!product || !product.isActive) continue;
    if (!isLowStock(item, product.reorderThreshold)) continue;
    const store = storeLookup.get(item.storeId)!;
    rows.push({
      inventoryId: item.id,
      storeId: item.storeId,
      storeName: store.name,
      storeNumber: store.storeNumber,
      productId: item.productId,
      productName: product.name,
      productSku: product.sku,
      quantityOnHand: item.quantityOnHand,
      quantityOnOrder: item.quantityOnOrder,
      reorderThreshold: product.reorderThreshold,
      severity: lowStockSeverity(item, product.reorderThreshold),
    });
  }

  rows.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity - b.severity;
    if (a.productName !== b.productName)
      return a.productName.localeCompare(b.productName);
    return a.storeName.localeCompare(b.storeName);
  });

  return rows.slice(0, limit);
}

export function selectRecentActiveTasks(
  tasks: TaskRecord[],
  stores: StoreRecord[],
  limit: number,
): RecentTaskRow[] {
  const storeLookup = buildStoreLookup(stores);
  const rows: RecentTaskRow[] = [];

  for (const task of tasks) {
    if (!ACTIVE_TASK_STATUSES.has(task.status)) continue;
    if (isClosedStoreId(storeLookup, task.storeId)) continue;
    const store = storeLookup.get(task.storeId)!;
    rows.push({
      taskId: task.id,
      storeId: task.storeId,
      storeName: store.name,
      title: task.title,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    });
  }

  rows.sort((a, b) => {
    const aTime = a.dueDate ? a.dueDate.getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.dueDate ? b.dueDate.getTime() : Number.POSITIVE_INFINITY;
    if (aTime !== bTime) return aTime - bTime;
    return a.title.localeCompare(b.title);
  });

  return rows.slice(0, limit);
}

/**
 * Returns one row per non-CLOSED store passed in. CLOSED stores are
 * intentionally absent. Active-task and low-stock counts apply the
 * exclusion rules (inactive products skipped for low-stock).
 */
export function buildStoreHealthRollup(
  stores: StoreRecord[],
  inventory: InventoryRecord[],
  products: ProductRecord[],
  tasks: TaskRecord[],
): StoreHealthRow[] {
  const productLookup = buildProductLookup(products);
  const rows: StoreHealthRow[] = [];

  for (const store of stores) {
    if (store.status === "CLOSED") continue;

    let activeTaskCount = 0;
    for (const task of tasks) {
      if (task.storeId !== store.id) continue;
      if (!ACTIVE_TASK_STATUSES.has(task.status)) continue;
      activeTaskCount += 1;
    }

    let lowStockCount = 0;
    for (const item of inventory) {
      if (item.storeId !== store.id) continue;
      const product = productLookup.get(item.productId);
      if (!product || !product.isActive) continue;
      if (isLowStock(item, product.reorderThreshold)) lowStockCount += 1;
    }

    rows.push({
      storeId: store.id,
      storeName: store.name,
      storeNumber: store.storeNumber,
      region: store.region,
      status: store.status,
      activeTaskCount,
      lowStockCount,
    });
  }

  rows.sort((a, b) => a.storeName.localeCompare(b.storeName));
  return rows;
}

export function calculateDashboardMetrics(input: {
  stores: StoreRecord[];
  products: ProductRecord[];
  inventory: InventoryRecord[];
  tasks: TaskRecord[];
}): DashboardMetrics {
  const { stores, products, inventory, tasks } = input;
  return {
    storeCount: stores.length,
    productCount: products.filter((p) => p.isActive).length,
    lowStockCount: countLowStock(inventory, products, stores),
    activeTaskCount: countActiveTasks(tasks, stores),
    urgentLowStock: selectUrgentLowStock(inventory, products, stores, 5),
    recentActiveTasks: selectRecentActiveTasks(tasks, stores, 5),
    storeHealth: buildStoreHealthRollup(stores, inventory, products, tasks),
  };
}
