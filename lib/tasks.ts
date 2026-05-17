import { prisma } from "./db";

export class TaskNotFoundError extends Error {
  constructor(public readonly taskId: string) {
    super(`Task not found: ${taskId}`);
    this.name = "TaskNotFoundError";
  }
}

export type TaskForCompletion = {
  id: string;
  status: string;
  completedAt: Date | null;
};

export type TaskForSort = {
  id: string;
  status: string;
  dueDate: Date | null;
  createdAt: Date;
};

/**
 * Pure transition: open or in-progress task becomes completed; already
 * completed task is returned unchanged; null input throws TaskNotFoundError.
 */
export function applyTaskCompletion<T extends TaskForCompletion>(
  task: T | null,
  now: Date = new Date(),
): T {
  if (!task) throw new TaskNotFoundError("(null)");
  if (task.status === "COMPLETED") return task;
  return { ...task, status: "COMPLETED", completedAt: now };
}

function statusBucket(status: string): number {
  return status === "COMPLETED" ? 1 : 0;
}

/**
 * Sort tasks for the /tasks page:
 *   1. Active (OPEN, IN_PROGRESS) before completed.
 *   2. dueDate ascending, nulls last.
 *   3. createdAt descending as a tie-break.
 */
export function sortTasksForDisplay<T extends TaskForSort>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    const ba = statusBucket(a.status);
    const bb = statusBucket(b.status);
    if (ba !== bb) return ba - bb;

    const aDue = a.dueDate ? a.dueDate.getTime() : Number.POSITIVE_INFINITY;
    const bDue = b.dueDate ? b.dueDate.getTime() : Number.POSITIVE_INFINITY;
    if (aDue !== bDue) return aDue - bDue;

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export async function listTasks() {
  return prisma.storeTask.findMany({
    include: { store: true },
  });
}

export async function getTasksByStore(storeId: string) {
  return prisma.storeTask.findMany({
    where: { storeId },
  });
}

export async function completeTask(taskId: string) {
  const existing = await prisma.storeTask.findUnique({ where: { id: taskId } });
  if (!existing) throw new TaskNotFoundError(taskId);
  if (existing.status === "COMPLETED") return existing;

  return prisma.storeTask.update({
    where: { id: taskId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
}
