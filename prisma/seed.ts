import { PrismaClient } from "@prisma/client";
import {
  assertProductCategory,
  assertStoreStatus,
  assertTaskPriority,
  assertTaskStatus,
} from "../lib/types";

const prisma = new PrismaClient();

const STORES = [
  {
    storeNumber: "0142",
    name: "Brookline Center",
    city: "Brookline",
    state: "MA",
    region: "NORTHEAST",
    status: "OPEN",
  },
  {
    storeNumber: "0207",
    name: "Hartford Junction",
    city: "Hartford",
    state: "CT",
    region: "NORTHEAST",
    status: "OPEN",
  },
  {
    storeNumber: "0318",
    name: "Greensboro Commons",
    city: "Greensboro",
    state: "NC",
    region: "SOUTHEAST",
    status: "MAINTENANCE",
  },
  {
    storeNumber: "0421",
    name: "Tampa Bayside",
    city: "Tampa",
    state: "FL",
    region: "SOUTHEAST",
    status: "OPEN",
  },
  {
    storeNumber: "0533",
    name: "Naperville Crossing",
    city: "Naperville",
    state: "IL",
    region: "MIDWEST",
    status: "OPEN",
  },
  {
    storeNumber: "0644",
    name: "Madison Lakes",
    city: "Madison",
    state: "WI",
    region: "MIDWEST",
    status: "OPEN",
  },
  {
    storeNumber: "0755",
    name: "Tempe Marketplace",
    city: "Tempe",
    state: "AZ",
    region: "WEST",
    status: "OPEN",
  },
  {
    storeNumber: "0860",
    name: "Spokane Riverside",
    city: "Spokane",
    state: "WA",
    region: "WEST",
    status: "CLOSED",
  },
] as const;

const PRODUCTS = [
  { sku: "FD-DOG-001", name: "Premium Adult Dog Food, 30lb", category: "FOOD", supplier: "Northwind Pet Co.", unitCostCents: 4299, reorderThreshold: 8, isActive: true },
  { sku: "FD-CAT-002", name: "Indoor Cat Formula, 16lb", category: "FOOD", supplier: "Northwind Pet Co.", unitCostCents: 2499, reorderThreshold: 10, isActive: true },
  { sku: "FD-DOG-003", name: "Senior Dog Joint Support Food", category: "FOOD", supplier: "Acme Nutrition", unitCostCents: 5199, reorderThreshold: 6, isActive: true },
  { sku: "LT-CAT-010", name: "Clumping Cat Litter, 35lb", category: "LITTER", supplier: "Bluepaw Supplies", unitCostCents: 1899, reorderThreshold: 12, isActive: true },
  { sku: "LT-CAT-011", name: "Natural Pine Litter, 20lb", category: "LITTER", supplier: "Bluepaw Supplies", unitCostCents: 1499, reorderThreshold: 8, isActive: true },
  { sku: "AQ-FLT-020", name: "Aquarium Canister Filter", category: "AQUATICS", supplier: "Reef & Stream Co.", unitCostCents: 8999, reorderThreshold: 3, isActive: true },
  { sku: "AQ-FOOD-021", name: "Tropical Fish Flakes", category: "AQUATICS", supplier: "Reef & Stream Co.", unitCostCents: 599, reorderThreshold: 15, isActive: true },
  { sku: "BD-SEED-030", name: "Wild Bird Seed Blend, 25lb", category: "BIRD", supplier: "Meadowlark Mills", unitCostCents: 1799, reorderThreshold: 10, isActive: true },
  { sku: "BD-PARROT-031", name: "Parrot Pellet Mix", category: "BIRD", supplier: "Meadowlark Mills", unitCostCents: 2199, reorderThreshold: 5, isActive: true },
  { sku: "SA-BED-040", name: "Small Animal Bedding, 60L", category: "SMALL_ANIMAL", supplier: "Hayfield Inc.", unitCostCents: 1399, reorderThreshold: 8, isActive: true },
  { sku: "SA-CHEW-041", name: "Rabbit Chew Toy Variety Pack", category: "SMALL_ANIMAL", supplier: "Hayfield Inc.", unitCostCents: 999, reorderThreshold: 6, isActive: true },
  { sku: "HL-FLEA-050", name: "Flea & Tick Treatment, 6 dose", category: "HEALTH", supplier: "Caregrove Labs", unitCostCents: 4499, reorderThreshold: 5, isActive: true },
  { sku: "HL-VIT-051", name: "Multivitamin Chews for Dogs", category: "HEALTH", supplier: "Caregrove Labs", unitCostCents: 2299, reorderThreshold: 7, isActive: true },
  { sku: "HL-DENT-052", name: "Dental Chews, Discontinued", category: "HEALTH", supplier: "Caregrove Labs", unitCostCents: 1899, reorderThreshold: 4, isActive: false },
  { sku: "TY-DOG-060", name: "Tough Rubber Chew Toy", category: "TOYS", supplier: "Pawcraft Toys", unitCostCents: 1299, reorderThreshold: 10, isActive: true },
  { sku: "TY-CAT-061", name: "Feather Wand Cat Toy", category: "TOYS", supplier: "Pawcraft Toys", unitCostCents: 699, reorderThreshold: 12, isActive: true },
  { sku: "FN-CAT-070", name: "3-Tier Cat Tree", category: "FURNITURE", supplier: "Loftnest Co.", unitCostCents: 7999, reorderThreshold: 2, isActive: true },
  { sku: "FN-DOG-071", name: "Orthopedic Dog Bed, Large", category: "FURNITURE", supplier: "Loftnest Co.", unitCostCents: 6499, reorderThreshold: 3, isActive: true },
  { sku: "GR-SHAM-080", name: "Oatmeal Pet Shampoo, 24oz", category: "GROOMING", supplier: "Suds & Co.", unitCostCents: 1199, reorderThreshold: 8, isActive: true },
  { sku: "GR-BRUSH-081", name: "Slicker Brush, Dual Sided", category: "GROOMING", supplier: "Suds & Co.", unitCostCents: 899, reorderThreshold: 6, isActive: true },
] as const;

type SeedTask = {
  storeNumber: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  daysFromNow: number | null;
  completedDaysAgo: number | null;
};

const TASKS: SeedTask[] = [
  { storeNumber: "0142", title: "Restock dog food endcap", description: "The dog food endcap by the front entrance is nearly empty. Pull from back stock and rebuild the display.", priority: "HIGH", status: "OPEN", daysFromNow: 1, completedDaysAgo: null },
  { storeNumber: "0142", title: "Address fish tank temperature drift", description: "Tropical tank is reading 4 degrees below target. Investigate heater.", priority: "URGENT", status: "IN_PROGRESS", daysFromNow: 0, completedDaysAgo: null },
  { storeNumber: "0142", title: "Quarterly grooming station deep clean", description: "Pull all bays, sanitize, recalibrate clipper stations.", priority: "MEDIUM", status: "OPEN", daysFromNow: 6, completedDaysAgo: null },
  { storeNumber: "0207", title: "Investigate freezer alarm", description: "Receiving freezer triggered overnight. Confirm temps and document.", priority: "URGENT", status: "OPEN", daysFromNow: 0, completedDaysAgo: null },
  { storeNumber: "0207", title: "Reset litter aisle planogram", description: "New planogram dropped Monday. Pull old signage, reset shelves.", priority: "MEDIUM", status: "OPEN", daysFromNow: 4, completedDaysAgo: null },
  { storeNumber: "0207", title: "Replace burnt bulbs in aquatics", description: "Aisle 7 has three out. Use LED equivalents from supply room.", priority: "LOW", status: "COMPLETED", daysFromNow: -3, completedDaysAgo: 2 },
  { storeNumber: "0318", title: "Coordinate HVAC repair visit", description: "Vendor scheduled for Thursday. Confirm access window with mall ops.", priority: "HIGH", status: "IN_PROGRESS", daysFromNow: 2, completedDaysAgo: null },
  { storeNumber: "0318", title: "Audit damaged-stock bin", description: "Bin has not been processed in two weeks per regional report.", priority: "MEDIUM", status: "OPEN", daysFromNow: 3, completedDaysAgo: null },
  { storeNumber: "0421", title: "Reorganize small animal habitat wall", description: "Customer feedback says habitats are hard to compare. Group by species.", priority: "LOW", status: "OPEN", daysFromNow: 10, completedDaysAgo: null },
  { storeNumber: "0421", title: "Train two associates on POS refunds", description: "Both new hires need shadow time on returns/refunds workflow.", priority: "MEDIUM", status: "IN_PROGRESS", daysFromNow: 5, completedDaysAgo: null },
  { storeNumber: "0421", title: "Refill grooming retail consumables", description: "Shampoo and conditioner running low at the salon station.", priority: "HIGH", status: "COMPLETED", daysFromNow: -1, completedDaysAgo: 1 },
  { storeNumber: "0533", title: "Plan adoption-event setup", description: "Local rescue partner arrives Saturday. Confirm crates, signage, table layout.", priority: "HIGH", status: "OPEN", daysFromNow: 4, completedDaysAgo: null },
  { storeNumber: "0533", title: "Replace leaking dog wash drain trap", description: "Maintenance ticket #4419. Parts arriving Wednesday.", priority: "MEDIUM", status: "IN_PROGRESS", daysFromNow: 2, completedDaysAgo: null },
  { storeNumber: "0644", title: "Update bird seed pricing labels", description: "Promo ends Sunday. Swap back to regular price tags.", priority: "LOW", status: "OPEN", daysFromNow: 3, completedDaysAgo: null },
  { storeNumber: "0644", title: "Retrain team on rabies-tag log policy", description: "Compliance audit flagged inconsistent entries last quarter.", priority: "MEDIUM", status: "OPEN", daysFromNow: 7, completedDaysAgo: null },
  { storeNumber: "0755", title: "Audit cat tree inventory", description: "Receiving counted +6 more than the system shows.", priority: "LOW", status: "COMPLETED", daysFromNow: -5, completedDaysAgo: 4 },
  { storeNumber: "0755", title: "Investigate damaged shipment of dog beds", description: "Two of six cartons arrived crushed. Photograph and file claim.", priority: "HIGH", status: "OPEN", daysFromNow: 1, completedDaysAgo: null },
  { storeNumber: "0755", title: "Refresh end-of-aisle promo display", description: "Swap dog food promo for the seasonal grooming bundle.", priority: "MEDIUM", status: "OPEN", daysFromNow: null, completedDaysAgo: null },
  { storeNumber: "0860", title: "Coordinate inventory transfer to 0755", description: "Outstanding from store closure. Confirm pallets shipped.", priority: "MEDIUM", status: "OPEN", daysFromNow: 5, completedDaysAgo: null },
  { storeNumber: "0860", title: "Finalize closure documentation", description: "Property handoff to landlord scheduled. Compile required paperwork.", priority: "HIGH", status: "IN_PROGRESS", daysFromNow: 3, completedDaysAgo: null },
];

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

function assertSeedInvariants() {
  for (const t of TASKS) {
    const isCompleted = t.status === "COMPLETED";
    if (isCompleted && t.completedDaysAgo === null) {
      throw new Error(
        `Seed invariant violated: completed task "${t.title}" has null completedDaysAgo`,
      );
    }
    if (!isCompleted && t.completedDaysAgo !== null) {
      throw new Error(
        `Seed invariant violated: non-completed task "${t.title}" has completedDaysAgo`,
      );
    }
  }
  for (const p of PRODUCTS) {
    if (p.reorderThreshold < 1) {
      throw new Error(
        `Seed invariant violated: product "${p.sku}" has reorderThreshold < 1`,
      );
    }
  }
  // Validate enum values via the parser-asserters.
  for (const s of STORES) assertStoreStatus(s.status);
  for (const p of PRODUCTS) assertProductCategory(p.category);
  for (const t of TASKS) {
    assertTaskPriority(t.priority);
    assertTaskStatus(t.status);
  }
}

async function main() {
  assertSeedInvariants();

  await prisma.storeTask.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();

  const stores = await Promise.all(
    STORES.map((s) => prisma.store.create({ data: { ...s } })),
  );
  const storesByNumber = new Map(stores.map((s) => [s.storeNumber, s]));

  const products = await Promise.all(
    PRODUCTS.map((p) => prisma.product.create({ data: { ...p } })),
  );

  // Inventory: one row per (store, product). Force ~15-20% of (store, product)
  // pairs below threshold so the dashboard has meaningful low-stock alerts.
  // Deterministic distribution via index arithmetic.
  const inventoryRows: {
    storeId: string;
    productId: string;
    quantityOnHand: number;
    quantityOnOrder: number;
    lastRestockedAt: Date;
  }[] = [];

  let flatIndex = 0;
  for (let s = 0; s < stores.length; s += 1) {
    for (let p = 0; p < products.length; p += 1) {
      const store = stores[s];
      const product = products[p];
      // ~17% below threshold (every 6th pair). Skewed slightly by index sum
      // so different products go low at different stores.
      const isLow = (flatIndex + s + p) % 6 === 0;
      const onHand = isLow
        ? Math.max(0, product.reorderThreshold - 2 - (p % 3))
        : product.reorderThreshold + 4 + (p % 7);
      const onOrder = isLow && p % 2 === 0 ? 1 : 0;
      const lastRestocked = daysFromNow(-(3 + ((s + p) % 14)));
      inventoryRows.push({
        storeId: store.id,
        productId: product.id,
        quantityOnHand: onHand,
        quantityOnOrder: onOrder,
        lastRestockedAt: lastRestocked,
      });
      flatIndex += 1;
    }
  }

  await prisma.inventoryItem.createMany({ data: inventoryRows });

  for (const t of TASKS) {
    const store = storesByNumber.get(t.storeNumber);
    if (!store) throw new Error(`Seed: unknown storeNumber ${t.storeNumber}`);
    await prisma.storeTask.create({
      data: {
        storeId: store.id,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: t.daysFromNow === null ? null : daysFromNow(t.daysFromNow),
        completedAt:
          t.completedDaysAgo === null ? null : daysFromNow(-t.completedDaysAgo),
      },
    });
  }

  console.log(
    `Seeded ${stores.length} stores, ${products.length} products, ${inventoryRows.length} inventory items, ${TASKS.length} tasks.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
