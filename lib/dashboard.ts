import { prisma } from "./db";
import {
  calculateDashboardMetrics,
  type DashboardMetrics,
} from "./metrics";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [stores, products, inventory, tasks] = await Promise.all([
    prisma.store.findMany(),
    prisma.product.findMany(),
    prisma.inventoryItem.findMany(),
    prisma.storeTask.findMany(),
  ]);

  return calculateDashboardMetrics({ stores, products, inventory, tasks });
}
