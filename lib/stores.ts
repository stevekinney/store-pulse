import { prisma } from "./db";

export async function listStores() {
  return prisma.store.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getStoreById(id: string) {
  return prisma.store.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: [{ status: "asc" }, { dueDate: "asc" }] },
      inventory: {
        include: { product: true },
        orderBy: { product: { name: "asc" } },
      },
    },
  });
}
