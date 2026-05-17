import { completeTaskAction } from "@/app/tasks/actions";

export function CompleteTaskButton({
  taskId,
  taskTitle,
}: {
  taskId: string;
  taskTitle: string;
}) {
  return (
    <form action={completeTaskAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <button
        type="submit"
        aria-label={`Mark "${taskTitle}" complete`}
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-700"
      >
        Mark complete
      </button>
    </form>
  );
}
