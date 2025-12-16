import api from "./client";
import type { Task } from "../types/task";

type TaskQueryParams = {
  status?: string;
  priority?: string;
  sortByDueDate?: "asc" | "desc";
};

export const getTasks = async (
  params: TaskQueryParams = {}
): Promise<Task[]> => {
  const res = await api.get("/tasks", { params });
  return res.data;
};
