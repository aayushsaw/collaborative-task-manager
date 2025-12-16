import { CreateTaskInput } from "../dto/create-task.dto";
import { createTask } from "../repositories/task.repository";
import prisma from "../prisma/client";

import { getIO } from "../socket";

export const createTaskService = async (
  data: CreateTaskInput,
  creatorId: string
) => {
  const assignee = await prisma.user.findUnique({
    where: { id: data.assignedToId },
  });

  if (!assignee) {
    throw new Error("Assigned user does not exist");
  }

  const task = await createTask(data, creatorId);

  const io = getIO();

  // persist notification so it remains after refresh
  const notification = await prisma.notification.create({
    data: {
      userId: data.assignedToId,
      message: `A new task "${task.title}" has been assigned to you`,
    },
  });

  // emit notification event to the specific user room
  io.to(data.assignedToId).emit("notification:new", notification);

  // 🔄 Notify all users
  io.emit("task_updated", task);

  return task;
};



import {
  getTasksAssignedToUser,
  getTasksCreatedByUser,
  getOverdueTasks,
} from "../repositories/task.repository";

export const getMyTasksService = async (userId: string) => {
  return getTasksAssignedToUser(userId);
};

export const getCreatedTasksService = async (userId: string) => {
  return getTasksCreatedByUser(userId);
};

export const getOverdueTasksService = async (userId: string) => {
  return getOverdueTasks(userId);
};


import { getFilteredTasks } from "../repositories/task.repository";

export const getFilteredTasksService = async (
  userId: string,
  query: any,
  type: "assigned" | "created"
) => {
  const { status, priority, sort } = query;

  return getFilteredTasks(userId, {
    status,
    priority,
    sort,
    type,
  });
};


import { updateTask } from "../repositories/task.repository";
import { UpdateTaskInput } from "../dto/update-task.dto";

export const updateTaskService = async (
  taskId: string,
  data: UpdateTaskInput
) => {
  const task = await updateTask(taskId, data);

  const io = getIO();

  io.emit("task_updated", task);

  if (data.assignedToId) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.assignedToId,
        message: `You have been assigned the task "${task.title}"`,
      },
    });

    io.to(data.assignedToId).emit("notification:new", notification);
  }

  return task;
};


export const getAllRelatedTasksService = async (
  userId: string,
  query: any
) => {
  const { status, priority, sortByDueDate } = query;
  return getFilteredTasks(userId, {
    status,
    priority,
    sort: sortByDueDate === "asc" ? "asc" : "desc",
    type: "all" as any, // We need to update the repo to handle "all" or handle it here
  });
};

export const deleteTaskService = async (taskId: string) => {
  const io = getIO();
  await prisma.task.delete({ where: { id: taskId } });
  io.emit("task:deleted", { id: taskId });
};
