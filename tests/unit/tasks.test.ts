import { describe, expect, it } from "vitest";
import {
  applyTaskCompletion,
  sortTasksForDisplay,
  TaskNotFoundError,
} from "../../lib/tasks";

describe("applyTaskCompletion", () => {
  const fixedNow = new Date("2026-05-17T12:00:00Z");

  it("sets status COMPLETED and completedAt on an OPEN task", () => {
    const task = { id: "1", status: "OPEN", completedAt: null };
    const result = applyTaskCompletion(task, fixedNow);
    expect(result.status).toBe("COMPLETED");
    expect(result.completedAt).toEqual(fixedNow);
  });

  it("sets status COMPLETED on an IN_PROGRESS task", () => {
    const task = { id: "2", status: "IN_PROGRESS", completedAt: null };
    const result = applyTaskCompletion(task, fixedNow);
    expect(result.status).toBe("COMPLETED");
    expect(result.completedAt).toEqual(fixedNow);
  });

  it("is a no-op on an already-completed task", () => {
    const previouslyCompletedAt = new Date("2026-01-01");
    const task = {
      id: "3",
      status: "COMPLETED",
      completedAt: previouslyCompletedAt,
    };
    const result = applyTaskCompletion(task, fixedNow);
    expect(result).toBe(task);
    expect(result.completedAt).toEqual(previouslyCompletedAt);
  });

  it("throws TaskNotFoundError on null input", () => {
    expect(() => applyTaskCompletion(null, fixedNow)).toThrow(TaskNotFoundError);
  });
});

describe("sortTasksForDisplay", () => {
  it("puts active tasks before completed; orders dueDate asc nulls last; then createdAt desc", () => {
    const tasks = [
      { id: "completed-old", status: "COMPLETED", dueDate: new Date("2026-01-01"), createdAt: new Date("2026-01-01") },
      { id: "active-no-due", status: "OPEN", dueDate: null, createdAt: new Date("2026-02-01") },
      { id: "active-soon", status: "IN_PROGRESS", dueDate: new Date("2026-06-01"), createdAt: new Date("2026-02-01") },
      { id: "active-later", status: "OPEN", dueDate: new Date("2026-07-01"), createdAt: new Date("2026-02-01") },
      { id: "active-no-due-newer", status: "OPEN", dueDate: null, createdAt: new Date("2026-03-01") },
    ];
    const sorted = sortTasksForDisplay(tasks);
    expect(sorted.map((t) => t.id)).toEqual([
      "active-soon",
      "active-later",
      "active-no-due-newer",
      "active-no-due",
      "completed-old",
    ]);
  });

  it("returns a new array, does not mutate input", () => {
    const tasks = [
      { id: "a", status: "OPEN", dueDate: null, createdAt: new Date() },
    ];
    const sorted = sortTasksForDisplay(tasks);
    expect(sorted).not.toBe(tasks);
  });
});
