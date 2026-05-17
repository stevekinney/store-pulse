"use server";

import { revalidatePath } from "next/cache";
import { completeTask } from "@/lib/tasks";

export async function completeTaskAction(formData: FormData) {
  const raw = formData.get("taskId");
  if (typeof raw !== "string" || raw.length === 0) {
    throw new Error("taskId is required");
  }
  await completeTask(raw);
  revalidatePath("/tasks");
  revalidatePath("/");
}
