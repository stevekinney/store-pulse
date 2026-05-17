import { prisma } from "./db";
import type { ProductCategory } from "./types";

export async function listProducts(opts: { category?: ProductCategory | null } = {}) {
  return prisma.product.findMany({
    where: opts.category ? { category: opts.category } : undefined,
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
}
