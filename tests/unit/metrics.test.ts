import { describe, expect, it } from "vitest";
import {
  buildStoreHealthRollup,
  calculateDashboardMetrics,
  countActiveTasks,
  countLowStock,
  selectRecentActiveTasks,
  selectUrgentLowStock,
  type InventoryRecord,
  type ProductRecord,
  type StoreRecord,
  type TaskRecord,
} from "../../lib/metrics";

const STORE_OPEN: StoreRecord = {
  id: "s-open",
  storeNumber: "0001",
  name: "Open Store",
  city: "Boston",
  state: "MA",
  region: "NORTHEAST",
  status: "OPEN",
};
const STORE_MAINT: StoreRecord = {
  ...STORE_OPEN,
  id: "s-maint",
  storeNumber: "0002",
  name: "Maintenance Store",
  status: "MAINTENANCE",
};
const STORE_CLOSED: StoreRecord = {
  ...STORE_OPEN,
  id: "s-closed",
  storeNumber: "0003",
  name: "Closed Store",
  status: "CLOSED",
};

const PRODUCT_ACTIVE: ProductRecord = {
  id: "p-active",
  sku: "A",
  name: "Active Product",
  category: "FOOD",
  reorderThreshold: 5,
  isActive: true,
};
const PRODUCT_INACTIVE: ProductRecord = {
  ...PRODUCT_ACTIVE,
  id: "p-inactive",
  sku: "B",
  name: "Inactive Product",
  isActive: false,
};

function inv(
  partial: Partial<InventoryRecord> & {
    storeId: string;
    productId: string;
    quantityOnHand: number;
  },
): InventoryRecord {
  return {
    id: `${partial.storeId}-${partial.productId}`,
    quantityOnOrder: 0,
    ...partial,
  };
}

function task(partial: Partial<TaskRecord> & { storeId: string; status: string }): TaskRecord {
  return {
    id: `t-${partial.storeId}-${partial.status}-${partial.title ?? "x"}`,
    title: "task",
    priority: "MEDIUM",
    dueDate: null,
    createdAt: new Date("2026-01-01"),
    ...partial,
  };
}

describe("countLowStock", () => {
  const stores = [STORE_OPEN, STORE_MAINT, STORE_CLOSED];
  const products = [PRODUCT_ACTIVE, PRODUCT_INACTIVE];

  it("counts low stock for active products at non-closed stores", () => {
    const inventory: InventoryRecord[] = [
      inv({ storeId: STORE_OPEN.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 2 }), // low
      inv({ storeId: STORE_MAINT.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 1 }), // low
      inv({ storeId: STORE_OPEN.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 99 }), // not low
    ];
    expect(countLowStock(inventory, products, stores)).toBe(2);
  });

  it("excludes low stock at CLOSED stores", () => {
    const inventory: InventoryRecord[] = [
      inv({ storeId: STORE_CLOSED.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 0 }),
    ];
    expect(countLowStock(inventory, products, stores)).toBe(0);
  });

  it("excludes low stock for inactive products", () => {
    const inventory: InventoryRecord[] = [
      inv({ storeId: STORE_OPEN.id, productId: PRODUCT_INACTIVE.id, quantityOnHand: 0 }),
    ];
    expect(countLowStock(inventory, products, stores)).toBe(0);
  });
});

describe("countActiveTasks", () => {
  const stores = [STORE_OPEN, STORE_MAINT, STORE_CLOSED];

  it("counts OPEN and IN_PROGRESS tasks at non-closed stores", () => {
    const tasks = [
      task({ storeId: STORE_OPEN.id, status: "OPEN" }),
      task({ storeId: STORE_OPEN.id, status: "IN_PROGRESS" }),
      task({ storeId: STORE_MAINT.id, status: "OPEN" }),
      task({ storeId: STORE_OPEN.id, status: "COMPLETED" }),
    ];
    expect(countActiveTasks(tasks, stores)).toBe(3);
  });

  it("excludes tasks at CLOSED stores", () => {
    const tasks = [
      task({ storeId: STORE_CLOSED.id, status: "OPEN" }),
      task({ storeId: STORE_CLOSED.id, status: "IN_PROGRESS" }),
    ];
    expect(countActiveTasks(tasks, stores)).toBe(0);
  });

  it("filters by storeId when provided", () => {
    const tasks = [
      task({ storeId: STORE_OPEN.id, status: "OPEN" }),
      task({ storeId: STORE_MAINT.id, status: "OPEN" }),
    ];
    expect(countActiveTasks(tasks, stores, { storeId: STORE_OPEN.id })).toBe(1);
  });
});

describe("selectUrgentLowStock", () => {
  const stores = [STORE_OPEN, STORE_MAINT, STORE_CLOSED];
  const products = [PRODUCT_ACTIVE, PRODUCT_INACTIVE];

  it("orders by severity ascending and limits results", () => {
    const inventory: InventoryRecord[] = [
      inv({ id: "i-1", storeId: STORE_OPEN.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 4 }), // severity 0.8
      inv({ id: "i-2", storeId: STORE_OPEN.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 0 }), // severity 0
      inv({ id: "i-3", storeId: STORE_MAINT.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 2 }), // severity 0.4
    ];
    const rows = selectUrgentLowStock(inventory, products, stores, 2);
    expect(rows.map((r) => r.inventoryId)).toEqual(["i-2", "i-3"]);
  });

  it("excludes closed-store inventory and inactive products", () => {
    const inventory: InventoryRecord[] = [
      inv({ id: "closed", storeId: STORE_CLOSED.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 0 }),
      inv({ id: "inactive", storeId: STORE_OPEN.id, productId: PRODUCT_INACTIVE.id, quantityOnHand: 0 }),
    ];
    expect(selectUrgentLowStock(inventory, products, stores, 10)).toEqual([]);
  });
});

describe("selectRecentActiveTasks", () => {
  const stores = [STORE_OPEN, STORE_CLOSED];

  it("excludes COMPLETED and CLOSED-store tasks; orders by due date nulls last", () => {
    const tasks = [
      task({ id: "a", storeId: STORE_OPEN.id, status: "OPEN", title: "a", dueDate: new Date("2026-06-01") }),
      task({ id: "b", storeId: STORE_OPEN.id, status: "IN_PROGRESS", title: "b", dueDate: null }),
      task({ id: "c", storeId: STORE_OPEN.id, status: "OPEN", title: "c", dueDate: new Date("2026-05-01") }),
      task({ id: "d", storeId: STORE_OPEN.id, status: "COMPLETED", title: "d", dueDate: new Date("2026-04-01") }),
      task({ id: "e", storeId: STORE_CLOSED.id, status: "OPEN", title: "e", dueDate: new Date("2026-04-01") }),
    ];
    const rows = selectRecentActiveTasks(tasks, stores, 10);
    expect(rows.map((r) => r.taskId)).toEqual(["c", "a", "b"]);
  });
});

describe("buildStoreHealthRollup", () => {
  it("returns one row per non-CLOSED store", () => {
    const stores = [STORE_OPEN, STORE_MAINT, STORE_CLOSED];
    const rows = buildStoreHealthRollup(stores, [], [], []);
    expect(rows.map((r) => r.storeId).sort()).toEqual(
      [STORE_OPEN.id, STORE_MAINT.id].sort(),
    );
  });

  it("counts active tasks and low-stock items per included store", () => {
    const stores = [STORE_OPEN, STORE_CLOSED];
    const inventory = [
      inv({ storeId: STORE_OPEN.id, productId: PRODUCT_ACTIVE.id, quantityOnHand: 1 }), // low
      inv({ storeId: STORE_OPEN.id, productId: PRODUCT_INACTIVE.id, quantityOnHand: 0 }), // inactive ignored
    ];
    const tasks = [
      task({ storeId: STORE_OPEN.id, status: "OPEN" }),
      task({ storeId: STORE_OPEN.id, status: "COMPLETED" }),
    ];
    const rows = buildStoreHealthRollup(
      stores,
      inventory,
      [PRODUCT_ACTIVE, PRODUCT_INACTIVE],
      tasks,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].activeTaskCount).toBe(1);
    expect(rows[0].lowStockCount).toBe(1);
  });
});

describe("calculateDashboardMetrics", () => {
  it("counts all stores but only active products", () => {
    const stores = [STORE_OPEN, STORE_MAINT, STORE_CLOSED];
    const products = [PRODUCT_ACTIVE, PRODUCT_INACTIVE];
    const metrics = calculateDashboardMetrics({
      stores,
      products,
      inventory: [],
      tasks: [],
    });
    expect(metrics.storeCount).toBe(3); // includes closed
    expect(metrics.productCount).toBe(1); // active only
    expect(metrics.lowStockCount).toBe(0);
    expect(metrics.activeTaskCount).toBe(0);
  });
});
