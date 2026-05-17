import { prisma } from "./db";

export type InventoryQuantity = {
  quantityOnHand: number;
  quantityOnOrder: number;
};

export function isLowStock(item: InventoryQuantity, threshold: number): boolean {
  return item.quantityOnHand + item.quantityOnOrder <= threshold;
}

export function lowStockSeverity(
  item: InventoryQuantity,
  reorderThreshold: number,
): number {
  const denom = Math.max(reorderThreshold, 1);
  return (item.quantityOnHand + item.quantityOnOrder) / denom;
}

export async function getStoreInventory(storeId: string) {
  return prisma.inventoryItem.findMany({
    where: { storeId },
    include: { product: true },
    orderBy: { product: { name: "asc" } },
  });
}
