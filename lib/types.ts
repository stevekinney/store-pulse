export const STORE_STATUSES = ["OPEN", "MAINTENANCE", "CLOSED"] as const;
export type StoreStatus = (typeof STORE_STATUSES)[number];

export const STORE_STATUS_LABELS: Record<StoreStatus, string> = {
  OPEN: "Open",
  MAINTENANCE: "Maintenance",
  CLOSED: "Closed",
};

export const PRODUCT_CATEGORIES = [
  "FOOD",
  "LITTER",
  "AQUATICS",
  "BIRD",
  "SMALL_ANIMAL",
  "HEALTH",
  "TOYS",
  "FURNITURE",
  "GROOMING",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  FOOD: "Food",
  LITTER: "Litter",
  AQUATICS: "Aquatics",
  BIRD: "Bird",
  SMALL_ANIMAL: "Small animal",
  HEALTH: "Health",
  TOYS: "Toys",
  FURNITURE: "Furniture",
  GROOMING: "Grooming",
};

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const TASK_STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

function makeParser<T extends string>(allowed: readonly T[]) {
  const set = new Set<string>(allowed);
  return (input: unknown): T | null => {
    if (typeof input !== "string" || input.length === 0) return null;
    return set.has(input) ? (input as T) : null;
  };
}

export const parseStoreStatus = makeParser(STORE_STATUSES);
export const parseProductCategory = makeParser(PRODUCT_CATEGORIES);
export const parseTaskPriority = makeParser(TASK_PRIORITIES);
export const parseTaskStatus = makeParser(TASK_STATUSES);

export function assertStoreStatus(input: unknown): StoreStatus {
  const parsed = parseStoreStatus(input);
  if (!parsed) throw new Error(`Invalid store status: ${String(input)}`);
  return parsed;
}

export function assertProductCategory(input: unknown): ProductCategory {
  const parsed = parseProductCategory(input);
  if (!parsed) throw new Error(`Invalid product category: ${String(input)}`);
  return parsed;
}

export function assertTaskPriority(input: unknown): TaskPriority {
  const parsed = parseTaskPriority(input);
  if (!parsed) throw new Error(`Invalid task priority: ${String(input)}`);
  return parsed;
}

export function assertTaskStatus(input: unknown): TaskStatus {
  const parsed = parseTaskStatus(input);
  if (!parsed) throw new Error(`Invalid task status: ${String(input)}`);
  return parsed;
}
