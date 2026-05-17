import Link from "next/link";
import { CompleteTaskButton } from "@/components/complete-task-button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import {
  PriorityBadge,
  TaskStatusBadge,
} from "@/components/status-badge";
import { listTasks, sortTasksForDisplay } from "@/lib/tasks";
import { formatDate, formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await listTasks();
  const sorted = sortTasksForDisplay(tasks);

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Operational tasks across all stores. Completed tasks remain visible for reference."
      />

      {sorted.length === 0 ? (
        <EmptyState message="No tasks." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="min-w-full divide-y divide-zinc-100 text-sm">
            <caption className="sr-only">All store tasks</caption>
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Task
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Store
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Priority
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Status
                </th>
                <th scope="col" className="px-5 py-2 text-left font-medium text-zinc-600">
                  Due
                </th>
                <th scope="col" className="px-5 py-2 text-right font-medium text-zinc-600">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {sorted.map((task) => (
                <tr key={task.id} className="hover:bg-zinc-50">
                  <th
                    scope="row"
                    className="px-5 py-2 text-left font-normal text-zinc-900"
                  >
                    <span className="block font-medium">{task.title}</span>
                    <span className="block text-xs text-zinc-500">
                      {task.description}
                    </span>
                  </th>
                  <td className="px-5 py-2 text-zinc-600">
                    <Link
                      href={`/stores/${task.storeId}`}
                      className="hover:underline"
                    >
                      {task.store.name}
                    </Link>
                  </td>
                  <td className="px-5 py-2">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-5 py-2">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="px-5 py-2 text-xs text-zinc-600">
                    <div>{formatDate(task.dueDate)}</div>
                    <div className="text-zinc-500">
                      {formatRelative(task.dueDate)}
                    </div>
                  </td>
                  <td className="px-5 py-2 text-right">
                    {task.status === "COMPLETED" ? null : (
                      <CompleteTaskButton
                        taskId={task.id}
                        taskTitle={task.title}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
