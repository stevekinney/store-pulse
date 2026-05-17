import clsx from "clsx";
import {
  STORE_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type StoreStatus,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/types";

const BASE = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium";

const STORE_STATUS_CLASSES: Record<StoreStatus, string> = {
  OPEN: "bg-emerald-100 text-emerald-800",
  MAINTENANCE: "bg-amber-100 text-amber-800",
  CLOSED: "bg-zinc-200 text-zinc-700",
};

export function StoreStatusBadge({ status }: { status: string }) {
  const key = (STORE_STATUS_LABELS[status as StoreStatus] ? (status as StoreStatus) : "CLOSED");
  return (
    <span className={clsx(BASE, STORE_STATUS_CLASSES[key])}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {STORE_STATUS_LABELS[key] ?? status}
    </span>
  );
}

const TASK_STATUS_CLASSES: Record<TaskStatus, string> = {
  OPEN: "bg-sky-100 text-sky-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
};

export function TaskStatusBadge({ status }: { status: string }) {
  const key = TASK_STATUS_LABELS[status as TaskStatus] ? (status as TaskStatus) : "OPEN";
  return (
    <span className={clsx(BASE, TASK_STATUS_CLASSES[key])}>
      {TASK_STATUS_LABELS[key] ?? status}
    </span>
  );
}

const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  LOW: "bg-zinc-100 text-zinc-700",
  MEDIUM: "bg-sky-100 text-sky-800",
  HIGH: "bg-amber-100 text-amber-800",
  URGENT: "bg-rose-100 text-rose-800",
};

export function PriorityBadge({ priority }: { priority: string }) {
  const key = TASK_PRIORITY_LABELS[priority as TaskPriority]
    ? (priority as TaskPriority)
    : "LOW";
  return (
    <span className={clsx(BASE, PRIORITY_CLASSES[key])}>
      {TASK_PRIORITY_LABELS[key] ?? priority}
    </span>
  );
}

export function LowStockBadge() {
  return (
    <span className={clsx(BASE, "bg-rose-100 text-rose-800")}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      Low stock
    </span>
  );
}

export function ActiveProductBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={clsx(
        BASE,
        isActive ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-700",
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
